import { test, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { fetchUser, validateUser } from '../src/services/users.js'
const originalFetch = globalThis.fetch
const user = { id: 1, name: 'Test User', email: 'test@example.com' }
afterEach(() => { globalThis.fetch = originalFetch })
test('valid user is returned unchanged', () => assert.equal(validateUser(user), user))
for (const value of [null, {}, { ...user, email: '' }, { ...user, name: '  ' }, { ...user, id: '1' }])
  test(`invalid payload ${JSON.stringify(value)}`, () => assert.throws(() => validateUser(value), /некорректные/))
test('HTTP success, URL and signal', async () => {
  const signal = new AbortController().signal
  globalThis.fetch = async (url, options) => { assert.equal(url, 'https://jsonplaceholder.typicode.com/users/2'); assert.equal(options.signal, signal); return { ok: true, json: async () => user } }
  assert.deepEqual(await fetchUser(2, { signal }), user)
})
test('HTTP error rejects', async () => { globalThis.fetch = async () => ({ ok: false, status: 404 }); await assert.rejects(fetchUser(1), /404/) })
test('network error rejects', async () => { globalThis.fetch = async () => { throw new Error('offline') }; await assert.rejects(fetchUser(1), /offline/) })
test('invalid JSON rejects', async () => { globalThis.fetch = async () => ({ ok: true, json: async () => { throw new SyntaxError('JSON') } }); await assert.rejects(fetchUser(1), /JSON/) })
test('local path is relative', async () => { globalThis.fetch = async url => { assert.equal(url, './data/users/1.json'); return { ok: true, json: async () => user } }; await fetchUser(1, { source: 'local' }) })
for (const id of [0, 11, 1.2, '1'])
  test(`invalid id ${id}`, async () => assert.rejects(fetchUser(id), /от 1 до 10/))
