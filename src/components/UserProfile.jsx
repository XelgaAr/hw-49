import { useEffect, useState } from 'react'
import { fetchUser } from '../services/users.js'
const UserProfile = ({ userId = 1, source = 'remote' }) => {
  const [attempt, setAttempt] = useState(0)
  const [state, setState] = useState({ status: 'loading', user: null, error: null })
  useEffect(() => {
    const controller = new AbortController()
    let active = true
    const timeout = setTimeout(() => controller.abort('timeout'), 10000)
    setState({ status: 'loading', user: null, error: null })
    fetchUser(userId, { source, signal: controller.signal })
      .then(user => { if (active) setState({ status: 'success', user, error: null }) })
      .catch(error => {
        if (active) setState({ status: 'error', user: null, error: controller.signal.reason === 'timeout' ? 'Сервер не ответил за 10 секунд. Повторите запрос.' : error.message || 'Ошибка сети. Проверьте подключение.' })
      })
      .finally(() => clearTimeout(timeout))
    return () => { active = false; clearTimeout(timeout); controller.abort() }
  }, [userId, source, attempt])
  if (state.status === 'loading')
    return <section className="panel profile loading" aria-label="Профиль пользователя"><div role="status" className="row"><span className="spinner" aria-hidden="true" />Загрузка профиля…</div><div className="skeleton avatar" /><div className="skeleton" /><div className="skeleton short" /><p className="muted">Получаем данные пользователя №{userId}</p></section>
  if (state.status === 'error')
    return <section className="panel profile" aria-label="Профиль пользователя"><div className="error" role="alert"><h2>Профиль не загружен</h2><p>{state.error}</p></div><p className="muted">Можно повторить запрос или выбрать локальный JSON в списке источников.</p><button className="primary" onClick={() => setAttempt(value => value + 1)}>Повторить запрос</button></section>
  const { user } = state
  return <section className="panel profile" aria-label="Профиль пользователя">
    <div className="row between"><span className="badge">Данные получены</span><small>ID {user.id.toString().padStart(2, '0')}</small></div>
    <div className="profile-title"><div className="avatar" aria-hidden="true">{user.name.split(/\s+/).slice(0, 2).map(word => word[0]).join('')}</div><div><h2>{user.name}</h2><p className="muted">@{user.username || 'user'}</p></div></div>
    <dl className="profile-details"><div><dt>Электронная почта</dt><dd><a href={`mailto:${user.email}`}>{user.email}</a></dd></div><div><dt>Телефон</dt><dd>{user.phone || 'Не указан'}</dd></div><div><dt>Компания</dt><dd>{user.company?.name || 'Не указана'}</dd></div><div><dt>Город</dt><dd>{user.address?.city || 'Не указан'}</dd></div><div><dt>Сайт</dt><dd>{user.website || 'Не указан'}</dd></div></dl>
    <div className="row between"><small>{source === 'local' ? 'Локальный JSON · HTTP GET' : 'JSONPlaceholder · HTTP GET'}</small><button onClick={() => setAttempt(value => value + 1)}>Обновить</button></div>
    <details className="raw-data"><summary>Ответ API</summary><pre>{JSON.stringify(user, null, 2)}</pre></details>
  </section>
}
export default UserProfile
