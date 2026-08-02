import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../api/axios'
import Navbar from '../components/Navbar'
import WaitlistCard from '../components/WaitlistCard'
import useAuth from '../context/AuthContext'

export default function Dashboard() {
  const [waitlists, setWaitlists] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', description: '', launchDate: '' })
  const { user } = useAuth()
  const navigate = useNavigate()

  const loadWaitlists = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await axios.get('/waitlists')
      const data = response.data?.waitlists || response.data || []
      setWaitlists(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to load waitlists right now.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true

    const fetchData = async () => {
      setLoading(true)
      setError('')

      try {
        const response = await axios.get('/waitlists')
        const data = response.data?.waitlists || response.data || []
        if (active) {
          setWaitlists(Array.isArray(data) ? data : [])
        }
      } catch (err) {
        if (active) {
          setError(err?.response?.data?.message || 'Unable to load waitlists right now.')
        }
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      active = false
    }
  }, [])

  const totalSignups = waitlists.reduce((sum, waitlist) => sum + (waitlist.signups?.length || waitlist.signupCount || 0), 0)
  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening'

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) return

    setCreating(true)
    setError('')

    try {
      const response = await axios.post('/waitlists', {
        name: form.name.trim(),
        description: form.description.trim(),
        launchDate: form.launchDate || undefined
      })

      const created = response.data?.waitlist || response.data
      setWaitlists((prev) => [created, ...prev])
      setCreateOpen(false)
      setForm({ name: '', description: '', launchDate: '' })
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to create waitlist.')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id, e) => {
    e.stopPropagation()
    setError('')

    try {
      await axios.delete(`/waitlists/${id}`)
      setWaitlists((prev) => prev.filter((item) => item._id !== id))
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to delete waitlist.')
    }
  }

  return (
    <div className='min-h-screen bg-[#f5f5f3]'>
      <Navbar />

      <div className='mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-10'>
        <div className='mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>
              {greeting}, {user?.name || 'there'} 👋
            </h1>
            <p className='mt-1 text-sm text-gray-500'>Manage your waitlists and track signups.</p>
          </div>

          <button
            type='button'
            onClick={() => setCreateOpen((prev) => !prev)}
            className='rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white'
          >
            New Waitlist
          </button>
        </div>

        {error ? <div className='mb-6 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600'>{error}</div> : null}

        <div className='mb-8 grid gap-4 md:grid-cols-2'>
          <div className='rounded-2xl border border-gray-100 bg-white p-6'>
            <p className='text-sm text-gray-500'>Total Waitlists</p>
            <p className='mt-3 text-3xl font-bold text-gray-900'>{waitlists.length}</p>
          </div>
          <div className='rounded-2xl border border-gray-100 bg-white p-6'>
            <p className='text-sm text-gray-500'>Total Signups</p>
            <p className='mt-3 text-3xl font-bold text-gray-900'>{totalSignups}</p>
          </div>
        </div>

        {createOpen ? (
          <form onSubmit={handleCreate} className='mb-8 rounded-2xl border border-gray-100 bg-white p-6'>
            <div className='grid gap-4 md:grid-cols-2'>
              <div className='md:col-span-2'>
                <label className='mb-2 block text-sm text-gray-500'>Name</label>
                <input
                  type='text'
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className='w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 focus:border-gray-400 focus:outline-none'
                  placeholder='My launch list'
                  required
                />
              </div>
              <div className='md:col-span-2'>
                <label className='mb-2 block text-sm text-gray-500'>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className='min-h-24 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 focus:border-gray-400 focus:outline-none'
                  placeholder='A short summary of your launch'
                />
              </div>
              <div>
                <label className='mb-2 block text-sm text-gray-500'>Launch date</label>
                <input
                  type='date'
                  value={form.launchDate}
                  onChange={(e) => setForm({ ...form, launchDate: e.target.value })}
                  className='w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-gray-900 focus:border-gray-400 focus:outline-none'
                />
              </div>
            </div>

            <div className='mt-6 flex flex-wrap gap-3'>
              <button type='submit' disabled={creating} className='rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60'>
                {creating ? 'Creating...' : 'Create waitlist'}
              </button>
              <button type='button' onClick={() => setCreateOpen(false)} className='rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm text-gray-700'>
                Cancel
              </button>
            </div>
          </form>
        ) : null}

        {loading ? (
          <div className='rounded-2xl border border-gray-100 bg-white py-10 text-center text-sm text-gray-500'>Loading...</div>
        ) : waitlists.length ? (
          <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
            {waitlists.map((waitlist) => (
              <WaitlistCard
                key={waitlist._id || waitlist.slug}
                waitlist={waitlist}
                onClick={() => navigate(`/waitlist/${waitlist.slug || waitlist._id}`)}
                onDelete={(e) => handleDelete(waitlist._id || waitlist.slug, e)}
              />
            ))}
          </div>
        ) : (
          <div className='rounded-2xl border border-gray-100 bg-white px-6 py-16 text-center'>
            <p className='text-lg font-semibold text-gray-900'>No waitlists yet</p>
            <p className='mt-2 text-sm text-gray-500'>Create your first waitlist</p>
            <div className='mt-6 flex justify-center text-2xl text-gray-400'>↗</div>
          </div>
        )}
      </div>
    </div>
  )
}
