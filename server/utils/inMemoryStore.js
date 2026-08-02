const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

export const memoryStore = {
  users: [],
  waitlists: [],
  signups: []
}

export const createMemoryId = () => createId()
