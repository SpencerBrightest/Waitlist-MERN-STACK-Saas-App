// server/config/db.js
import mongoose from 'mongoose'

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI || process.env.MONGODB_URI?.replace('mongodb://', 'mongodb://')

  if (!mongoUri) {
    console.log('No MongoDB URI provided, skipping MongoDB connection for now.')
    return
  }

  try {
    const conn = await mongoose.connect(mongoUri)
    console.log(`MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`Error: ${error.message}`)
  }
}

export default connectDB