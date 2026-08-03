import { useMemo, useState } from 'react'
import { AuthContext } from './authContext'

const getStoredAuth = (key) => {
  if (typeof window === 'undefined') return null

  try {
    const value = window.localStorage.getItem(key)
    return value ? JSON.parse(value) : null
  } catch (error) {
    console.error(`Failed to read ${key} from storage`, error)
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredAuth('user'))
  const [admin, setAdmin] = useState(() => getStoredAuth('admin'))
  const [loading] = useState(false)

  // Normal user login
  const login = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData))
    setUser(userData)
  }

  // Normal user logout
  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  // Admin login
  const adminLogin = (adminData) => {
    localStorage.setItem('admin', JSON.stringify(adminData))
    setAdmin(adminData)
  }

  // Admin logout
  const adminLogout = () => {
    localStorage.removeItem('admin')
    setAdmin(null)
  }

  const value = useMemo(() => ({
    user,
    setUser,
    admin,
    setAdmin,
    loading,
    login,
    logout,
    adminLogin,
    adminLogout
  }), [admin, loading, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
