import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from '../api/axios'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await axios.post('/auth/register', form)
      navigate('/login')
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to create your account.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-[#f5f5f3] px-4 py-10 sm:px-6 lg:px-8'>
      <div className='mx-auto flex max-w-md flex-col rounded-2xl border border-gray-100 bg-white p-8'>
        <Link to='/' className='mb-8 flex items-center gap-2'>
          <div className='flex h-8 w-8 items-center justify-center rounded-full bg-black'>
            <span className='text-sm font-bold text-white'>W</span>
          </div>
          <span className='text-lg font-semibold text-gray-900'>waitlist</span>
        </Link>

        <h1 className='text-2xl font-bold text-gray-900'>Get started</h1>
        <p className='mt-2 text-sm text-gray-500'>Create your owner account</p>

        <form onSubmit={handleSubmit} className='mt-8 space-y-4'>
          <div>
            <label className='mb-2 block text-sm text-gray-500'>Name</label>
            <input
              type='text'
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className='w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 focus:border-gray-400 focus:outline-none'
              placeholder='Your name'
              required
            />
          </div>

          <div>
            <label className='mb-2 block text-sm text-gray-500'>Email</label>
            <input
              type='email'
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className='w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 focus:border-gray-400 focus:outline-none'
              placeholder='name@domain.com'
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
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className='mt-6 text-center text-sm text-gray-500'>
          Already have an account?{' '}
          <Link to='/login' className='font-medium text-indigo-600'>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
