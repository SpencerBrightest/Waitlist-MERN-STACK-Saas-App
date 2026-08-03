import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext.jsx'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import WaitlistPage from './pages/WaitlistPage'
import PublicWaitlist from './pages/PublicWaitlist'
import Terms from './pages/Terms'
import AdminLogin from './pages/admin/AdminLogin'
import AdminDashboard from './pages/admin/AdminDashboard'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/terms' element={<Terms />} />
          <Route path='/join' element={<PublicWaitlist />} />
          <Route path='/w/:slug' element={<PublicWaitlist />} />
          <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path='/waitlist/:slug' element={<ProtectedRoute><WaitlistPage /></ProtectedRoute>} />
          <Route path='/admin/login' element={<AdminLogin />} />
          <Route path='/admin/dashboard' element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
