import { getDayTypeDisplay, getWorkingHoursDisplay } from '@/assets/assets'
import React from 'react'

const AttendenceHistory = ({ history = [] }) => {
  const formatDate = (value) => {
    if (!value) return '—'
    return new Date(value).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatTime = (value) => {
    if (!value) return '—'
    return new Date(value).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className='card overflow-hidden' >
        <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-900">Recent Activity</h3>
        </div>
        <div className="overflow-x-auto">
            <table className="table-modern">
                <thead>
                    <tr>
                        <th className='px-4 py-4 '>Date</th>
                        <th className='px-4 py-4 '>CheckIn</th>
                        <th className='px-4 py-4 '>Check-out</th>
                        <th className='px-4 py-4 '>Working Hours</th>
                        <th className='px-4 py-4 '>Day type</th>
                        <th className='px-4 py-4 '>status</th>
                    </tr>
                </thead>
                <tbody>
                    {history.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="text-center py-12 text-slate-400">
                                No records found
                            </td>
                        </tr>):(
                            history.map((record)=>{
                                const dayType = getDayTypeDisplay(record)
                                return(
                                    <tr key={record._id || record.id}>
                                        <td className='px-6 py-4 font-medium text-slate-900'>
                                            {formatDate(record.date)}
                                        </td>
                                        <td className='px-6 py-4'>{formatTime(record.checkIn)}</td>
                                        <td className='px-6 py-4'>{formatTime(record.checkOut)}</td>
                                        <td className='px-6 py-4'>{getWorkingHoursDisplay(record)}</td>
                                        <td className='px-6 py-4'>
                                            <span className={`badge ${dayType.className}`}>{dayType.label}</span>
                                        </td>
                                        <td className='px-6 py-4'>
                                            <span className={record.status === 'PRESENT'
                                                ? 'badge badge-success'
                                                : record.status === 'LATE'
                                                    ? 'badge badge-warning'
                                                    : 'badge bg-slate-100 text-slate-600'}>
                                                {record.status || '—'}
                                            </span>
                                        </td>
                                    </tr>
                                )
                            })
                    )}
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default AttendenceHistory