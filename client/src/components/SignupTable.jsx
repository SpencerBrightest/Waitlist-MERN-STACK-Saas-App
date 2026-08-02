export default function SignupTable({ signups = [] }) {
  const formatDate = (value) => {
    if (!value) return '—'
    return new Date(value).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  if (!signups.length) {
    return (
      <div className='rounded-2xl border border-gray-100 bg-white py-16 text-center'>
        <p className='text-gray-500'>No signups yet</p>
        <p className='mt-2 text-sm text-gray-400'>Share your public link to start collecting emails.</p>
      </div>
    )
  }

  return (
    <div className='overflow-hidden rounded-2xl border border-gray-100 bg-white'>
      <table className='min-w-full divide-y divide-gray-100 text-sm'>
        <thead className='bg-gray-50 text-xs uppercase tracking-wider text-gray-500'>
          <tr>
            <th className='px-4 py-3 text-left'>#</th>
            <th className='px-4 py-3 text-left'>Name</th>
            <th className='px-4 py-3 text-left'>Email</th>
            <th className='px-4 py-3 text-left'>Joined</th>
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-100'>
          {signups.map((signup, index) => (
            <tr key={signup._id || `${signup.email}-${index}`} className='hover:bg-gray-50'>
              <td className='px-4 py-3 text-gray-500'>{index + 1}</td>
              <td className='px-4 py-3 text-gray-900'>{signup.name || <span className='italic text-gray-400'>Anonymous</span>}</td>
              <td className='px-4 py-3 text-gray-600'>{signup.email}</td>
              <td className='px-4 py-3 text-gray-500'>{formatDate(signup.createdAt || signup.joinedAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
