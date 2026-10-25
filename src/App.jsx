import { useState } from 'react'
import UserProfile from './components/UserProfile.jsx'
const App = () => {
  const [userId, setUserId] = useState(1)
  const [source, setSource] = useState('remote')
  return <>
    <a className="skip-link" href="#main">Перейти к содержимому</a>
    <header className="app-header"><div className="header-inner"><span className="brand"><span className="brand-mark">P</span>Profile Lab</span><span className="tag">REACT / ASYNC / TESTS</span></div></header>
    <main id="main"><div className="intro"><div className="eyebrow">49 · Асинхронная логика</div><h1>За каждым запросом<br />есть состояние.</h1><p>Профиль пользователя из API. Загрузка, успешный ответ и ошибка — с отдельной обработкой каждого сценария.</p></div>
      <div className="toolbar panel"><label>Источник данных<select value={source} onChange={event => { setSource(event.target.value); setUserId(1) }}><option value="remote">JSONPlaceholder — внешний API</option><option value="local">Локальный JSON — без внешнего API</option></select></label><label>Пользователь<select value={userId} onChange={event => setUserId(Number(event.target.value))}>{Array.from({ length: source === 'local' ? 3 : 10 }, (_, i) => <option key={i + 1} value={i + 1}>Пользователь {i + 1}</option>)}</select></label></div>
      <div className="profile-layout"><UserProfile key={`${source}-${userId}`} userId={userId} source={source} /><aside className="stack"><section className="panel"><div className="eyebrow">Жизненный цикл</div>{[['01', 'Загрузка', 'Запрос выполняется; показан индикатор.'], ['02', 'Успех', 'Ответ проверен, профиль готов к просмотру.'], ['03', 'Ошибка', 'Понятное сообщение и повторный запрос.']].map(([id, title, text]) => <div className="state-step" key={id}><span>{id}</span><div><h3>{title}</h3><p className="muted">{text}</p></div></div>)}</section><section className="notice">Запросы отменяются при смене профиля. Устаревший ответ не заменит актуальные данные. Для независимых от сети проверок API замокирован в тестах.</section></aside></div>
    </main><footer>Profile Lab · React Testing Library + Vitest · Данные примеров не являются реальными контактами.</footer>
  </>
}
export default App
