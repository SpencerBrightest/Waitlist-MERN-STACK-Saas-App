import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Landing() {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  const handleJoin = (e) => {
    e.preventDefault()
    if (email) navigate(`/join?email=${email}`)
  }

  return (
    <div className='min-h-screen bg-[#f5f5f3] font-sans antialiased text-gray-900 selection:bg-black selection:text-white'>
   

      {/* Hero Section */}
      <main className='flex flex-col items-center justify-center px-4 sm:px-6 pt-16 sm:pt-24 pb-16 text-center max-w-5xl mx-auto'>
        {/* Launch Badge
        <div className='inline-flex items-center gap-2 bg-white border border-gray-200/80 text-gray-600 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium mb-8 shadow-xs hover:border-gray-300 transition'>
          <span className='w-2 h-2 bg-emerald-500 rounded-full animate-pulse' />
          LAUNCHING SOON — JOIN THE WAITLIST
        </div> */}

        {/* Headline */}
        <h1 className='mb-6 text-4xl sm:text-6xl md:text-7xl font-extrabold leading-[1.1] tracking-tight text-gray-900'>
          Every Big Idea
          <br className='hidden sm:inline' />
          {' '}starts with a{' '}
          <br className='hidden sm:inline' />
          <span className='bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent'>waitlist</span>
        </h1>

        {/* Subtext */}
        <p className='text-gray-500 text-base sm:text-lg max-w-lg mb-10 leading-relaxed px-2'>
          Build momentum before launch with a sleek waitlist that captures your most excited supporters instantly.
        </p>

        {/* Email Form */}
        <form
          onSubmit={handleJoin}
          className='flex flex-col sm:flex-row items-center gap-2 bg-white border border-gray-200 rounded-2xl sm:rounded-full p-2 shadow-sm w-full max-w-md focus-within:ring-2 focus-within:ring-black/5 transition'
        >
          <input
            type='email'
            placeholder='name@domain.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full sm:flex-1 px-4 py-3 sm:py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none bg-transparent'
            required
          />
          <button
            type='submit'
            className='w-full sm:w-auto bg-black text-white text-sm px-6 py-3 sm:py-2.5 rounded-xl sm:rounded-full hover:bg-gray-800 transition-all font-medium whitespace-nowrap shadow-sm active:scale-95'
          >
            Join now
          </button>
        </form>

        {/* Social Proof */}
        <div className='flex flex-wrap items-center justify-center gap-3 mt-8'>
          <div className='flex -space-x-2'>
            {['#FDA4AF', '#86EFAC', '#93C5FD', '#FCD34D'].map((color, i) => (
              <div
                key={i}
                className='w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-semibold text-white shadow-xs'
                style={{ backgroundColor: color }}
              >
                {['A', 'B', 'C', 'D'][i]}
              </div>
            ))}
          </div>
          <p className='text-sm text-gray-500'>
            <span className='font-bold text-gray-900'>2,427</span> creators have already joined
          </p>
        </div>
      </main>

      {/* Divider */}
      <div className='border-t border-gray-200/60 max-w-6xl mx-auto px-6' />

      {/* Features Section */}
      <section className='max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-20'>
        <p className='text-xs text-gray-400 font-semibold tracking-widest text-center uppercase mb-12 sm:mb-16'>
          Everything you need to launch
        </p>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8'>
          {[
            {
              icon: '📋',
              title: 'Create in seconds',
              description: 'Set up your waitlist page in under a minute. No technical skills needed.'
            },
            {
              icon: '📧',
              title: 'Automatic emails',
              description: 'Every signup gets a confirmation email instantly. Keep your audience engaged.'
            },
            {
              icon: '📊',
              title: 'Export anytime',
              description: 'Download all your signups as CSV whenever you need them. Your data, your way.'
            }
          ].map((feature) => (
            <div
              key={feature.title}
              className='bg-white border border-gray-100/80 rounded-2xl p-6 sm:p-8 hover:shadow-md hover:border-gray-200 transition-all duration-200'
            >
              <span className='text-3xl mb-4 block'>{feature.icon}</span>
              <h3 className='font-bold text-gray-900 text-lg mb-2'>{feature.title}</h3>
              <p className='text-gray-500 text-sm leading-relaxed'>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className='border-t border-gray-200/60 max-w-6xl mx-auto px-6' />

      {/* How It Works */}
      <section className='max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center'>
        <p className='text-xs text-gray-400 font-semibold tracking-widest uppercase mb-3'>
          How it works
        </p>
        <h2 className='text-2xl sm:text-4xl font-extrabold text-gray-900 mb-12 sm:mb-16'>
          Simple as 1, 2, 3
        </h2>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 text-left'>
          {[
            {
              number: '01',
              title: 'Create your waitlist',
              description: 'Sign up and create your waitlist page in seconds.'
            },
            {
              number: '02',
              title: 'Share your link',
              description: 'Share your public waitlist link with your audience anywhere.'
            },
            {
              number: '03',
              title: 'Watch signups grow',
              description: 'See signups come in and export them when you are ready to launch.'
            }
          ].map((step) => (
            <div
              key={step.number}
              className='flex flex-col gap-3 bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-sm transition'
            >
              <span className='text-3xl font-extrabold text-gray-300'>
                {step.number}
              </span>
              <div>
                <h3 className='font-bold text-gray-900 text-base mb-1'>{step.title}</h3>
                <p className='text-gray-500 text-sm leading-relaxed'>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className='border-t border-gray-200/60 max-w-6xl mx-auto px-6' />

      {/* CTA Section */}
      <section className='max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center'>
        <h2 className='text-3xl sm:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight'>
          Ready to launch?
        </h2>
        <p className='text-gray-500 text-base sm:text-lg mb-8 max-w-lg mx-auto'>
          Join thousands of creators already using waitlist to build momentum before launch.
        </p>

        <form
          onSubmit={handleJoin}
          className='flex flex-col sm:flex-row items-center gap-2 bg-white border border-gray-200 rounded-2xl sm:rounded-full p-2 shadow-sm w-full max-w-md mx-auto focus-within:ring-2 focus-within:ring-black/5 transition'
        >
          <input
            type='email'
            placeholder='name@domain.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full sm:flex-1 px-4 py-3 sm:py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none bg-transparent'
            required
          />
          <button
            type='submit'
            className='w-full sm:w-auto bg-black text-white text-sm px-6 py-3 sm:py-2.5 rounded-xl sm:rounded-full hover:bg-gray-800 transition font-medium shadow-sm'
          >
            Join now
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className='border-t border-gray-200/80 bg-white px-4 sm:px-8 py-8'>
        <div className='max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left'>
          <div className='flex items-center gap-2'>
            <div className='w-6 h-6 bg-black rounded-full flex items-center justify-center'>
              <span className='text-white text-xs font-bold'>W</span>
            </div>
            <span className='text-base font-bold text-gray-900'>waitlist</span>
          </div>

          <div className='flex items-center gap-6'>
            <Link to='/terms' className='text-xs font-medium text-gray-500 hover:text-gray-900 transition'>
              Terms
            </Link>
            <Link to='/terms' className='text-xs font-medium text-gray-500 hover:text-gray-900 transition'>
              Privacy
            </Link>
            <Link to='/admin/login' className='text-xs font-medium text-gray-500 hover:text-gray-900 transition'>
              Admin Portal
            </Link>
          </div>

          <p className='text-xs text-gray-400'>
            © 2026 Waitlist. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
