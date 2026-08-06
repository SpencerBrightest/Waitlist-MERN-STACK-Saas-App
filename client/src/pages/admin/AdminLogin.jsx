import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../api/axios'
import useAuth from '../../hooks/useAuth'

export default function AdminLogin() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { adminLogin } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axios.post('/admin/login', form)
      const payload = response.data?.admin ? { ...response.data.admin, token: response.data.token } : { ...response.data, token: response.data?.token }
      adminLogin(payload)
      setForm({ email: '', password: '' })
      navigate('/admin/dashboard')
    } catch (err) {
      setError('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-[#f5f5f3] px-4 py-10 sm:px-6 lg:px-8'>
      <div className='mx-auto flex max-w-sm flex-col rounded-2xl border border-gray-100 bg-white p-8'>
        <div className='mb-6 flex items-center justify-center'>
          <div className='flex h-10 w-10 items-center justify-center rounded-full bg-black text-lg text-white'>🔐</div>
        </div>

        <div className='mb-6 flex justify-center'>
          <span className='rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-500'>Admin</span>
        </div>

        <h1 className='text-center text-xl font-bold text-gray-900'>Admin login</h1>
        <p className='mt-2 text-center text-sm text-gray-500'>Access your dashboard</p>

        <form onSubmit={handleSubmit} className='mt-8 space-y-4'>
          <div>
            <label className='mb-2 block text-sm text-gray-500'>Email</label>
            <input
              type='email'
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className='w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 focus:border-gray-400 focus:outline-none'
              placeholder='admin@waitlist.com'
              required
            />
          </div>

          <div>
            <label className='mb-2 block text-sm text-gray-500'>Password</label>
            <input
              type='password'
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className='w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 focus:border-gray-400 focus:outline-none'
              placeholder='••••••••'
              required
            />
          </div>

          {error ? <div className='rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600'>{error}</div> : null}

          <button type='submit' disabled={loading} className='w-full rounded-full bg-black px-4 py-3 text-sm font-medium text-white disabled:opacity-60'>
            {loading ? 'Loading...' : 'Sign in'}
          </button>
        </form>

        <p className='mt-8 text-center text-xs text-gray-400'>© 2026 Waitlist</p>
      </div>
    </div>
  )
}
