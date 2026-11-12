import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
    <div className="flex h-screen bg-linear-to-br from-salte-50 via-white to-indigo-50/30">
      <p>Sidebar</p>
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-7xl px-4 pt-16 py-8 sm:px-6 lg:px-8" >
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Layout