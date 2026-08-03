// server/routes/signupRoutes.js
import express from 'express'
import { joinWaitlist, verifyCode } from '../controllers/signupController.js'

const router = express.Router()

router.post('/:slug/join', joinWaitlist)
router.post('/verify', verifyCode)

export default router