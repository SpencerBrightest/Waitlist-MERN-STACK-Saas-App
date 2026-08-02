import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className='border-b border-gray-100 bg-white px-4 py-4 sm:px-8'>
      <div className='mx-auto flex max-w-6xl items-center justify-between'>
        <Link to={user ? '/dashboard' : '/'} className='flex items-center gap-2'>
          <div className='flex h-7 w-7 items-center justify-center rounded-full bg-black'>
            <span className='text-xs font-bold text-white'>W</span>
          </div>
          <span className='text-base font-semibold tracking-tight text-gray-900'>waitlist</span>
        </Link>

        <div className='flex items-center gap-3'>
          {user?.name ? (
            <span className='hidden text-sm text-gray-500 sm:block'>{user.name}</span>
          ) : null}
          <button
            type='button'
            onClick={handleLogout}
            className='rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 transition hover:bg-gray-50'
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}