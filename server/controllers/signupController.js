import Waitlist from '../models/Waitlist.js'
import Signup from '../models/Signup.js'
import { sendVerificationEmail } from '../utils/sendEmail.js'
import { createSignupFallback, getWaitlistBySlugFallback } from '../utils/fallbackStore.js'

// In-memory store for verification codes when DB is unavailable
const pendingCodes = new Map()

export const joinWaitlist = async (req, res) => {
  try {
    const { slug } = req.params
    const { name, email } = req.body

    if (!email) {
      return res.status(400).json({ message: 'Email is required' })
    }

    // Find the waitlist
    let waitlist
    try {
      if (slug === 'default') {
        // When no specific slug is provided (e.g. from Landing page /join),
        // use the most recently created waitlist
        waitlist = await Waitlist.findOne({}).sort({ createdAt: -1 })
      } else {
        waitlist = await Waitlist.findOne({ slug })
      }
    } catch (dbError) {
      waitlist = getWaitlistBySlugFallback(slug)
    }

    if (!waitlist) {
      return res.status(404).json({ message: 'Waitlist not found. Please create a waitlist first from the dashboard.' })
    }

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
    const codeExpiresAt = new Date(Date.now() + 15 * 60 * 1000) // 15 min expiry

    // Try to save signup to DB (unverified)
    let signupId
    try {
      const signup = await Signup.create({
        waitlistId: waitlist._id,
        name: name || '',
        email,
        verificationCode,
        verified: false,
        codeExpiresAt
      })
      signupId = signup._id.toString()
    } catch (dbError) {
      // Fallback: store code in memory
      signupId = `mem-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
      pendingCodes.set(signupId, {
        code: verificationCode,
        email,
        name: name || '',
        waitlistId: waitlist._id,
        expiresAt: codeExpiresAt,
        waitlistName: waitlist.name
      })
    }

    // Send verification email
    const emailResult = await sendVerificationEmail(email, verificationCode, waitlist.name)

    if (!emailResult.success) {
      console.warn('Email send failed, code will be in response for dev mode')
      // In dev mode, return the code so the user can still test
      if (process.env.NODE_ENV === 'development') {
        return res.status(201).json({
          message: 'Email sending failed. Use the code below for testing.',
          signupId,
          devCode: verificationCode
        })
      }
      return res.status(500).json({ message: 'Failed to send verification email. Please try again.' })
    }

    // Do NOT return the code — user must check their email
    res.status(201).json({
      message: 'Verification code sent to your email',
      signupId
    })
  } catch (error) {
    console.error('joinWaitlist error:', error)
    res.status(500).json({ message: error.message })
  }
}

export const verifyCode = async (req, res) => {
  try {
    const { signupId, code } = req.body

    if (!signupId || !code) {
      return res.status(400).json({ message: 'Signup ID and code are required' })
    }

    // Try DB first
    let signup
    try {
      signup = await Signup.findById(signupId)
    } catch (dbError) {
      // Check in-memory fallback
      const pending = pendingCodes.get(signupId)
      if (pending) {
        if (new Date() > pending.expiresAt) {
          pendingCodes.delete(signupId)
          return res.status(400).json({ message: 'Verification code has expired. Please request a new one.' })
        }

        if (pending.code !== code.trim()) {
          return res.status(400).json({ message: 'Invalid verification code' })
        }

        // Mark as verified — add to fallback store
        const fallbackSignup = createSignupFallback({
          waitlistId: pending.waitlistId,
          name: pending.name,
          email: pending.email
        })
        pendingCodes.delete(signupId)

        return res.status(200).json({
          message: 'You have been added to the waitlist!',
          verified: true
        })
      }

      return res.status(404).json({ message: 'Signup not found' })
    }

    if (!signup) {
      return res.status(404).json({ message: 'Signup not found' })
    }

    if (signup.verified) {
      return res.status(400).json({ message: 'Already verified' })
    }

    if (new Date() > signup.codeExpiresAt) {
      return res.status(400).json({ message: 'Verification code has expired. Please request a new one.' })
    }

    if (signup.verificationCode !== code.trim()) {
      return res.status(400).json({ message: 'Invalid verification code' })
    }

    // Mark as verified and update waitlist count
    signup.verified = true
    await signup.save()

    try {
      const waitlist = await Waitlist.findById(signup.waitlistId)
      if (waitlist) {
        waitlist.totalSignups = (waitlist.totalSignups || 0) + 1
        await waitlist.save()
      }
    } catch (err) {
      console.warn('Could not update waitlist count:', err.message)
    }

    res.status(200).json({
      message: 'You have been added to the waitlist!',
      verified: true
    })
  } catch (error) {
    console.error('verifyCode error:', error)
    res.status(500).json({ message: error.message })
  }
}
