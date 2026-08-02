import express from 'express'
import {
  adminLogin,
  deleteAdminWaitlist,
  getAdminOwners,
  getAdminStats,
  getAdminWaitlists
} from '../controllers/adminController.js'
import { adminProtect } from '../middleware/adminMiddleware.js'

const router = express.Router()

router.post('/login', adminLogin)
router.get('/stats', adminProtect, getAdminStats)
router.get('/owners', adminProtect, getAdminOwners)
router.get('/waitlists', adminProtect, getAdminWaitlists)
router.delete('/waitlist/:id', adminProtect, deleteAdminWaitlist)

export default router
