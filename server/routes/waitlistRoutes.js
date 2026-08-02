// server/routes/waitlistRoutes.js
import express from 'express'
import {
  createWaitlist,
  getWaitlists,
  getWaitlistBySlug,
  deleteWaitlist,
  getSignups,
  exportSignups
} from '../controllers/waitlistController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

// Protected
router.post('/', protect, createWaitlist)
router.get('/', protect, getWaitlists)
router.delete('/:id', protect, deleteWaitlist)
router.get('/:slug/signups', protect, getSignups)
router.get('/:slug/export', protect, exportSignups)

// Public
router.get('/:slug', getWaitlistBySlug)

export default router