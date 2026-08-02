import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('user')
      const savedAdmin = localStorage.getItem('admin')

      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }

      if (savedAdmin) {
        setAdmin(JSON.parse(savedAdmin))
      }
    } catch (error) {
      console.error('Failed to restore auth state', error)
    } finally {
      setLoading(false)
    }
  }, [])

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

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        admin,
        setAdmin,
        loading,
        login,
        logout,
        adminLogin,
        adminLogout
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Default export
export default function useAuth() {
  return useContext(AuthContext)
}

