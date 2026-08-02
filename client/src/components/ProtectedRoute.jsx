import { Navigate } from 'react-router-dom'
import useAuth from '../context/AuthContext'

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, admin, loading } = useAuth()

  if (loading) {
    return <div className='min-h-screen bg-[#f5f5f3] flex items-center justify-center text-sm text-gray-500'>Loading...</div>
  }

  if (adminOnly) {
    return admin ? children : <Navigate to='/admin/login' replace />
  }

  return user ? children : <Navigate to='/login' replace />
}
