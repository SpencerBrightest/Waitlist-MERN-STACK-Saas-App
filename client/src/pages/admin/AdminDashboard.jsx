import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../api/axios'
import useAuth from '../../context/AuthContext'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [owners, setOwners] = useState([])
  const [waitlists, setWaitlists] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { adminLogout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      setError('')

      try {
        const [statsResponse, ownersResponse, waitlistsResponse] = await Promise.all([
          axios.get('/admin/stats'),
          axios.get('/admin/owners'),
          axios.get('/admin/waitlists')
        ])

        setStats(statsResponse.data?.stats || statsResponse.data)
        setOwners(ownersResponse.data?.owners || ownersResponse.data || [])
        setWaitlists(waitlistsResponse.data?.waitlists || waitlistsResponse.data || [])
      } catch (err) {
        setError(err?.response?.data?.message || 'Unable to load admin dashboard.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/admin/waitlist/${id}`)
      setWaitlists((prev) => prev.filter((waitlist) => waitlist._id !== id))
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to delete waitlist.')
    }
  }

  const handleLogout = () => {
    adminLogout()
    navigate('/admin/login')
  }

  return (
    <div className='min-h-screen bg-[#f5f5f3]'>
      <div className='flex min-h-screen'>
        <aside className='hidden w-56 flex-col border-r border-gray-100 bg-white p-6 lg:flex'>
          <div className='mb-10 flex items-center gap-2'>
            <div className='flex h-7 w-7 items-center justify-center rounded-full bg-black'>
              <span className='text-xs font-bold text-white'>W</span>
            </div>
            <span className='text-base font-semibold text-gray-900'>waitlist</span>
          </div>

          <nav className='flex-1 space-y-2 text-sm text-gray-500'>
            <div className='rounded-xl bg-gray-50 px-3 py-2 font-medium text-gray-900'>Overview</div>
            <div className='px-3 py-2'>Waitlists</div>
            <div className='px-3 py-2'>Owners</div>
          </nav>

          <button type='button' onClick={handleLogout} className='rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700'>Logout</button>
        </aside>

        <main className='flex-1 p-4 sm:p-8'>
          <div className='mb-6 flex items-center justify-between'>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>Platform overview</h1>
              <p className='mt-1 text-sm text-gray-500'>Manage owners and waitlists from one place.</p>
            </div>
            <button type='button' onClick={handleLogout} className='rounded-full border border-gray-200 bg-white px-4 py-2 text-sm text-gray-700 lg:hidden'>Logout</button>
          </div>

          {error ? <div className='mb-6 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600'>{error}</div> : null}

          {loading ? (
            <div className='rounded-2xl border border-gray-100 bg-white py-10 text-center text-sm text-gray-500'>Loading...</div>
          ) : (
            <>
              <div className='mb-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4'>
                <div className='rounded-2xl border border-gray-100 bg-white p-6'>
                  <p className='text-sm text-gray-500'>Total Owners</p>
                  <p className='mt-3 text-3xl font-bold text-gray-900'>{stats?.owners ?? owners.length}</p>
                </div>
                <div className='rounded-2xl border border-gray-100 bg-white p-6'>
                  <p className='text-sm text-gray-500'>Total Waitlists</p>
                  <p className='mt-3 text-3xl font-bold text-gray-900'>{stats?.waitlists ?? waitlists.length}</p>
                </div>
                <div className='rounded-2xl border border-gray-100 bg-white p-6'>
                  <p className='text-sm text-gray-500'>Total Signups</p>
                  <p className='mt-3 text-3xl font-bold text-gray-900'>{stats?.signups ?? 0}</p>
                </div>
                <div className='rounded-2xl border border-gray-100 bg-white p-6'>
                  <p className='text-sm text-gray-500'>Today's Signups</p>
                  <p className='mt-3 text-3xl font-bold text-gray-900'>{stats?.today ?? 0}</p>
                </div>
              </div>

              <section className='mb-8'>
                <h2 className='mb-4 text-lg font-semibold text-gray-900'>All Owners</h2>
                <div className='overflow-hidden rounded-2xl border border-gray-100 bg-white'>
                  <table className='min-w-full divide-y divide-gray-100 text-sm'>
                    <thead className='bg-gray-50 text-xs uppercase tracking-wider text-gray-500'>
                      <tr>
                        <th className='px-4 py-3 text-left'>Name</th>
                        <th className='px-4 py-3 text-left'>Email</th>
                        <th className='px-4 py-3 text-left'>Joined date</th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-100'>
                      {owners.map((owner) => (
                        <tr key={owner._id || owner.email} className='hover:bg-gray-50'>
                          <td className='px-4 py-3 text-gray-900'>{owner.name || 'Unknown'}</td>
                          <td className='px-4 py-3 text-gray-600'>{owner.email}</td>
                          <td className='px-4 py-3 text-gray-500'>{owner.createdAt ? new Date(owner.createdAt).toLocaleDateString() : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h2 className='mb-4 text-lg font-semibold text-gray-900'>All Waitlists</h2>
                <div className='overflow-hidden rounded-2xl border border-gray-100 bg-white'>
                  <table className='min-w-full divide-y divide-gray-100 text-sm'>
                    <thead className='bg-gray-50 text-xs uppercase tracking-wider text-gray-500'>
                      <tr>
                        <th className='px-4 py-3 text-left'>Name</th>
                        <th className='px-4 py-3 text-left'>Owner</th>
                        <th className='px-4 py-3 text-left'>Signups</th>
                        <th className='px-4 py-3 text-left'>Created</th>
                        <th className='px-4 py-3 text-left'>Action</th>
                      </tr>
                    </thead>
                    <tbody className='divide-y divide-gray-100'>
                      {waitlists.map((waitlist) => (
                        <tr key={waitlist._id || waitlist.slug} className='hover:bg-gray-50'>
                          <td className='px-4 py-3 text-gray-900'>{waitlist.name}</td>
                          <td className='px-4 py-3 text-gray-600'>{waitlist.owner?.name || 'Unknown'}</td>
                          <td className='px-4 py-3 text-gray-500'>{waitlist.signups?.length || waitlist.signupCount || 0}</td>
                          <td className='px-4 py-3 text-gray-500'>{waitlist.createdAt ? new Date(waitlist.createdAt).toLocaleDateString() : '—'}</td>
                          <td className='px-4 py-3'>
                            <button type='button' onClick={() => handleDelete(waitlist._id || waitlist.slug)} className='text-sm text-red-500'>Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  )
}
