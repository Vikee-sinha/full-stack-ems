import { useEffect, useState } from 'react'
import EmployeeDashboard from '../components/EmployeeDashboard'
import { dummyEmployeeDashboardData, dummyAdminDashboardData } from '../assets/assets'
import AdminDashboard from '../components/AdminDashboard'
import { getCurrentUser } from '../auth'

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const currentUser = getCurrentUser()
  const isAdmin = currentUser?.role === 'ADMIN'
  const data = isAdmin
    ? dummyAdminDashboardData
    : {
        ...dummyEmployeeDashboardData,
        employee: {
          ...dummyEmployeeDashboardData.employee,
          firstName: currentUser?.firstName || dummyEmployeeDashboardData.employee.firstName,
          lastName: currentUser?.lastName || dummyEmployeeDashboardData.employee.lastName,
          position: currentUser?.position || dummyEmployeeDashboardData.employee.position,
        },
      }

  useEffect(() => {
    const timeoutId = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timeoutId)
  }, [])

  if (loading) return <p>Loading...</p>

  if (isAdmin) {
    return <AdminDashboard data={data} />
  }

  return <EmployeeDashboard data={data} />
}

export default Dashboard