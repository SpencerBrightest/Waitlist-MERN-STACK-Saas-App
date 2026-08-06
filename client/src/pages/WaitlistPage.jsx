import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from '../api/axios'
import Navbar from '../components/Navbar'
import SignupTable from '../components/SignupTable'

export default function WaitlistPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [waitlist, setWaitlist] = useState(null)
  const [signups, setSignups] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError('')

      try {
        const waitlistResponse = await axios.get(`/waitlists/${slug}`)
        const signupsResponse = await axios.get(`/waitlists/${slug}/signups`)

        setWaitlist(waitlistResponse.data?.waitlist || waitlistResponse.data)
        setSignups(signupsResponse.data?.signups || signupsResponse.data || [])
      } catch (err) {
        setError(err?.response?.data?.message || 'Unable to load this waitlist.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [slug])

  const handleCopy = async () => {
    setActionLoading(true)
    const publicUrl = `${window.location.origin}/w/${slug}`

    try {
      await navigator.clipboard.writeText(publicUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (err) {
      setError('Unable to copy link automatically.')
    } finally {
      setActionLoading(false)
    }
  }

  const handleExport = async () => {
    setActionLoading(true)
    setError('')

    try {
      const response = await axios.get(`/waitlists/${slug}/export`, { responseType: 'blob' })
      const blob = response.data instanceof Blob ? response.data : new Blob([response.data], { type: 'text/csv;charset=utf-8;' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${slug || 'waitlist'}.csv`
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      const rows = [['Name', 'Email', 'Joined'], ...signups.map((signup) => [signup.name || 'Anonymous', signup.email, signup.createdAt || signup.joinedAt || ''] )]
      const csv = rows.map((row) => row.join(',')).join('\n')
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${slug || 'waitlist'}.csv`
      link.click()
      window.URL.revokeObjectURL(url)
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-[#f5f5f3]'>
      <div className='mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-10'>
        <div className='mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
          <button type='button' onClick={() => navigate('/dashboard')} className='text-sm font-medium text-gray-600'>← Back</button>
          <h1 className='text-2xl font-bold text-gray-900'>{waitlist?.name || 'Waitlist'}</h1>
        </div>

        {error ? <div className='mb-6 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600'>{error}</div> : null}

        {loading ? (
          <div className='rounded-2xl border border-gray-100 bg-white py-10 text-center text-sm text-gray-500'>Loading...</div>
        ) : (
          <>
            <div className='mb-8 grid gap-4 md:grid-cols-3'>
              <div className='rounded-2xl border border-gray-100 bg-white p-6'>
                <p className='text-sm text-gray-500'>Total signups</p>
                <p className='mt-3 text-3xl font-bold text-gray-900'>{signups.length}</p>
              </div>
              <div className='rounded-2xl border border-gray-100 bg-white p-6'>
                <p className='text-sm text-gray-500'>Launch date</p>
                <p className='mt-3 text-lg font-semibold text-gray-900'>{waitlist?.launchDate ? new Date(waitlist.launchDate).toLocaleDateString() : 'Not set'}</p>
              </div>
              <div className='rounded-2xl border border-gray-100 bg-white p-6'>
                <p className='text-sm text-gray-500'>Public link</p>
                <a href={`/w/${slug}`} className='mt-3 block truncate text-sm font-medium text-indigo-600'>{`${window.location.origin}/w/${slug}`}</a>
              </div>
            </div>

            <div className='mb-6 flex flex-wrap gap-3'>
              <button type='button' onClick={handleCopy} disabled={actionLoading} className='rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm text-gray-700'>
                {copied ? 'Copied!' : 'Copy Public Link'}
              </button>
              <button type='button' onClick={handleExport} disabled={actionLoading} className='rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white'>
                {actionLoading ? 'Loading...' : 'Export CSV'}
              </button>
            </div>

            <SignupTable signups={signups} />
          </>
        )}
      </div>
    </div>
  )
}
