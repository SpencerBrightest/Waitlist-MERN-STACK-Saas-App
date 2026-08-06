// server/controllers/waitlistController.js
import Waitlist from '../models/Waitlist.js'
import Signup from '../models/Signup.js'
import exportCSV from '../utils/exportCSV.js'
import {
  createSignupFallback,
  createWaitlistFallback,
  deleteWaitlistFallback,
  getWaitlistBySlugFallback,
  getWaitlistSignupsFallback,
  getWaitlistsFallback,
  exportCsvFallback
} from '../utils/fallbackStore.js'

// Generate slug
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '') +
    '-' + Math.random().toString(36).substr(2, 6)
}

// Create waitlist
export const createWaitlist = async (req, res) => {
  try {
    const { name, description, launchDate } = req.body

    if (!name) {
      return res.status(400).json({ message: 'Name is required' })
    }

    let waitlist

    try {
      waitlist = await Waitlist.create({
        userId: req.user._id,
        name,
        description,
        launchDate: launchDate || null,
        slug: generateSlug(name)
      })
    } catch (dbError) {
      waitlist = createWaitlistFallback({
        userId: req.user._id,
        name,
        description,
        launchDate
      })
    }

    res.status(201).json(waitlist)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get all waitlists for owner
export const getWaitlists = async (req, res) => {
  try {
    let waitlists

    try {
      waitlists = await Waitlist.find({ userId: req.user._id }).sort({ createdAt: -1 })
    } catch (dbError) {
      waitlists = getWaitlistsFallback(req.user._id)
    }

    res.json(waitlists)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get single waitlist by slug (public)
export const getWaitlistBySlug = async (req, res) => {
  try {
    let waitlist

    try {
      if (req.params.slug === 'default') {
        waitlist = await Waitlist.findOne({}).sort({ createdAt: -1 })
      } else {
        waitlist = await Waitlist.findOne({ slug: req.params.slug })
      }
    } catch (dbError) {
      waitlist = getWaitlistBySlugFallback(req.params.slug)
    }

    if (!waitlist) {
      return res.status(404).json({ message: 'Waitlist not found. Please create a waitlist first from the dashboard.' })
    }

    res.json(waitlist)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Delete waitlist
export const deleteWaitlist = async (req, res) => {
  try {
    let waitlist

    try {
      waitlist = await Waitlist.findById(req.params.id)
    } catch (dbError) {
      waitlist = deleteWaitlistFallback(req.params.id, req.user._id)
    }

    if (!waitlist) {
      return res.status(404).json({ message: 'Waitlist not found' })
    }

    if (waitlist.userId?.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' })
    }

    if (waitlist.deleteOne) {
      await waitlist.deleteOne()
      await Signup.deleteMany({ waitlistId: req.params.id })
    }

    res.json({ message: 'Waitlist deleted' })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get signups for a waitlist (owner)
export const getSignups = async (req, res) => {
  try {
    let waitlist

    try {
      waitlist = await Waitlist.findOne({ slug: req.params.slug })
    } catch (dbError) {
      waitlist = getWaitlistBySlugFallback(req.params.slug)
    }

    if (!waitlist) {
      return res.status(404).json({ message: 'Waitlist not found' })
    }

    if (waitlist.userId?.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' })
    }

    let signups
    try {
      signups = await Signup.find({ waitlistId: waitlist._id }).sort({ createdAt: 1 })
    } catch (dbError) {
      signups = getWaitlistSignupsFallback(waitlist._id)
    }

    res.json(signups)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Export signups as CSV
export const exportSignups = async (req, res) => {
  try {
    let waitlist

    try {
      waitlist = await Waitlist.findOne({ slug: req.params.slug })
    } catch (dbError) {
      waitlist = getWaitlistBySlugFallback(req.params.slug)
    }

    if (!waitlist) {
      return res.status(404).json({ message: 'Waitlist not found' })
    }

    if (waitlist.userId?.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' })
    }

    let signups
    try {
      signups = await Signup.find({ waitlistId: waitlist._id }).sort({ createdAt: 1 })
    } catch (dbError) {
      signups = getWaitlistSignupsFallback(waitlist._id)
    }

    const csv = exportCSV(signups) || exportCsvFallback(signups)

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition',
      `attachment; filename="${waitlist.slug}-signups.csv"`)
    res.send(csv)

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}