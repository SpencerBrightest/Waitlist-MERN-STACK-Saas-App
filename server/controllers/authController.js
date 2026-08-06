// server/controllers/authController.js
import User from '../models/User.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import {
  loginUserFallback,
  registerUserFallback
} from '../utils/fallbackStore.js'

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  })
}

// Register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields required' })
    }

    let user

    try {
      const userExists = await User.findOne({ email })
      if (userExists) {
        return res.status(400).json({ message: 'Email already registered' })
      }

      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)

      user = await User.create({
        name,
        email,
        password: hashedPassword
      })
    } catch (dbError) {
      const fallbackUser = registerUserFallback({ name, email, password })
      user = fallbackUser
    }

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: 'All fields required' })
    }

    let user

    try {
      user = await User.findOne({ email })
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' })
      }

      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' })
      }

      user.lastLoginAt = new Date()
      await user.save()
    } catch (dbError) {
      user = loginUserFallback({ email, password })
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}