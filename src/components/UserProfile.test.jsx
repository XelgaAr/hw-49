import { act, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import UserProfile from './UserProfile.jsx'
import { fetchUser } from '../services/users.js'
vi.mock('../services/users.js', () => ({ fetchUser: vi.fn() }))
const user = { id: 1, name: 'Alex Morgan', email: 'alex@example.com' }
beforeEach(() => vi.mocked(fetchUser).mockReset())
afterEach(() => vi.useRealTimers())
describe('UserProfile', () => {
  it('shows loading while the request is pending', () => {
    vi.mocked(fetchUser).mockReturnValue(new Promise(() => {}))
    render(<UserProfile />)
    expect(screen.getByRole('status')).toHaveTextContent('Загрузка профиля')
    expect(fetchUser).toHaveBeenCalledWith(1, expect.objectContaining({ source: 'remote', signal: expect.any(AbortSignal) }))
  })
  it('renders a successful response and removes loading', async () => {
    vi.mocked(fetchUser).mockResolvedValue(user)
    render(<UserProfile />)
    expect(await screen.findByRole('heading', { name: user.name })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: user.email })).toHaveAttribute('href', `mailto:${user.email}`)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })
  it('shows a rejected request without stale data', async () => {
    vi.mocked(fetchUser).mockRejectedValue(new Error('Network unavailable'))
    render(<UserProfile />)
    expect(await screen.findByRole('alert')).toHaveTextContent('Network unavailable')
    expect(screen.queryByRole('heading', { name: user.name })).not.toBeInTheDocument()
  })
  it('retries a failed request', async () => {
    vi.mocked(fetchUser).mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce(user)
    render(<UserProfile />)
    fireEvent.click(await screen.findByRole('button', { name: 'Повторить запрос' }))
    expect(await screen.findByRole('heading', { name: user.name })).toBeInTheDocument()
    expect(fetchUser).toHaveBeenCalledTimes(2)
  })
  it('refreshes an existing profile', async () => {
    vi.mocked(fetchUser).mockResolvedValue(user)
    render(<UserProfile />)
    fireEvent.click(await screen.findByRole('button', { name: 'Обновить' }))
    await screen.findByRole('heading', { name: user.name })
    expect(fetchUser).toHaveBeenCalledTimes(2)
  })
  it('aborts the request on unmount', () => {
    vi.mocked(fetchUser).mockReturnValue(new Promise(() => {}))
    const { unmount } = render(<UserProfile />)
    const signal = fetchUser.mock.calls[0][1].signal
    unmount()
    expect(signal.aborted).toBe(true)
  })
  it('ignores an older response after a profile change', async () => {
    let resolveOld
    vi.mocked(fetchUser).mockReturnValueOnce(new Promise(resolve => { resolveOld = resolve })).mockResolvedValueOnce({ ...user, id: 2, name: 'New profile' })
    const { rerender } = render(<UserProfile userId={1} />)
    rerender(<UserProfile userId={2} />)
    await screen.findByRole('heading', { name: 'New profile' })
    await act(async () => resolveOld(user))
    expect(screen.queryByRole('heading', { name: user.name })).not.toBeInTheDocument()
  })
  it('handles a timeout', async () => {
    vi.useFakeTimers()
    vi.mocked(fetchUser).mockImplementation((_id, { signal }) => new Promise((_resolve, reject) => signal.addEventListener('abort', () => reject(new Error('aborted')), { once: true })))
    render(<UserProfile />)
    await act(async () => { await vi.advanceTimersByTimeAsync(10000) })
    expect(screen.getByRole('alert')).toHaveTextContent('10 секунд')
  })
  it('passes the local source to the service', async () => {
    vi.mocked(fetchUser).mockResolvedValue(user)
    render(<UserProfile source="local" userId={2} />)
    await screen.findByRole('heading', { name: user.name })
    expect(fetchUser).toHaveBeenCalledWith(2, expect.objectContaining({ source: 'local' }))
  })
})
