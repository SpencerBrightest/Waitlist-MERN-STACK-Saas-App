import Waitlist from '../models/Waitlist.js'
import Signup from '../models/Signup.js'
import { createSignupFallback, getWaitlistBySlugFallback } from '../utils/fallbackStore.js'

export const joinWaitlist = async (req, res) => {
  try {
    const { slug } = req.params
    const { name, email } = req.body

    if (!email) {
      return res.status(400).json({ message: 'Email is required' })
    }

    let waitlist
    try {
      waitlist = await Waitlist.findOne({ slug })
    } catch (dbError) {
      waitlist = getWaitlistBySlugFallback(slug)
    }

    if (!waitlist) {
      return res.status(404).json({ message: 'Waitlist not found' })
    }

    let signup
    try {
      signup = await Signup.create({
        waitlistId: waitlist._id,
        name: name || '',
        email
      })

      waitlist.totalSignups = (waitlist.totalSignups || 0) + 1
      await waitlist.save()
    } catch (dbError) {
      signup = createSignupFallback({
        waitlistId: waitlist._id,
        name,
        email
      })
    }

    res.status(201).json({
      message: 'Signup created successfully',
      signup
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
