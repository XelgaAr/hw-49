import { describe, expect, it, vi } from 'vitest'
import { fetchUser, validateUser } from './users.js'
const user = { id: 1, name: 'Test User', email: 'test@example.com' }
describe('users API', () => {
  it('makes a GET request and validates the response', async () => {
    const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => user })
    vi.stubGlobal('fetch', fetch)
    await expect(fetchUser(1)).resolves.toEqual(user)
    expect(fetch).toHaveBeenCalledWith('https://jsonplaceholder.typicode.com/users/1', { signal: undefined })
  })
  it('rejects HTTP errors', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 503 }))
    await expect(fetchUser(1)).rejects.toThrow('HTTP 503')
  })
  it('rejects malformed JSON', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => { throw new SyntaxError('Invalid JSON') } }))
    await expect(fetchUser(1)).rejects.toThrow('Invalid JSON')
  })
  it.each([null, {}, { ...user, email: null }, { ...user, name: '' }])('rejects an invalid payload', value => expect(() => validateUser(value)).toThrow('некорректные'))
  it.each([0, 11, -1, 1.5, '1'])('rejects invalid user id %s', async id => { await expect(fetchUser(id)).rejects.toThrow('от 1 до 10') })
})
