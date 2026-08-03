// server/config/db.js
import mongoose from 'mongoose'

// Disable command buffering — operations fail immediately if not connected
// instead of hanging for 10s with "buffering timed out"
mongoose.set('bufferCommands', false)

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI

  if (!mongoUri) {
    console.log('No MongoDB URI provided, skipping MongoDB connection for now.')
    return
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000
    })
    console.log(`MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`)
    console.log('Server will continue without database — using in-memory fallback.')
  }
}

export default connectDB