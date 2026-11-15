import { Building2Icon, CalendarIcon, FileTextIcon, UserIcon } from 'lucide-react'
import React from 'react'

const AdminDashboard = ({ data }) => {
  const stats = [
    {
      icon: UserIcon,
      value: data.totalEmployees,
      label: "Total Employees",
      description : "Active workforce",
    },
    {
      icon : Building2Icon,
      value: data.totalDepartments,
      label: "Departments",
      description : "Orginization units",
    },{
      icon: CalendarIcon,
      value: data.todayAttendance,
      label: "Today's Attendance",
      description:"Checked in today",
    },
    {
      icon: FileTextIcon,
      value: data.pendingLeaves,
      label: "Pending Leaves",
      description : "Awaiting approval",
    }
  ]



  return (
    <div className=" animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="mt-2 text-[15px] leading-6 tracking-[0.01em] text-slate-500">
          Welcome back, <span className="font-medium text-slate-700">Admin</span>
          <span> — here&apos;s your overview</span>
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 sm:gap-5 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className="card card-hover group relative flex min-h-40 items-center justify-between gap-4 overflow-hidden rounded-2xl border-slate-200/80 p-5 pl-6 shadow-sm transition-shadow hover:shadow-md sm:p-6 sm:pl-7 xl:aspect-[1.65/1] xl:min-h-0"
          >
            <div className="absolute inset-y-0 left-0 w-1 rounded-r-full bg-indigo-400 transition-colors duration-200 group-hover:bg-indigo-600" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-500">{s.label}</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 tabular-nums">
                {s.value}
              </p>
            </div>
            <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors duration-200 group-hover:bg-indigo-100">
              <s.icon className="size-5" aria-hidden="true" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminDashboard