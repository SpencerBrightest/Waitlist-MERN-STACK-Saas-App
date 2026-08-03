// server/config/db.js
import mongoose from 'mongoose'


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