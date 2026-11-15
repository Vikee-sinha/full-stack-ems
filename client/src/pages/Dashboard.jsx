import React, { useEffect, useState } from 'react'
import EmployeeDashboard from '../components/EmployeeDashboard'
import { dummyEmployeeDashboardData, dummyAdminDashboardData } from '../assets/assets'
import AdminDashboard from '../components/AdminDashboard'

const Dashboard = () => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setData(dummyAdminDashboardData) // Replace with actual API call to fetch dashboard data
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) return <p>Loading...</p>
  if (!data) return <p className="text-center text-slate-500 py-12">No data available</p>

  const normalizedRole = String(data?.role || '').toUpperCase()

  if (normalizedRole === 'ADMIN') {
    return <AdminDashboard data={data} />
  }

  return <EmployeeDashboard data={data} />
}

export default Dashboard