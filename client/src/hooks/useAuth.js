import { useContext } from 'react'
import { AuthContext } from '../context/authContext'

export default function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    return { user: null, admin: null, loading: false, login: () => {}, logout: () => {}, adminLogin: () => {}, adminLogout: () => {} }
  }
  return context
}

