import { useState } from 'react'
import {
  CheckIcon,
  ClipboardListIcon,
  PalmtreeIcon,
  PlusIcon,
  ThermometerIcon,
  UmbrellaIcon,
  XIcon,
} from 'lucide-react'
import { dummyEmployeeData, dummyLeaveData, dummyProfileData } from '../assets/assets'
import { getCurrentUser } from '../auth'

const LEAVE_TYPES = [
  { value: 'SICK', label: 'Sick Leave', icon: ThermometerIcon },
  { value: 'CASUAL', label: 'Casual Leave', icon: UmbrellaIcon },
  { value: 'ANNUAL', label: 'Annual Leave', icon: PalmtreeIcon },
]

const EMPTY_FORM = { type: 'ANNUAL', startDate: '', endDate: '', reason: '' }

const STATUS_STYLES = {
  APPROVED: 'bg-emerald-50 text-emerald-700 ring-emerald-600/10',
  REJECTED: 'bg-rose-50 text-rose-700 ring-rose-600/10',
  PENDING: 'bg-amber-50 text-amber-700 ring-amber-600/10',
}

function getEmployeeForLeave(leave) {
  const relatedEmployee = Array.isArray(leave.employee) ? leave.employee[0] : leave.employee
  if (relatedEmployee) return relatedEmployee

  return dummyEmployeeData.find((employee) =>
    (employee.id || employee._id) === leave.employeeId,
  )
}

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(`${String(value).slice(0, 10)}T12:00:00`)
  return Number.isNaN(date.getTime())
    ? '—'
    : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide ring-1 ring-inset ${STATUS_STYLES[status] || 'bg-slate-100 text-slate-600 ring-slate-500/10'}`}>
      {status || 'UNKNOWN'}
    </span>
  )
}


  // const isAdmin = true // instead of currentUser?.role === 'ADMIN'

function Leaves() {
  const currentUser = getCurrentUser()
  const isAdmin = currentUser?.role === 'ADMIN'
  const normalizedEmail = currentUser?.email?.trim().toLowerCase()
  const currentEmployee = dummyEmployeeData.find((employee) =>
    employee.id === currentUser?.employeeId
      || employee._id === currentUser?.employeeId
      || [employee.email, employee.user?.email, employee.userId?.email]
        .some((email) => email?.toLowerCase() === normalizedEmail),
  ) || dummyEmployeeData.find((employee) =>
    employee.firstName?.toLowerCase() === currentUser?.firstName?.toLowerCase()
      && employee.lastName?.toLowerCase() === currentUser?.lastName?.toLowerCase(),
  ) || dummyEmployeeData.find((employee) =>
    (employee.id || employee._id) === dummyProfileData._id,
  )
  const employeeId = currentEmployee?.id || currentEmployee?._id || currentUser?.employeeId
  const [leaves, setLeaves] = useState(dummyLeaveData)
  const [showApplyForm, setShowApplyForm] = useState(false)
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [formError, setFormError] = useState('')

  const employeeLeaves = leaves.filter((leave) => {
    const employee = getEmployeeForLeave(leave)
    return employeeId && (employee?.id === employeeId || employee?._id === employeeId)
  })

  const updateLeaveStatus = (leaveId, status) => {
    setLeaves((current) => current.map((leave) =>
      (leave.id || leave._id) === leaveId ? { ...leave, status } : leave,
    ))
  }

  const handleApply = (event) => {
    event.preventDefault()
    setFormError('')

    if (formData.endDate < formData.startDate) {
      setFormError('The end date must be on or after the start date.')
      return
    }

    if (!employeeId) {
      setFormError('We could not match your account to an employee profile.')
      return
    }

    const leaveId = crypto.randomUUID()
    const employee = currentEmployee || {
      id: employeeId,
      firstName: currentUser?.firstName || '',
      lastName: currentUser?.lastName || '',
    }

    setLeaves((current) => [{
      id: leaveId,
      _id: leaveId,
      employeeId,
      employee,
      type: formData.type,
      startDate: `${formData.startDate}T00:00:00.000Z`,
      endDate: `${formData.endDate}T00:00:00.000Z`,
      reason: formData.reason.trim(),
      status: 'PENDING',
    }, ...current])
    setFormData(EMPTY_FORM)
    setShowApplyForm(false)
  }

  const renderLeaveRows = (rows, showEmployee) => rows.length === 0 ? (
    <tr>
      <td colSpan={showEmployee ? 6 : 4} className="px-6 py-14 text-center">
        <ClipboardListIcon className="mx-auto mb-3 size-8 text-slate-300" />
        <p className="font-medium text-slate-600">No leave requests yet</p>
        <p className="mt-1 text-sm text-slate-400">
          {showEmployee ? 'There are no requests to review.' : 'Your leave requests will appear here.'}
        </p>
      </td>
    </tr>
  ) : rows.map((leave) => {
    const employee = getEmployeeForLeave(leave)
    const leaveId = leave.id || leave._id

    return (
      <tr key={leaveId} className="transition-colors hover:bg-slate-50/70">
        {showEmployee && (
          <td className="whitespace-nowrap px-5 py-4">
            <p className="font-medium text-slate-800">
              {employee ? `${employee.firstName} ${employee.lastName}`.trim() : 'Unknown employee'}
            </p>
            <p className="mt-0.5 text-xs text-slate-400">{employee?.department || '—'}</p>
          </td>
        )}
        <td className="whitespace-nowrap px-5 py-4">
          <span className="rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
            {leave.type}
          </span>
        </td>
        <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
          {formatDate(leave.startDate)} <span className="text-slate-400">—</span> {formatDate(leave.endDate)}
        </td>
        <td className="min-w-48 px-5 py-4 text-sm text-slate-600">{leave.reason || '—'}</td>
        <td className="whitespace-nowrap px-5 py-4"><StatusBadge status={leave.status} /></td>
        {showEmployee && (
          <td className="whitespace-nowrap px-5 py-4 text-right">
            {leave.status === 'PENDING' ? (
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  aria-label="Approve leave request"
                  title="Approve"
                  onClick={() => updateLeaveStatus(leaveId, 'APPROVED')}
                  className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700 transition-colors hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  <CheckIcon className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Reject leave request"
                  title="Reject"
                  onClick={() => updateLeaveStatus(leaveId, 'REJECTED')}
                  className="flex size-8 items-center justify-center rounded-lg bg-rose-50 text-rose-700 transition-colors hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                >
                  <XIcon className="size-4" />
                </button>
              </div>
            ) : <span className="text-xs text-slate-400">—</span>}
          </td>
        )}
      </tr>
    )
  })

  return (
    <div className="animate-fade-in pb-8">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="page-title">Leave Management</h1>
          <p className="page-subtitle">
            {isAdmin ? 'Review and manage employee leave applications.' : 'Your leave history and requests.'}
          </p>
        </div>
        {!isAdmin && (
          <button
            type="button"
            onClick={() => { setFormError(''); setShowApplyForm(true) }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/25"
          >
            <PlusIcon className="size-4" />
            Apply for Leave
          </button>
        )}
      </div>

      {isAdmin ? (
        <>
          <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {LEAVE_TYPES.map(({ value, label, icon: Icon }) => {
              const taken = leaves.filter((leave) =>
                leave.type === value && leave.status === 'APPROVED',
              ).length

              return (
                <div key={value} className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
                  <div className="absolute inset-y-0 left-0 w-1 bg-slate-300" />
                  <div className="flex items-center gap-3.5">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-500">{label}</p>
                      <p className="mt-0.5 text-xl font-semibold text-slate-900">
                        {taken} <span className="text-xs font-normal text-slate-400">taken</span>
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div>
                <h2 className="font-semibold text-slate-900">Leave applications</h2>
                <p className="mt-1 text-sm text-slate-500">{leaves.length} total requests</p>
              </div>
              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                {leaves.filter((leave) => leave.status === 'PENDING').length} pending
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[780px] text-left text-sm">
                <thead className="bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-5 py-3.5">Employee</th>
                    <th className="px-5 py-3.5">Type</th>
                    <th className="px-5 py-3.5">Dates</th>
                    <th className="px-5 py-3.5">Reason</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {renderLeaveRows(leaves, true)}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : (
        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
              <h2 className="font-semibold text-slate-900">Your requests</h2>
              <p className="mt-1 text-sm text-slate-500">A history of your leave applications and their status.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[660px] text-left text-sm">
                <thead className="bg-slate-50/80 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-5 py-3.5">Type</th>
                    <th className="px-5 py-3.5">Dates</th>
                    <th className="px-5 py-3.5">Reason</th>
                    <th className="px-5 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {renderLeaveRows(employeeLeaves, false)}
                </tbody>
              </table>
            </div>
          </section>
      )}

      {showApplyForm && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/45 p-4 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowApplyForm(false)
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="apply-leave-title"
            className="my-4 w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl sm:my-8"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
              <div>
                <h2 id="apply-leave-title" className="text-lg font-semibold text-slate-900">Apply for leave</h2>
                <p className="mt-1 text-sm text-slate-500">Submit a request for your manager to review.</p>
              </div>
              <button
                type="button"
                aria-label="Close leave application"
                onClick={() => setShowApplyForm(false)}
                className="flex size-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-800"
              >
                <XIcon className="size-4" />
              </button>
            </div>
            <form onSubmit={handleApply}>
              <div className="space-y-4 px-5 py-5 sm:px-6">
                <label className="block text-sm font-medium text-slate-700">
                  Leave type
                  <select
                    required
                    value={formData.type}
                    onChange={(event) => setFormData((current) => ({ ...current, type: event.target.value }))}
                    className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  >
                    {LEAVE_TYPES.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
                  </select>
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-medium text-slate-700">
                    From
                    <input
                      type="date"
                      required
                      value={formData.startDate}
                      onChange={(event) => setFormData((current) => ({ ...current, startDate: event.target.value }))}
                      className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </label>
                  <label className="block text-sm font-medium text-slate-700">
                    To
                    <input
                      type="date"
                      required
                      min={formData.startDate || undefined}
                      value={formData.endDate}
                      onChange={(event) => setFormData((current) => ({ ...current, endDate: event.target.value }))}
                      className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </label>
                </div>
                <label className="block text-sm font-medium text-slate-700">
                  Reason
                  <textarea
                    required
                    minLength={5}
                    maxLength={500}
                    rows={4}
                    value={formData.reason}
                    onChange={(event) => setFormData((current) => ({ ...current, reason: event.target.value }))}
                    placeholder="Briefly explain your request"
                    className="mt-1.5 w-full resize-y rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </label>
                {formError && <p role="alert" className="text-sm text-rose-600">{formError}</p>}
              </div>
              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                <button
                  type="button"
                  onClick={() => setShowApplyForm(false)}
                  className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/25"
                >
                  Submit request
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  )
}

export default Leaves
