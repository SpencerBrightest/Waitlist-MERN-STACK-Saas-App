export default function WaitlistCard({ waitlist, onClick, onDelete }) {
  const launchDate = waitlist.launchDate ? new Date(waitlist.launchDate).toLocaleDateString() : 'No date'

  return (
    <div
      onClick={onClick}
      className='cursor-pointer rounded-2xl border border-gray-100 bg-white p-6 transition hover:shadow-sm'
    >
      <div className='flex items-start justify-between gap-3'>
        <div>
          <h3 className='font-semibold text-gray-900'>{waitlist.name || 'Untitled waitlist'}</h3>
          <p className='mt-1 line-clamp-2 text-sm text-gray-500'>
            {waitlist.description || 'A fresh waitlist ready for signups.'}
          </p>
        </div>
        <button
          type='button'
          onClick={onDelete}
          className='text-xs text-red-400 transition hover:text-red-600'
        >
          Delete
        </button>
      </div>

      <div className='mt-4 flex items-center justify-between border-t border-gray-100 pt-4 text-sm text-gray-500'>
        <span className='flex items-center gap-2'>
          <span>👥</span>
          <span>{waitlist.signups?.length || waitlist.signupCount || 0} signups</span>
        </span>
        <span className='text-gray-400'>{launchDate}</span>
      </div>
    </div>
  )
}
