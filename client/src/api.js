async function request(url, options) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (res.status === 204) return null

  const body = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(body.errors?.join(' ') || 'Something went wrong.')
  return body
}

export const api = {
  meta: () => request('/api/meta'),

  announcements: (filters) => {
    const params = new URLSearchParams()
    for (const [key, value] of Object.entries(filters)) {
      if (value) params.set(key, value)
    }
    return request(`/api/announcements?${params}`)
  },

  create: (fields) =>
    request('/api/announcements', { method: 'POST', body: JSON.stringify(fields) }),

  join: (id, name) =>
    request(`/api/announcements/${id}/join`, { method: 'POST', body: JSON.stringify({ name }) }),

  leave: (id, name) =>
    request(`/api/announcements/${id}/leave`, { method: 'POST', body: JSON.stringify({ name }) }),

  remove: (id) => request(`/api/announcements/${id}`, { method: 'DELETE' }),

  reset: () => request('/api/reset', { method: 'POST' }),
}
