import React from 'react'
import { ArrowRightIcon, CalendarIcon, DollarSignIcon, FileTextIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

const EmployeeDashboard = ({ data }) => {
  const emp = data?.employee || {}

  const cards = [
    {
      icon: CalendarIcon,
      value: data?.currentMonthAttendance ?? 0,
      title: 'Daily Attendance',
    },
    {
      icon: FileTextIcon,
      value: data?.pendingLeaves ?? 0,
      title: 'Pending Leaves',
    },
    {
      icon: DollarSignIcon,
      value: data?.latestPayslip ? `$${Number(data.latestPayslip.netSalary || 0).toLocaleString()}` : 'N/A',
      title: 'Latest Payslip',
    },
  ]

  const fullName = [emp.firstName, emp.lastName].filter(Boolean).join(' ') || 'Employee'
  const roleText = [emp?.position, emp?.department].filter(Boolean).join(' • ') || 'Employee'

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Welcome, {fullName}</h1>
        <p className="page-subtitle">{roleText}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3 gap-4 sm:gap-5 mb-8">
        {cards.map((card) => (
          <div
            key={card.title}
            className="card card-hover group relative flex min-h-36 items-center justify-between gap-4 overflow-hidden rounded-xl border-slate-200/80 p-6 pl-7 shadow-sm transition-shadow hover:shadow-md sm:p-7 sm:pl-8"
          >
            <div className="absolute inset-y-0 left-0 w-1 rounded-r-full bg-indigo-400 transition-colors duration-200 group-hover:bg-indigo-600" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-500">{card.title}</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">
                {card.value}
              </p>
            </div>
            <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-indigo-50 text-indigo-600 transition-colors duration-200 group-hover:bg-indigo-100">
              <card.icon className="size-6" aria-hidden="true" />
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex flex-wrap items-center gap-3">
        <Link
          to="/attendance"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all duration-200 hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-lg"
        >
          Mark Attendance
          <ArrowRightIcon className="size-4" />
        </Link>

        <Link
          to="/leaves"
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-slate-50 hover:text-indigo-700"
        >
          Apply for Leave
        </Link>
      </div>

    </div>
  )
}

export default EmployeeDashboard
