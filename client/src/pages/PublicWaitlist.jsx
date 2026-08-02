import { useMemo, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import axios from '../api/axios'

export default function PublicWaitlist() {
  const [searchParams] = useSearchParams()
  const { slug } = useParams()
  const email = searchParams.get('email') ?? ''
  const [name, setName] = useState('')
  const [signupEmail, setSignupEmail] = useState(email)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const code = useMemo(() => {
    const base = (email || slug || 'WAITLIST').split('@')[0].toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4)
    const seed = Array.from(email || slug || 'WAITLIST').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const suffix = String((seed % 9000) + 1000)
    return `${base || 'WAIT'}-${suffix}`
  }, [email, slug])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await axios.post(`/waitlists/${slug}/signup`, {
        name: name.trim(),
        email: signupEmail.trim()
      })
      setSubmitted(true)
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to save your signup right now.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-[#f5f5f3] px-4 py-10 sm:px-6 lg:px-8'>
      <div className='mx-auto flex max-w-2xl flex-col rounded-2xl border border-gray-100 bg-white p-8'>
        <div className='mb-6 flex items-center gap-2'>
          <div className='flex h-8 w-8 items-center justify-center rounded-full bg-black'>
            <span className='text-sm font-bold text-white'>W</span>
          </div>
          <span className='text-lg font-semibold text-gray-900'>waitlist</span>
        </div>

        <p className='text-sm font-semibold uppercase tracking-[0.3em] text-gray-400'>You're in</p>
        <h1 className='mt-2 text-2xl font-bold text-gray-900'>Join the waitlist</h1>
        <p className='mt-2 text-sm text-gray-500'>Thanks for joining{email ? `, ${email}` : ''}. Share this code with your audience.</p>

        <div className='mt-8 rounded-2xl border border-gray-100 bg-[#fafaf8] p-6'>
          <p className='text-sm text-gray-500'>Access code</p>
          <p className='mt-2 text-3xl font-semibold tracking-[0.2em] text-gray-900'>{code}</p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className='mt-8 space-y-4'>
            <div>
              <label className='mb-2 block text-sm text-gray-500'>Name</label>
              <input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 focus:border-gray-400 focus:outline-none'
                placeholder='Your name'
                required
              />
            </div>
            <div>
              <label className='mb-2 block text-sm text-gray-500'>Email</label>
              <input
                type='email'
                value={signupEmail}
                onChange={(e) => setSignupEmail(e.target.value)}
                className='w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 focus:border-gray-400 focus:outline-none'
                placeholder='name@domain.com'
                required
              />
            </div>

            {error ? <div className='rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600'>{error}</div> : null}

            <button type='submit' disabled={loading} className='w-full rounded-full bg-black px-4 py-3 text-sm font-medium text-white disabled:opacity-60'>
              {loading ? 'Loading...' : 'Join now'}
            </button>
          </form>
        ) : (
          <div className='mt-8 rounded-2xl border border-gray-100 bg-white p-4 text-sm text-gray-600'>
            Thanks for signing up. Your interest has been recorded successfully.
          </div>
        )}

        <Link to='/' className='mt-6 text-sm font-medium text-gray-600'>Back home</Link>
      </div>
    </div>
  )
}
