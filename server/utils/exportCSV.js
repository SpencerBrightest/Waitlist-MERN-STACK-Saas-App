
const exportCSV = (signups) => {
  const header = 'Position,Name,Email,Joined At\n'

  const rows = signups.map((signup, index) => {
    const name = signup.name || 'Anonymous'
    const email = signup.email
    const date = new Date(signup.createdAt).toLocaleDateString()
    return `${index + 1},${name},${email},${date}`
  })

  return header + rows.join('\n')
}

export default exportCSV