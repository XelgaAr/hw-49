export const validateUser = user => {
  if (!user || !Number.isInteger(user.id) || typeof user.name !== 'string' || !user.name.trim() || typeof user.email !== 'string' || !user.email.includes('@') || ['username', 'phone', 'website'].some(key => user[key] != null && typeof user[key] !== 'string') || user.company?.name != null && typeof user.company.name !== 'string' || user.address?.city != null && typeof user.address.city !== 'string')
    throw new Error('API вернул некорректные данные профиля.')
  return user
}
export const fetchUser = async (id, { source = 'remote', signal } = {}) => {
  if (!Number.isInteger(id) || id < 1 || id > 10)
    throw new Error('Выберите пользователя с номером от 1 до 10.')
  const url = source === 'local'
    ? `${import.meta.env?.BASE_URL ?? './'}data/users/${id}.json`
    : `https://jsonplaceholder.typicode.com/users/${id}`
  const response = await fetch(url, { signal })
  if (!response.ok)
    throw new Error(`Не удалось загрузить профиль (HTTP ${response.status}).`)
  return validateUser(await response.json())
}
