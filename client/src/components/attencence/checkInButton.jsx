import React, { useState } from 'react'
import { CheckCircle2Icon, Clock3Icon, LoaderCircleIcon, LogInIcon, LogOutIcon } from 'lucide-react'

const CheckInButton = ({ todayRecord, onAction }) => {
  const [loading, setLoading] = useState(false)
  const isCheckedIn = !!todayRecord?.checkIn && !todayRecord?.checkOut
  const hasCompletedShift = !!todayRecord?.checkOut
  const StatusIcon = hasCompletedShift ? CheckCircle2Icon : Clock3Icon
  const ActionIcon = isCheckedIn ? LogOutIcon : LogInIcon
  const checkInTime = todayRecord?.checkIn
    ? new Date(todayRecord.checkIn).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    : null

  const handleAttendance = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onAction()
    }, 1000)
  }

  return (
    <aside className="fixed bottom-4 right-4 z-40 w-[calc(100vw-2rem)] max-w-sm sm:bottom-6 sm:right-6">
      <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-[0_16px_48px_-16px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl ${
              hasCompletedShift
                ? 'bg-emerald-50 text-emerald-600'
                : isCheckedIn
                  ? 'bg-amber-50 text-amber-600'
                  : 'bg-indigo-50 text-indigo-600'
            }`}>
              {React.createElement(StatusIcon, { className: 'size-5' })}
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">Today&apos;s shift</p>
              <p className="mt-0.5 text-sm font-semibold text-slate-800">
                {hasCompletedShift ? 'Shift complete' : isCheckedIn ? 'You’re on the clock' : 'Ready when you are'}
              </p>
            </div>
          </div>
          {!hasCompletedShift && (
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
              isCheckedIn ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-600'
            }`}>
              <span className={`size-1.5 rounded-full ${isCheckedIn ? 'bg-amber-500' : 'bg-slate-400'}`} />
              {isCheckedIn ? 'In progress' : 'Not started'}
            </span>
          )}
        </div>

        {hasCompletedShift ? (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3.5 py-3 text-sm text-emerald-800">
            {React.createElement(CheckCircle2Icon, { className: 'size-4 shrink-0' })}
            <span>Nice work today. You&apos;re all checked out.</span>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={handleAttendance}
              disabled={loading}
              className={`flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-left text-white shadow-lg transition duration-200 hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0 focus-visible:outline-none focus-visible:ring-4 ${
                isCheckedIn
                  ? 'bg-linear-to-r from-rose-600 to-rose-500 shadow-rose-500/20 hover:from-rose-700 hover:to-rose-600 focus-visible:ring-rose-500/25'
                  : 'bg-linear-to-r from-indigo-600 to-violet-600 shadow-indigo-500/25 hover:from-indigo-700 hover:to-violet-700 focus-visible:ring-indigo-500/25'
              }`}
            >
              <span>
                <span className="block text-base font-semibold">
                  {loading ? 'Updating shift…' : isCheckedIn ? 'Clock out' : 'Clock in'}
                </span>
                <span className="mt-0.5 block text-xs text-white/75">
                  {loading
                    ? 'Please wait a moment'
                    : isCheckedIn
                      ? `Started at ${checkInTime}`
                      : 'Tap to start your workday'}
                </span>
              </span>
              <span className="ml-3 flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/15">
                {loading
                  ? React.createElement(LoaderCircleIcon, { className: 'size-5 animate-spin' })
                  : React.createElement(ActionIcon, { className: 'size-5' })}
              </span>
            </button>
            <p className="mt-3 text-center text-[11px] text-slate-400">
              {isCheckedIn ? 'Remember to clock out when your shift ends' : 'Your attendance is recorded for today'}
            </p>
          </>
        )}
      </div>
    </aside>
  )
}

export default CheckInButton