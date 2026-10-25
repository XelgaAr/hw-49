# Сопоставление с HW49

Источник: hw-49-r12.pdf и приложенная лекция #12. Номера страниц относятся к заданию, а не лекции.

| Требование | Реализация |
|---|---|
| PDF, стр. 1–2: Vite и UserProfile | package.json, src/components/UserProfile.jsx |
| PDF, стр. 2: загрузка, имя/email, ошибка | состояния loading/success/error и HTTP-сервис |
| PDF, стр. 2–3: изолированные тесты API | UserProfile.test.jsx и users.test.js, vi.mock/vi.stubGlobal |
| PDF, стр. 3–4: запуск тестов, результат/скриншот, README | test:report создаёт реальный отчёт после установки пакетов; README и workflow |

Публикация на GitHub Pages выбрана по отдельному требованию; Vercel/Netlify в PDF приведены как варианты. Репозиторий создаётся владельцем, фактическая ссылка на демо добавляется после deploy. Проверки, требующие недоступных пакетов, перечислены отдельно в VERIFICATION.md.
