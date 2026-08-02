// server/middleware/adminMiddleware.js
import jwt from 'jsonwebtoken'

export const adminProtect = (req, res, next) => {
  try {
    const token = req.headers['x-admin-token']

    if (!token) {
      return res.status(401).json({ message: 'Not authorized as admin' })
    }

    const decoded = jwt.verify(token, process.env.ADMIN_JWT_SECRET)

    if (decoded.role !== 'admin') {
      return res.status(401).json({ message: 'Not authorized as admin' })
    }

    req.admin = decoded
    next()
  } catch (error) {
    res.status(401).json({ message: 'Not authorized as admin' })
  }
}