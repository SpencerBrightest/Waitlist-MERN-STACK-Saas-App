import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import waitlistRoutes from './routes/waitlistRoutes.js'
import signupRoutes from './routes/signupRoutes.js'
import adminRoutes from './routes/adminRoutes.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'
import dns from 'node:dns/promises';
dns.setServers(['8.8.8.8', '1.1.1.1']);

dotenv.config()
connectDB()

const app = express()

app.use(cors())
app.use(express.json())

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/waitlists', waitlistRoutes)
app.use('/api/signups', signupRoutes)
app.use('/api/admin', adminRoutes)

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Waitlist API running' })
})

// Error handling
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))