// server/models/Waitlist.js
import mongoose from 'mongoose'

const waitlistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  slug: {
    type: String,
    unique: true
  },
  launchDate: {
    type: Date,
    default: null
  },
  totalSignups: {
    type: Number,
    default: 0
  }
}, { timestamps: true })

export default mongoose.model('Waitlist', waitlistSchema)