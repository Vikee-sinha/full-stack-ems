import { useState } from 'react'
import { LockKeyholeIcon, SaveIcon, UserRoundIcon, XIcon } from 'lucide-react'
import { dummyEmployeeData, dummyProfileData } from '../assets/assets'
import { getCurrentUser, saveCurrentUser } from '../auth'

  // const isAdmin = true // instead of currentUser?.role === 'ADMIN'


function Settings() {
  const currentUser = getCurrentUser()
  const isAdmin = currentUser?.role === 'ADMIN'
  const employee = isAdmin ? null : dummyEmployeeData.find((item) =>
    item.id === currentUser?.employeeId
      || item._id === currentUser?.employeeId
      || [item.email, item.user?.email, item.userId?.email]
        .some((email) => email?.toLowerCase() === currentUser?.email?.trim().toLowerCase()),
  ) || dummyEmployeeData.find((item) =>
    item.firstName?.toLowerCase() === currentUser?.firstName?.toLowerCase()
      && item.lastName?.toLowerCase() === currentUser?.lastName?.toLowerCase(),
  ) || dummyEmployeeData.find((item) =>
    (item.id || item._id) === dummyProfileData._id,
  )

  const [profile, setProfile] = useState({
    fullName: [currentUser?.firstName, currentUser?.lastName].filter(Boolean).join(' ')
      || `${dummyProfileData.firstName} ${dummyProfileData.lastName}`,
    email: currentUser?.email || dummyProfileData.email,
    position: currentUser?.position || employee?.position || (isAdmin ? 'Administrator' : ''),
    bio: currentUser?.bio || employee?.bio || '',
  })
  const [saved, setSaved] = useState(false)
  const [showPasswordInfo, setShowPasswordInfo] = useState(false)

  const updateProfileField = (field, value) => {
    setProfile((current) => ({ ...current, [field]: value }))
    setSaved(false)
  }

  const handleSave = (event) => {
    event.preventDefault()
    const [firstName, ...lastNameParts] = profile.fullName.trim().split(/\s+/)

    saveCurrentUser({
      ...(currentUser || {}),
      role: isAdmin ? 'ADMIN' : 'EMPLOYEE',
      employeeId: currentUser?.employeeId || employee?.id || employee?._id,
      firstName,
      lastName: lastNameParts.join(' '),
      email: profile.email.trim(),
      position: profile.position.trim(),
      bio: profile.bio.trim(),
    })
    setSaved(true)
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-7">
        <h1 className="page-title">Settings</h1>
        <p className="page-subtitle">Manage your account and preferences.</p>
      </div>

      <div className="space-y-5">
        {!isAdmin && (
          <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="flex items-center gap-2.5 border-b border-slate-100 px-5 py-4 sm:px-6">
            <UserRoundIcon className="size-4 text-slate-500" />
            <h2 className="font-semibold text-slate-900">Public Profile</h2>
          </div>
          <form onSubmit={handleSave}>
            <div className="grid gap-x-5 gap-y-4 px-5 py-5 sm:grid-cols-2 sm:px-6">
              <label className="block text-sm font-medium text-slate-700">
                Full Name
                <input
                  type="text"
                  required
                  maxLength={100}
                  value={profile.fullName}
                  onChange={(event) => updateProfileField('fullName', event.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm font-normal text-slate-800 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Email
                <input
                  type="email"
                  required
                  maxLength={254}
                  value={profile.email}
                  onChange={(event) => updateProfileField('email', event.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm font-normal text-slate-800 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
                Position
                <input
                  type="text"
                  maxLength={100}
                  value={profile.position}
                  onChange={(event) => updateProfileField('position', event.target.value)}
                  className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm font-normal text-slate-800 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
                Bio
                <textarea
                  rows={4}
                  maxLength={500}
                  value={profile.bio}
                  onChange={(event) => updateProfileField('bio', event.target.value)}
                  placeholder="Write a brief bio..."
                  className="mt-1.5 w-full resize-y rounded-lg border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-sm font-normal text-slate-800 placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <span className="mt-1.5 block text-xs font-normal text-slate-400">
                  This will be displayed on your profile.
                </span>
              </label>
            </div>
            <div className="flex flex-col-reverse items-start justify-between gap-3 border-t border-slate-100 bg-slate-50/60 px-5 py-4 sm:flex-row sm:items-center sm:px-6">
              <p role="status" aria-live="polite" className="text-sm text-emerald-700">
                {saved ? 'Changes saved.' : ''}
              </p>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/25"
              >
                <SaveIcon className="size-4" />
                Save Changes
              </button>
            </div>
          </form>
          </section>
        )}

        <section className="flex max-w-md items-center justify-between gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-600">
              <LockKeyholeIcon className="size-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Password</h2>
              <p className="mt-0.5 text-xs text-slate-500">Update your account password.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowPasswordInfo(true)}
            className="shrink-0 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Change
          </button>
        </section>
      </div>

      {showPasswordInfo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowPasswordInfo(false)
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="password-info-title"
            className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl sm:p-6"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="password-info-title" className="font-semibold text-slate-900">Password</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Password changes aren&apos;t available in this demo because authentication is not connected to a secure password service.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close password information"
                onClick={() => setShowPasswordInfo(false)}
                className="flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <XIcon className="size-4" />
              </button>
            </div>
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setShowPasswordInfo(false)}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Close
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

export default Settings
