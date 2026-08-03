import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import Waitlist from '../models/Waitlist.js'
import Signup from '../models/Signup.js'
import {
  getAdminOwnersFallback,
  getAdminStatsFallback,
  getAdminWaitlistsFallback,
  deleteAdminWaitlistFallback
} from '../utils/fallbackStore.js'

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body
    const expectedEmail = (process.env.ADMIN_EMAIL || 'admin@waitlist.com').trim().toLowerCase()
    const expectedPassword = process.env.ADMIN_PASSWORD || 'admin123'

    const inputEmail = (email || '').trim().toLowerCase()
    const inputPassword = password || ''

    if (inputEmail !== expectedEmail || inputPassword !== expectedPassword) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign({ role: 'admin', email: inputEmail }, process.env.ADMIN_JWT_SECRET || 'admin-secret', {
      expiresIn: '8h'
    })

    res.json({
      message: 'Admin logged in',
      admin: { email, role: 'admin' },
      token
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getAdminStats = async (req, res) => {
  try {
    let stats

    try {
      const owners = await User.countDocuments()
      const waitlists = await Waitlist.countDocuments()
      const signups = await Signup.countDocuments()
      stats = { owners, waitlists, signups, today: 0 }
    } catch (dbError) {
      stats = getAdminStatsFallback()
    }

    res.json({ stats })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getAdminOwners = async (req, res) => {
  try {
    let owners

    try {
      owners = await User.find({}, '-password').sort({ createdAt: -1 })
    } catch (dbError) {
      owners = getAdminOwnersFallback()
    }

    res.json({ owners })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const getAdminWaitlists = async (req, res) => {
  try {
    let waitlists

    try {
      waitlists = await Waitlist.find({}).populate('userId', 'name email').sort({ createdAt: -1 })
    } catch (dbError) {
      waitlists = getAdminWaitlistsFallback()
    }

    res.json({ waitlists })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export const deleteAdminWaitlist = async (req, res) => {
  try {
    let waitlist

    try {
      waitlist = await Waitlist.findById(req.params.id)
    } catch (dbError) {
      waitlist = deleteAdminWaitlistFallback(req.params.id)
    }

    if (!waitlist) {
      return res.status(404).json({ message: 'Waitlist not found' })
    }

    if (waitlist.deleteOne) {
      await Signup.deleteMany({ waitlistId: waitlist._id })
      await waitlist.deleteOne()
    }

    res.json({ message: 'Waitlist deleted' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
