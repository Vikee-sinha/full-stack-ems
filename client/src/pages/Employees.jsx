import React, { useCallback, useState,useEffect } from 'react'
import { dummyEmployeeData, DEPARTMENTS } from '../assets/assets'
import EmployeeCard from '../components/EmployeeCard'
import { Plus, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const Employees = () => {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [search , setSearch] = useState('')
  const [selectedDept, setSelectedDept] = useState('all')
  const [editEmployee, setEditEmployee] = useState(null)
  const [showCreateModel, setShowCreateModel] = useState(false)

  const fetchEmployees = useCallback(async () => {
    setLoading(true)
    setEmployees(dummyEmployeeData)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    fetchEmployees()
  }, [])

  const filtered = employees.filter((emp)=> `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(search.toLowerCase()) && (selectedDept === 'all' || emp.department === selectedDept))

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="page-title">Employees</h1>
          <p className="mt-2 text-[15px] leading-6 tracking-[0.01em] text-slate-500">
            Manage your employees and their information
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={()=> setShowCreateModel(true)} className="w-full gap-2 sm:w-auto">
            <Plus aria-hidden="true" />
            Add Employee
          </Button>
        </div>
      </div>

      {/* Search bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search aria-hidden="true" className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
          <Input className="pl-10" placeholder="Search employees..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={selectedDept} onValueChange={setSelectedDept}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Departments</SelectItem>
            {DEPARTMENTS.map((dept) => (
              <SelectItem key={dept} value={dept}>
                {dept}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* employee card */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {filtered.length === 0? (
            <p className='col-span-full text-center py-16 text-slate-400 bg-white rounded-2xl border border-dashed border-slate-200'>No employee found</p>
          ) : (
            filtered.map((emp) => (
            <EmployeeCard key={emp.id} employee={emp} onDelete={fetchEmployees} onEdit={(e)=>setEditEmployee(e)}/>
            ))
          )}
        </div>
      )}

      {/* Create Employee Modal */}
      {showCreateModel && (
        <div className='fixed bg-black/40 backdrop-blur-sm inset-0 z-50 flex item-start justify-center p-4 overflow-y-auto' onClick={()=>setShowCreateModel(false)}>
          <div className='fixed inset-0'/>
          <div className='relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8 animate-fade-in' onClick={(e)=>e.stopPropagation()}>
            <div className='flex item-center justify-between p-6 pb-0'>
              <div>
                <h2 className='text-lg font-semibold text-slate-900'>Add New Employee</h2>
                <p className='text-sm text-slate-500 mt-0.5'>Create a user account and employee profile</p>
              </div>
              <button onClick={()=> setShowCreateModel(false)} className='p-2 rounded-lg hover:bg-slate-100 tranistion-colors text-slate-600'>
                <X className="w-5 h-5"/>
              </button>
            </div>
            <div className='p-6'>
              form
            </div>
          </div>
        </div>
      )}

      {/* Edit Employee Model */}
    </div>
  )
}

export default Employees