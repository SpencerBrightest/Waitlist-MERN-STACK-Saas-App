const state = {
  users: [],
  waitlists: [],
  signups: []
}

const makeId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const normalizeWaitlist = (waitlist) => ({
  ...waitlist,
  signupCount: waitlist.signups?.length || waitlist.totalSignups || 0
})

export const getFallbackState = () => state

export const registerUserFallback = ({ name, email, password }) => {
  const existing = state.users.find((user) => user.email === email)
  if (existing) {
    throw new Error('Email already registered')
  }

  const user = {
    _id: makeId(),
    name,
    email,
    password,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  state.users.push(user)
  return user
}

export const loginUserFallback = ({ email, password }) => {
  const user = state.users.find((item) => item.email === email)

  if (!user || user.password !== password) {
    throw new Error('Invalid email or password')
  }

  user.lastLoginAt = new Date().toISOString()
  return user
}

export const createWaitlistFallback = ({ userId, name, description, launchDate }) => {
  const slug = `${name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}-${Math.random().toString(36).slice(2, 6)}`
  const waitlist = {
    _id: makeId(),
    userId,
    name,
    description: description || '',
    slug,
    launchDate: launchDate || null,
    totalSignups: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    signups: []
  }

  state.waitlists.unshift(waitlist)
  return waitlist
}

export const getWaitlistsFallback = (userId) => {
  return state.waitlists.filter((waitlist) => waitlist.userId === userId).map(normalizeWaitlist)
}

export const getWaitlistBySlugFallback = (slug) => {
  return state.waitlists.find((waitlist) => waitlist.slug === slug) || null
}

export const deleteWaitlistFallback = (id, userId) => {
  const index = state.waitlists.findIndex((waitlist) => waitlist._id === id && waitlist.userId === userId)
  if (index === -1) return null

  const removed = state.waitlists[index]
  state.waitlists.splice(index, 1)
  state.signups = state.signups.filter((signup) => signup.waitlistId !== id)
  return removed
}

export const createSignupFallback = ({ waitlistId, name, email }) => {
  const waitlist = state.waitlists.find((item) => item._id === waitlistId)
  if (!waitlist) throw new Error('Waitlist not found')

  const signup = {
    _id: makeId(),
    waitlistId,
    name: name || '',
    email,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  state.signups.push(signup)
  waitlist.signups = [...(waitlist.signups || []), signup]
  waitlist.totalSignups = (waitlist.totalSignups || 0) + 1
  return signup
}

export const getWaitlistSignupsFallback = (waitlistId) => {
  return state.signups.filter((signup) => signup.waitlistId === waitlistId).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
}

export const getAdminStatsFallback = () => ({
  owners: state.users.length,
  waitlists: state.waitlists.length,
  signups: state.signups.length,
  today: 0
})

export const getAdminOwnersFallback = () => state.users.map((user) => ({ ...user }))

export const getAdminWaitlistsFallback = () => {
  return state.waitlists.map((waitlist) => ({
    ...waitlist,
    owner: state.users.find((user) => user._id === waitlist.userId) || null,
    signups: waitlist.signups || []
  }))
}

export const deleteAdminWaitlistFallback = (id) => {
  const index = state.waitlists.findIndex((waitlist) => waitlist._id === id)
  if (index === -1) return null

  const removed = state.waitlists[index]
  state.waitlists.splice(index, 1)
  state.signups = state.signups.filter((signup) => signup.waitlistId !== id)
  return removed
}

export const exportCsvFallback = (signups) => {
  const header = 'Position,Name,Email,Joined At\n'
  const rows = signups.map((signup, index) => {
    const name = signup.name || 'Anonymous'
    const email = signup.email
    const date = new Date(signup.createdAt).toLocaleDateString()
    return `${index + 1},${name},${email},${date}`
  })

  return header + rows.join('\n')
}
