import { ArrowLeftIcon, PrinterIcon } from 'lucide-react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { dummyEmployeeData, dummyPayslipData } from '../assets/assets'

function getEmployee(payslip) {
  const relatedEmployee = Array.isArray(payslip.employee) ? payslip.employee[0] : payslip.employee
  if (relatedEmployee && typeof relatedEmployee === 'object') return relatedEmployee

  return dummyEmployeeData.find((employee) =>
    (employee.id || employee._id) === payslip.employeeId,
  )
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(Number(value) || 0)
}

function PrintPayslips() {
  const { id } = useParams()
  const { state } = useLocation()
  const navigate = useNavigate()
  const payslip = state?.payslip || dummyPayslipData.find((item) =>
    (item.id || item._id) === id,
  )

  if (!payslip) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <p className="text-slate-600">Payslip not found.</p>
        <button type="button" onClick={() => navigate(-1)} className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700">
          Back to payslips
        </button>
      </main>
    )
  }

  const employee = getEmployee(payslip)
  const netSalary = Number(payslip.netSalary)
    || Number(payslip.basicSalary || 0) + Number(payslip.allowances || 0) - Number(payslip.deductions || 0)
  const period = new Date(Date.UTC(Number(payslip.year), Number(payslip.month) - 1, 1))
    .toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 print:min-h-0 print:bg-white print:p-0">
      <div className="mx-auto max-w-3xl">
        <div className="mb-5 flex items-center justify-between print:hidden">
          <button type="button" onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900">
            <ArrowLeftIcon className="size-4" />
            Back to payslips
          </button>
          <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
            <PrinterIcon className="size-4" />
            Print / Save PDF
          </button>
        </div>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10 print:rounded-none print:border-0 print:p-0 print:shadow-none">
          <header className="flex flex-col gap-3 border-b border-slate-200 pb-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">Employee MS</p>
              <h1 className="mt-2 text-2xl font-semibold text-slate-900">Payslip</h1>
              <p className="mt-1 text-sm text-slate-500">{period}</p>
            </div>
            <div className="text-sm sm:text-right">
              <p className="font-semibold text-slate-900">
                {employee ? `${employee.firstName} ${employee.lastName}`.trim() : 'Employee'}
              </p>
              <p className="mt-1 text-slate-500">{employee?.position || '—'}</p>
              <p className="text-slate-500">{employee?.department || '—'}</p>
            </div>
          </header>

          <div className="mt-7 grid gap-6 sm:grid-cols-2">
            <section>
              <h2 className="mb-3 text-sm font-semibold text-slate-900">Earnings</h2>
              <dl className="space-y-3 rounded-xl bg-slate-50 p-4 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-600">Basic salary</dt>
                  <dd className="font-medium text-slate-900">{formatCurrency(payslip.basicSalary)}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-600">Allowances</dt>
                  <dd className="font-medium text-slate-900">{formatCurrency(payslip.allowances)}</dd>
                </div>
              </dl>
            </section>
            <section>
              <h2 className="mb-3 text-sm font-semibold text-slate-900">Deductions</h2>
              <dl className="rounded-xl bg-slate-50 p-4 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-slate-600">Deductions</dt>
                  <dd className="font-medium text-slate-900">{formatCurrency(payslip.deductions)}</dd>
                </div>
              </dl>
            </section>
          </div>

          <div className="mt-7 flex items-center justify-between rounded-xl bg-indigo-50 px-5 py-4">
            <span className="font-semibold text-indigo-900">Net salary</span>
            <span className="text-xl font-bold text-indigo-900">{formatCurrency(netSalary)}</span>
          </div>
        </article>
      </div>
    </main>
  )
}

export default PrintPayslips
