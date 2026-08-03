import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import axios from '../api/axios'

export default function PublicWaitlist() {
  const [searchParams] = useSearchParams()
  const { slug } = useParams()
  const initialEmail = searchParams.get('email') ?? ''

  // Form states
  const [name, setName] = useState('')
  const [email, setEmail] = useState(initialEmail)
  const [inputCode, setInputCode] = useState('')
  const [signupId, setSignupId] = useState('')
  
  // Step flow: 'request' -> 'verify' -> 'success'
  const [step, setStep] = useState('request')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)

  // Countdown timer state (e.g. 5 days, 12 hrs, 45 mins countdown to launch)
  const [timeLeft, setTimeLeft] = useState({ days: 5, hours: 12, minutes: 45, seconds: 0 })

  useEffect(() => {
    if (step !== 'success') return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 }
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 }
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 }
        return prev
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [step])

  // Step 1: Send access code to email
  const handleRequestCode = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const targetSlug = slug || 'default'
      const res = await axios.post(`/signups/${targetSlug}/join`, {
        name: name.trim(),
        email: email.trim()
      })

      setSignupId(res.data.signupId)
      setStep('verify')
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to send access code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Verify user entered the code sent to their email (server-side validation)
  const handleVerifyCode = async (e) => {
    e.preventDefault()
    setError('')
    setVerifying(true)

    try {
      await axios.post('/signups/verify', {
        signupId,
        code: inputCode.trim()
      })

      setStep('success')
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid access code. Please check your email and try again.')
    } finally {
      setVerifying(false)
    }
  }

  // Resend code
  const handleResendCode = async () => {
    setError('')
    setLoading(true)

    try {
      const targetSlug = slug || 'default'
      const res = await axios.post(`/signups/${targetSlug}/join`, {
        name: name.trim(),
        email: email.trim()
      })

      setSignupId(res.data.signupId)
      setError('')
      alert('A new verification code has been sent to your email.')
    } catch (err) {
      setError(err?.response?.data?.message || 'Unable to resend code.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-[#f5f5f3] px-4 py-10 sm:px-6 lg:px-8 font-sans antialiased text-gray-900'>
      <div className='mx-auto flex max-w-xl flex-col rounded-3xl border border-gray-100 bg-white p-6 sm:p-10 shadow-sm'>
        
        {/* Brand Header */}
        <Link to='/' className='mb-8 inline-flex items-center gap-2.5 w-fit'>
          <div className='flex h-8 w-8 items-center justify-center rounded-full bg-black shadow-xs'>
            <span className='text-xs font-bold text-white'>W</span>
          </div>
          <span className='text-lg font-bold tracking-tight text-gray-900'>waitlist</span>
        </Link>

        {/* STEP 1: Enter Email & Request Access Code */}
        {step === 'request' && (
          <>
            <p className='text-xs font-semibold uppercase tracking-[0.2em] text-gray-400'>Get Priority Access</p>
            <h1 className='mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900'>Join the waitlist</h1>
            <p className='mt-2 text-sm text-gray-500'>Enter your email below. We'll send an authentication code directly to your inbox.</p>

            <form onSubmit={handleRequestCode} className='mt-8 space-y-4'>
              <div>
                <label className='mb-2 block text-sm font-medium text-gray-700'>Full Name</label>
                <input
                  type='text'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className='w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-gray-900 focus:outline-none transition'
                  placeholder='Alex Morgan'
                  required
                />
              </div>

              <div>
                <label className='mb-2 block text-sm font-medium text-gray-700'>Email address</label>
                <input
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 focus:border-gray-900 focus:outline-none transition'
                  placeholder='name@domain.com'
                  required
                />
              </div>

              {error && <div className='rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600'>{error}</div>}

              <button
                type='submit'
                disabled={loading}
                className='w-full rounded-full bg-black px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-60 shadow-sm'
              >
                {loading ? 'Sending verification code...' : 'Join now & Get Code'}
              </button>
            </form>
          </>
        )}

        {/* STEP 2: Authenticate with Code — NO code is shown on screen */}
        {step === 'verify' && (
          <>
            <p className='text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600'>Verification Code Sent 📧</p>
            <h1 className='mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900'>Check your inbox</h1>
            <p className='mt-2 text-sm text-gray-500'>
              We sent a 6-digit verification code to <span className='font-semibold text-gray-800'>{email}</span>. Enter it below to complete your registration.
            </p>

            <form onSubmit={handleVerifyCode} className='mt-6 space-y-4'>
              <div>
                <label className='mb-2 block text-sm font-medium text-gray-700'>Enter 6-digit Code</label>
                <input
                  type='text'
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  className='w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-center text-xl font-bold tracking-[0.3em] text-gray-900 focus:border-gray-900 focus:outline-none transition'
                  placeholder='• • • • • •'
                  maxLength={6}
                  required
                />
              </div>

              {error && <div className='rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600'>{error}</div>}

              <button
                type='submit'
                disabled={verifying}
                className='w-full rounded-full bg-black px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:opacity-60 shadow-sm'
              >
                {verifying ? 'Verifying...' : 'Verify & Join Waitlist'}
              </button>

              <div className='flex items-center justify-between pt-1'>
                <button
                  type='button'
                  onClick={() => { setStep('request'); setError(''); setInputCode(''); }}
                  className='text-xs font-medium text-gray-500 hover:text-gray-900 py-1'
                >
                  ← Back to email
                </button>
                <button
                  type='button'
                  onClick={handleResendCode}
                  disabled={loading}
                  className='text-xs font-medium text-emerald-600 hover:text-emerald-800 py-1'
                >
                  {loading ? 'Sending...' : 'Resend code'}
                </button>
              </div>
            </form>
          </>
        )}

        {/* STEP 3: Authenticated Success + Countdown Timer */}
        {step === 'success' && (
          <div className='text-center py-4'>
            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600 animate-bounce'>
              🎉
            </div>
            
            <h1 className='text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900'>You have been added to the waitlist!</h1>
            <p className='mt-2 text-sm text-gray-500 max-w-md mx-auto'>
              Your spot is secured. We'll notify <span className='font-semibold text-gray-800'>{email}</span> as soon as access unlocks.
            </p>

            {/* Countdown Timer */}
            <div className='mt-8 rounded-3xl border border-gray-100 bg-[#fafaf8] p-6 shadow-inner'>
              <p className='text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 mb-4'>Estimated Launch Countdown</p>
              
              <div className='grid grid-cols-4 gap-2 sm:gap-4 max-w-sm mx-auto'>
                {[
                  { label: 'Days', value: timeLeft.days },
                  { label: 'Hours', value: timeLeft.hours },
                  { label: 'Mins', value: timeLeft.minutes },
                  { label: 'Secs', value: timeLeft.seconds }
                ].map((item) => (
                  <div key={item.label} className='flex flex-col items-center bg-white rounded-2xl p-3 border border-gray-100 shadow-xs'>
                    <span className='text-xl sm:text-2xl font-extrabold text-gray-900 font-mono'>
                      {String(item.value).padStart(2, '0')}
                    </span>
                    <span className='text-[10px] sm:text-xs font-medium text-gray-400 mt-1 uppercase'>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              to='/'
              className='mt-8 inline-block rounded-full border border-gray-200 bg-white px-6 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition'
            >
              Back to Home
            </Link>
          </div>
        )}

      </div>
    </div>
  )
}
