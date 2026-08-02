// server/routes/signupRoutes.js
import express from 'express'
import { joinWaitlist } from '../controllers/signupController.js'

const router = express.Router()

router.post('/:slug/join', joinWaitlist)

export default router