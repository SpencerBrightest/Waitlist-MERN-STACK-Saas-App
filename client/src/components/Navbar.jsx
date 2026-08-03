import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

export default function Navbar() {
  const { user, admin, logout, adminLogout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const activeAuth = user || admin

  const handleLogout = () => {
    if (admin) {
      adminLogout()
      navigate('/admin/login')
    } else {
      logout()
      navigate('/')
    }
  }

  return (
    <nav className='sticky top-0 z-50 border-b border-gray-100/80 bg-white/90 backdrop-blur-md px-4 py-3.5 sm:px-6 lg:px-8'>
      <div className='mx-auto flex max-w-7xl items-center justify-between'>
        <Link to={admin ? '/admin/dashboard' : user ? '/dashboard' : '/'} className='flex items-center gap-2.5 group'>
          <div className='flex h-8 w-8 items-center justify-center rounded-full bg-black shadow-sm group-hover:scale-105 transition-transform'>
            <span className='text-xs font-bold text-white tracking-wider'>W</span>
          </div>
          <span className='text-lg font-bold tracking-tight text-gray-900'>waitlist</span>
        </Link>

        {/* Desktop / Large Screen Navigation */}
        <div className='hidden lg:flex items-center gap-6'>
          {activeAuth ? (
            <>
              <Link to={admin ? '/admin/dashboard' : '/dashboard'} className='text-sm font-medium text-gray-600 hover:text-gray-900 transition'>
                Dashboard
              </Link>
              <span className='text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full'>
                {admin ? `Admin: ${admin.email}` : user?.name || user?.email}
              </span>
              <button
                type='button'
                onClick={handleLogout}
                className='rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 shadow-xs'
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to='/login' className='text-sm font-medium text-gray-600 hover:text-gray-900 transition'>
                Sign in
              </Link>
              <Link
                to='/register'
                className='rounded-full bg-black px-5 py-2 text-sm font-medium text-white transition hover:bg-gray-800 shadow-sm'
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Hamburger Menu Button for Small & Medium Devices (sm, md) */}
        <div className='flex lg:hidden items-center gap-2'>
          <button
            type='button'
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label='Toggle menu'
            className='inline-flex items-center justify-center rounded-xl p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none transition'
          >
            {menuOpen ? (
              <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' strokeWidth='2' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
              </svg>
            ) : (
              <svg className='h-6 w-6' fill='none' viewBox='0 0 24 24' strokeWidth='2' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5' />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile & Medium Device Drawer Menu */}
      {menuOpen && (
        <div className='lg:hidden mt-3 border-t border-gray-100 pt-4 pb-3 space-y-3 px-2 bg-white rounded-2xl shadow-lg border animate-in fade-in slide-in-from-top-2 duration-200'>
          {activeAuth ? (
            <>
              <div className='px-3 py-2 border-b border-gray-100'>
                <p className='text-xs font-semibold text-gray-400 uppercase tracking-wider'>Logged in as</p>
                <p className='text-sm font-medium text-gray-900 truncate'>{admin ? admin.email : user?.name || user?.email}</p>
              </div>
              <Link
                to={admin ? '/admin/dashboard' : '/dashboard'}
                onClick={() => setMenuOpen(false)}
                className='block px-3 py-2 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              >
                Dashboard
              </Link>
              <button
                type='button'
                onClick={() => {
                  setMenuOpen(false)
                  handleLogout()
                }}
                className='w-full text-left px-3 py-2 rounded-xl text-base font-medium text-red-600 hover:bg-red-50'
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to='/login'
                onClick={() => setMenuOpen(false)}
                className='block px-3 py-2 rounded-xl text-base font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              >
                Sign in
              </Link>
              <Link
                to='/register'
                onClick={() => setMenuOpen(false)}
                className='block w-full text-center rounded-full bg-black px-4 py-2.5 text-base font-medium text-white shadow-sm hover:bg-gray-800'
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  )
}
