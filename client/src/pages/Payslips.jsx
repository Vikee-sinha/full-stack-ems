
import { useState } from 'react'
import { DownloadIcon, PlusIcon, XIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { dummyEmployeeData, dummyPayslipData, dummyProfileData } from '../assets/assets'
import { getCurrentUser } from '../auth'

const EMPTY_GENERATION_FORM = {
  employeeId: dummyEmployeeData[0]?.id || '',
  month: String(new Date().getMonth() + 1),
  year: String(new Date().getFullYear()),
  basicSalary: String(dummyEmployeeData[0]?.basicSalary || 0),
  allowances: String(dummyEmployeeData[0]?.allowances || 0),
  deductions: String(dummyEmployeeData[0]?.deductions || 0),
}

function getPayslipEmployee(payslip) {
  const relatedEmployee = Array.isArray(payslip.employee) ? payslip.employee[0] : payslip.employee
  if (relatedEmployee && typeof relatedEmployee === 'object') return relatedEmployee

  return dummyEmployeeData.find((employee) =>
    (employee.id || employee._id) === payslip.employeeId,
  )
}

function formatPeriod(month, year) {
  if (!month || !year) return '—'
  return new Date(Date.UTC(Number(year), Number(month) - 1, 1))
    .toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)
}

//  const isAdmin = true // instead of currentUser?.role === 'ADMIN'

function Payslips() {
  const currentUser = getCurrentUser()
  const isAdmin = currentUser?.role === 'ADMIN'
  const navigate = useNavigate()
  const [payslips, setPayslips] = useState(dummyPayslipData)
  const [showGenerateForm, setShowGenerateForm] = useState(false)
  const [generationForm, setGenerationForm] = useState(EMPTY_GENERATION_FORM)
  const [formError, setFormError] = useState('')

  const currentEmployee = dummyEmployeeData.find((employee) =>
    employee.id === currentUser?.employeeId
      || employee._id === currentUser?.employeeId
      || [employee.email, employee.user?.email, employee.userId?.email]
        .some((email) => email?.toLowerCase() === currentUser?.email?.trim().toLowerCase()),
  ) || dummyEmployeeData.find((employee) =>
    employee.firstName?.toLowerCase() === currentUser?.firstName?.toLowerCase()
      && employee.lastName?.toLowerCase() === currentUser?.lastName?.toLowerCase(),
  ) || dummyEmployeeData.find((employee) =>
    (employee.id || employee._id) === dummyProfileData._id,
  )
  const currentEmployeeId = currentEmployee?.id || currentEmployee?._id || currentUser?.employeeId
  const visiblePayslips = isAdmin
    ? payslips
    : payslips.filter((payslip) => payslip.employeeId === currentEmployeeId)

  const openGenerateForm = () => {
    const employee = dummyEmployeeData[0]
    setGenerationForm({
      employeeId: employee?.id || employee?._id || '',
      month: String(new Date().getMonth() + 1),
      year: String(new Date().getFullYear()),
      basicSalary: String(employee?.basicSalary || 0),
      allowances: String(employee?.allowances || 0),
      deductions: String(employee?.deductions || 0),
    })
    setFormError('')
    setShowGenerateForm(true)
  }

  const updateEmployee = (employeeId) => {
    const employee = dummyEmployeeData.find((item) =>
      (item.id || item._id) === employeeId,
    )
    setGenerationForm((current) => ({
      ...current,
      employeeId,
      basicSalary: String(employee?.basicSalary || 0),
      allowances: String(employee?.allowances || 0),
      deductions: String(employee?.deductions || 0),
    }))
  }

  const handleGenerate = (event) => {
    event.preventDefault()
    setFormError('')

    const employee = dummyEmployeeData.find((item) =>
      (item.id || item._id) === generationForm.employeeId,
    )
    const month = Number(generationForm.month)
    const year = Number(generationForm.year)

    if (!employee) {
      setFormError('Select an employee to generate a payslip.')
      return
    }

    if (payslips.some((payslip) =>
      payslip.employeeId === generationForm.employeeId
        && Number(payslip.month) === month
        && Number(payslip.year) === year,
    )) {
      setFormError('A payslip already exists for this employee and period.')
      return
    }

    const basicSalary = Number(generationForm.basicSalary) || 0
    const allowances = Number(generationForm.allowances) || 0
    const deductions = Number(generationForm.deductions) || 0
    const id = crypto.randomUUID()

    setPayslips((current) => [{
      id,
      _id: id,
      employeeId: generationForm.employeeId,
      employee,
      month,
      year,
      basicSalary,
      allowances,
      deductions,
      netSalary: basicSalary + allowances - deductions,
    }, ...current])
    setShowGenerateForm(false)
  }

  const openPayslip = (payslip) => {
    const id = payslip.id || payslip._id
    navigate(`/print/payslips/${id}`, { state: { payslip } })
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title">Payslips</h1>
          <p className="page-subtitle">
            {isAdmin ? 'Generate and manage employee payslips.' : 'Your payslip history.'}
          </p>
        </div>
        {isAdmin && (
          <button
            type="button"
            onClick={openGenerateForm}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/25"
          >
            <PlusIcon className="size-4" />
            Generate Payslip
          </button>
        )}
      </div>

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-left text-sm">
            <thead className="bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                {isAdmin && <th className="px-5 py-3.5">Employee</th>}
                <th className="px-5 py-3.5">Period</th>
                <th className="px-5 py-3.5">Basic salary</th>
                <th className="px-5 py-3.5">Net salary</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {visiblePayslips.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 5 : 4} className="px-6 py-14 text-center text-slate-400">
                    No payslips available.
                  </td>
                </tr>
              ) : visiblePayslips.map((payslip) => {
                const employee = getPayslipEmployee(payslip)

                return (
                  <tr key={payslip.id || payslip._id} className="transition-colors hover:bg-slate-50/70">
                    {isAdmin && (
                      <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-800">
                        {employee ? `${employee.firstName} ${employee.lastName}`.trim() : 'Unknown employee'}
                      </td>
                    )}
                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                      {formatPeriod(payslip.month, payslip.year)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                      {formatCurrency(payslip.basicSalary)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-800">
                      {formatCurrency(payslip.netSalary)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => openPayslip(payslip)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-700 transition-colors hover:bg-sky-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                      >
                        <DownloadIcon className="size-3.5" />
                        Download
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      {showGenerateForm && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/45 p-4 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowGenerateForm(false)
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="generate-payslip-title"
            className="my-4 w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl sm:my-8"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div>
                <h2 id="generate-payslip-title" className="text-lg font-semibold text-slate-900">Generate payslip</h2>
                <p className="mt-1 text-sm text-slate-500">Enter the employee and pay period details.</p>
              </div>
              <button
                type="button"
                aria-label="Close generate payslip dialog"
                onClick={() => setShowGenerateForm(false)}
                className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100"
              >
                <XIcon className="size-4" />
              </button>
            </div>
            <form onSubmit={handleGenerate}>
              <div className="grid gap-4 px-5 py-5 sm:grid-cols-2 sm:px-6">
                <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
                  Employee
                  <select
                    required
                    value={generationForm.employeeId}
                    onChange={(event) => updateEmployee(event.target.value)}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {dummyEmployeeData.map((employee) => (
                      <option key={employee.id || employee._id} value={employee.id || employee._id}>
                        {employee.firstName} {employee.lastName}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Month
                  <select
                    required
                    value={generationForm.month}
                    onChange={(event) => setGenerationForm((current) => ({ ...current, month: event.target.value }))}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {Array.from({ length: 12 }, (_, index) => {
                      const month = index + 1
                      return <option key={month} value={month}>{formatPeriod(month, 2000).split(' ')[0]}</option>
                    })}
                  </select>
                </label>
                <label className="block text-sm font-medium text-slate-700">
                  Year
                  <input
                    type="number"
                    required
                    min="2000"
                    max="2100"
                    value={generationForm.year}
                    onChange={(event) => setGenerationForm((current) => ({ ...current, year: event.target.value }))}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </label>
                {[
                  ['basicSalary', 'Basic salary'],
                  ['allowances', 'Allowances'],
                  ['deductions', 'Deductions'],
                ].map(([field, label]) => (
                  <label key={field} className="block text-sm font-medium text-slate-700">
                    {label}
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={generationForm[field]}
                      onChange={(event) => setGenerationForm((current) => ({ ...current, [field]: event.target.value }))}
                      className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </label>
                ))}
                <p className="text-sm text-slate-500 sm:col-span-2">
                  Net salary: <strong className="text-slate-800">
                    {formatCurrency(
                      Number(generationForm.basicSalary || 0)
                      + Number(generationForm.allowances || 0)
                      - Number(generationForm.deductions || 0),
                    )}
                  </strong>
                </p>
                {formError && <p role="alert" className="text-sm text-rose-600 sm:col-span-2">{formError}</p>}
              </div>
              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                <button
                  type="button"
                  onClick={() => setShowGenerateForm(false)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/25"
                >
                  Generate Payslip
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}

export default Payslips