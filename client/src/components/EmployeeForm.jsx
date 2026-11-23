import { useState } from 'react'
import { DEPARTMENTS } from '../assets/assets'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const EmployeeForm = ({ initialData, onSuccess, onCancel }) => {
  const isEditModel = Boolean(initialData)
  const [formData, setFormData] = useState(() => ({
    firstName: initialData?.firstName ?? '',
    lastName: initialData?.lastName ?? '',
    email: initialData?.email ?? '',
    phone: initialData?.phone ?? '',
    department: initialData?.department ?? '',
    position: initialData?.position ?? '',
    employmentStatus: initialData?.employmentStatus ?? 'ACTIVE',
    joinDate: initialData?.joinDate ? initialData.joinDate.slice(0, 10) : '',
    bio: initialData?.bio ?? '',
    basicSalary: initialData?.basicSalary ?? '',
    allowances: initialData?.allowances ?? '',
    deductions: initialData?.deductions ?? '',
    workEmail: initialData?.user?.email ?? initialData?.userId?.email ?? initialData?.email ?? '',
    temporaryPassword: '',
    systemRole: initialData?.user?.role ?? initialData?.userId?.role ?? 'EMPLOYEE',
  }))

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    onSuccess(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className='max-h-[calc(100vh-230px)] space-y-7 overflow-y-auto px-5 py-6 sm:px-7'>
        <section>
          <div className='mb-4'>
            <h3 className='text-sm font-semibold text-slate-900'>Personal information</h3>
            <p className='mt-1 text-xs text-slate-500'>Basic contact and profile details</p>
          </div>
          <div className='grid gap-x-5 gap-y-4 sm:grid-cols-2'>
            <label className='space-y-1.5 text-sm font-medium text-slate-700'>
              First name
              <Input value={formData.firstName} onChange={(e) => updateField('firstName', e.target.value)} required />
            </label>
            <label className='space-y-1.5 text-sm font-medium text-slate-700'>
              Last name
              <Input value={formData.lastName} onChange={(e) => updateField('lastName', e.target.value)} required />
            </label>
            <label className='space-y-1.5 text-sm font-medium text-slate-700'>
              Email address
              <Input type='email' value={formData.email} onChange={(e) => updateField('email', e.target.value)} required />
            </label>
            <label className='space-y-1.5 text-sm font-medium text-slate-700'>
              Phone number
              <Input type='tel' value={formData.phone} onChange={(e) => updateField('phone', e.target.value)} />
            </label>
            <label className='space-y-1.5 text-sm font-medium text-slate-700 sm:col-span-2'>
              Bio
              <textarea
                className='min-h-24 w-full resize-y rounded-md border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-all duration-200 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20'
                value={formData.bio}
                onChange={(e) => updateField('bio', e.target.value)}
                placeholder='Add a short employee bio'
              />
            </label>
          </div>
        </section>

        <section className='border-t border-slate-100 pt-6'>
          <div className='mb-4'>
            <h3 className='text-sm font-semibold text-slate-900'>Employment details</h3>
            <p className='mt-1 text-xs text-slate-500'>Role, department, and compensation</p>
          </div>
          <div className='grid gap-x-5 gap-y-4 sm:grid-cols-2'>
            <label className='space-y-1.5 text-sm font-medium text-slate-700'>
              Department
              <Select value={formData.department} onValueChange={(value) => updateField('department', value)}>
                <SelectTrigger className='w-full'><SelectValue placeholder='Select department' /></SelectTrigger>
                <SelectContent>
                  {DEPARTMENTS.map((department) => (
                    <SelectItem key={department} value={department}>{department}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
            <label className='space-y-1.5 text-sm font-medium text-slate-700'>
              Position
              <Input value={formData.position} onChange={(e) => updateField('position', e.target.value)} required />
            </label>
            <label className='space-y-1.5 text-sm font-medium text-slate-700'>
              Employment status
              <Select value={formData.employmentStatus} onValueChange={(value) => updateField('employmentStatus', value)}>
                <SelectTrigger className='w-full'><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value='ACTIVE'>Active</SelectItem>
                  <SelectItem value='INACTIVE'>Inactive</SelectItem>
                  <SelectItem value='ON_LEAVE'>On leave</SelectItem>
                </SelectContent>
              </Select>
            </label>
            <label className='space-y-1.5 text-sm font-medium text-slate-700'>
              Joining date
              <Input type='date' value={formData.joinDate} onChange={(e) => updateField('joinDate', e.target.value)} />
            </label>
            <label className='space-y-1.5 text-sm font-medium text-slate-700'>
              Basic salary
              <Input type='number' min='0' step='0.01' value={formData.basicSalary} onChange={(e) => updateField('basicSalary', e.target.value)} />
            </label>
            <label className='space-y-1.5 text-sm font-medium text-slate-700'>
              Allowances
              <Input type='number' min='0' step='0.01' value={formData.allowances} onChange={(e) => updateField('allowances', e.target.value)} />
            </label>
            <label className='space-y-1.5 text-sm font-medium text-slate-700'>
              Deductions
              <Input type='number' min='0' step='0.01' value={formData.deductions} onChange={(e) => updateField('deductions', e.target.value)} />
            </label>
          </div>
        </section>

        <section className='border-t border-slate-100 pt-6'>
          <div className='mb-4'>
            <h3 className='text-sm font-semibold text-slate-900'>Account setup</h3>
            <p className='mt-1 text-xs text-slate-500'>Set sign-in details and access level</p>
          </div>
          <div className='grid gap-x-5 gap-y-4 sm:grid-cols-2'>
            <label className='space-y-1.5 text-sm font-medium text-slate-700'>
              Work email
              <Input type='email' value={formData.workEmail} onChange={(e) => updateField('workEmail', e.target.value)} required />
            </label>
            <label className='space-y-1.5 text-sm font-medium text-slate-700'>
              Temporary password
              <Input type='password' value={formData.temporaryPassword} onChange={(e) => updateField('temporaryPassword', e.target.value)} required={!isEditModel} autoComplete='new-password' />
            </label>
            <label className='space-y-1.5 text-sm font-medium text-slate-700'>
              System role
              <Select  value={formData.systemRole} onValueChange={(value) => updateField('systemRole', value)}>
                <SelectTrigger className='w-full'><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value='EMPLOYEE'>Employee</SelectItem>
                  <SelectItem value='ADMIN'>Admin</SelectItem>
                </SelectContent>
              </Select>
            </label>
          </div>
        </section>
      </div>

      <div className='flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50/80 px-5 py-4 sm:flex-row sm:justify-end sm:px-7'>
        <Button type='button' variant='outline' onClick={onCancel} className='w-full sm:w-auto'>Cancel</Button>
        <Button type='submit' className='w-full sm:w-auto'>{isEditModel ? 'Save changes' : 'Create employee'}</Button>
      </div>
    </form>
  )
}

export default EmployeeForm