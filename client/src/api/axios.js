import axios from 'axios'

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

instance.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem('user')
  const storedAdmin = localStorage.getItem('admin')

  if (storedUser) {
    try {
      const parsedUser = JSON.parse(storedUser)
      if (parsedUser?.token) {
        config.headers.Authorization = `Bearer ${parsedUser.token}`
      }
    } catch (error) {
      console.error('Unable to parse user token', error)
    }
  }

  if (storedAdmin) {
    try {
      const parsedAdmin = JSON.parse(storedAdmin)
      if (parsedAdmin?.token) {
        config.headers['x-admin-token'] = parsedAdmin.token
      }
    } catch (error) {
      console.error('Unable to parse admin token', error)
    }
  }

  return config
})

export default instance
