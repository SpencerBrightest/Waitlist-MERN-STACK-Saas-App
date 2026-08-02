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
    <div className='min-h-screen bg-[#f5f5f3] font-sans'>

    
      {/* Hero Section */}
      <main className='flex flex-col items-center justify-center px-6 pt-24 pb-16 text-center'>

        {/* Launch Badge
        <div className='inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-500 px-4 py-1.5 rounded-full text-xs font-medium mb-10 shadow-sm'>
          <span className='w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse'/>
          LAUNCHING SOON — JOIN THE WAITLIST
        </div> */}

        {/* Headline */}
        <h1 className='mb-6 text-5xl font-bold leading-tight tracking-tight text-gray-900 md:text-6xl lg:text-7xl'>
          Every Big Idea
          <br />
          starts with a
          <br />
          waitlist
        </h1>

        {/* Subtext */}
        <p className='text-gray-500 text-lg max-w-md mb-10 leading-relaxed'>
          Build momentum before launch with a simple waitlist that
          captures your most excited supporters.
        </p>

        {/* Email Form */}
        <form
          onSubmit={handleJoin}
          className='flex items-center gap-2 bg-white border border-gray-200 rounded-full px-2 py-2 shadow-sm w-full max-w-md'
        >
          <input
            type='email'
            placeholder='name@domain.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='flex-1 px-4 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none bg-transparent'
            required
          />
          <button
            type='submit'
            className='bg-black text-white text-sm px-6 py-2.5 rounded-full hover:bg-gray-800 transition font-medium whitespace-nowrap'
          >
            Join now
          </button>
        </form>

        {/* Social Proof */}
        <div className='flex items-center gap-3 mt-8'>
          {/* Avatar Stack */}
          <div className='flex -space-x-2'>
            {['#FDA4AF', '#86EFAC', '#93C5FD', '#FCD34D'].map((color, i) => (
              <div
                key={i}
                className='w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-white'
                style={{ backgroundColor: color }}
              >
                {['A', 'B', 'C', 'D'][i]}
              </div>
            ))}
          </div>
          <p className='text-sm text-gray-500'>
            <span className='font-semibold text-gray-800'>2,427</span> have already joined
          </p>
        </div>
      </main>

      {/* Divider */}
      <div className='border-t border-gray-200 mx-8' />

      {/* Features Section */}
      <section className='max-w-5xl mx-auto px-6 py-20'>
        <p className='text-xs text-gray-400 font-medium tracking-widest text-center uppercase mb-16'>
          Everything you need to launch
        </p>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
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
              className='bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-sm transition'
            >
              <span className='text-2xl mb-4 block'>{feature.icon}</span>
              <h3 className='font-semibold text-gray-900 mb-2'>{feature.title}</h3>
              <p className='text-gray-500 text-sm leading-relaxed'>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className='border-t border-gray-200 mx-8' />

      {/* How It Works */}
      <section className='max-w-3xl mx-auto px-6 py-20 text-center'>
        <p className='text-xs text-gray-400 font-medium tracking-widest uppercase mb-4'>
          How it works
        </p>
        <h2 className='text-3xl font-bold text-gray-900 mb-16'>
          Simple as 1, 2, 3
        </h2>

        <div className='space-y-6'>
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
              className='flex items-start gap-6 bg-white border border-gray-100 rounded-2xl p-6 text-left'
            >
              <span className='text-2xl font-bold text-gray-200 shrink-0'>
                {step.number}
              </span>
              <div>
                <h3 className='font-semibold text-gray-900 mb-1'>{step.title}</h3>
                <p className='text-gray-500 text-sm'>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className='border-t border-gray-200 mx-8' />

      {/* CTA Section */}
      <section className='max-w-2xl mx-auto px-6 py-20 text-center'>
        <h2 className='text-4xl font-bold text-gray-900 mb-4'>
          Ready to launch?
        </h2>
        <p className='text-gray-500 mb-10'>
          Join thousands of creators already using waitlist to build momentum before launch.
        </p>

        <form
          onSubmit={handleJoin}
          className='flex items-center gap-2 bg-white border border-gray-200 rounded-full px-2 py-2 shadow-sm w-full max-w-md mx-auto'
        >
          <input
            type='email'
            placeholder='name@domain.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='flex-1 px-4 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none bg-transparent'
          />
          <button
            type='submit'
            className='bg-black text-white text-sm px-6 py-2.5 rounded-full hover:bg-gray-800 transition font-medium'
          >
            Join now
          </button>
        </form>
      </section>

      {/* Divider */}
      <div className='border-t border-gray-200 mx-8' />

      {/* Footer */}
      <footer className='flex flex-col md:flex-row justify-between items-center px-8 py-6 gap-4'>
        <div className='flex items-center gap-2'>
          <div className='w-5 h-5 bg-black rounded-full flex items-center justify-center'>
            <span className='text-white text-xs font-bold'>W</span>
          </div>
          <span className='text-sm font-semibold text-gray-900'>waitlist</span>
        </div>

        <div className='flex items-center gap-6'>
          <Link to='/terms' className='text-xs text-gray-400 hover:text-gray-600 transition'>
            Terms
          </Link>
          <Link to='/terms' className='text-xs text-gray-400 hover:text-gray-600 transition'>
            Privacy
          </Link>
          <Link to='/admin/login' className='text-xs text-gray-400 hover:text-gray-600 transition'>
            Admin
          </Link>
        </div>

        <p className='text-xs text-gray-400'>
          © 2026 Waitlist. Built by Spencer Bright.
        </p>
      </footer>

    </div>
  )
}