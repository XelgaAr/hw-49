# HW49 · Profile Lab

Асинхронный профиль пользователя: Vite, React, Vitest и React Testing Library.

## Возможности

UserProfile выполняет HTTP GET, показывает загрузку, имя, email и дополнительные сведения либо понятную ошибку. Доступны повтор запроса и обновление профиля. При смене пользователя и размонтировании запрос отменяется, устаревший ответ не обновляет UI. Таймаут — 10 секунд. Ответ проверяется перед отображением.

Основной источник — JSONPlaceholder (пользователи 1–10). Источник «Локальный JSON» загружает через fetch один из трёх включённых примеров: он позволяет проверить интерфейс без стороннего API. Внешний запрос не подменяется скрыто: источник выбирается явно.

## Тесты по заданию

В src/components/UserProfile.test.jsx проверяются загрузка, успешный ответ, ошибка, повтор, обновление, отмена, устаревший ответ, таймаут и выбор источника. Сервис мокируется через vi.mock, реальные запросы в компонентных тестах отсутствуют. В src/services/users.test.js отдельно проверяются fetch, HTTP-ошибки, JSON и валидация. После установки зависимостей команда npm run test:report создаёт требуемый скриншот реального запуска Vitest; готовый успешный скриншот без этого запуска не предоставляется.

## Структура

src/components — UserProfile и его тесты; src/services — API и проверка ответа; public/data/users — локальные JSON; tests — нативные проверки; e2e — сценарий браузера. У компонентов и HTTP-логики отдельные файлы.

## Запуск

Нужны Node.js 24 и npm. Откройте эту папку в VS Code (File → Open Folder) или выполните code . из её корня.

```bash
npm install
npm run dev -- --open
```

По умолчанию: http://127.0.0.1:5173/. Для параллельного запуска разных работ задайте разные порты, например npm run dev -- --port 5174 --open. Остановка — Ctrl+C. Live Server и открытие исходного index.html двойным щелчком не заменяют Vite.

```bash
npm run test:logic
npm test
npm run lint
npm run build
npm run preview -- --open
```

Production preview: http://127.0.0.1:4173/. Команда npm run check объединяет ESLint, Vitest и production-сборку. Дополнительные нативные тесты запускаются отдельно командой test:logic.

## Браузерные проверки и отчёт

```bash
npx playwright install chromium
npm run test:e2e
npm run test:report
```

Playwright сам собирает приложение с base=/repository-check/ и поднимает preview-сервер. Сценарии предусмотрены для настольного и мобильного размеров. Перед запуском освободите порт 4173. Отчёт Playwright: playwright-report/index.html.

Команда test:report **заново запускает настоящий Vitest** и сохраняет reports/vitest.json, reports/test-output.txt, reports/test-report.html и скриншот reports/tests.png. Старый JSON удаляется перед запуском; неуспешный запуск не выдаётся за успешный. В CI эти файлы доступны в артефакте test-evidence и после публикации — в /reports/ сайта.

## Публикация

Демо после создания репозитория: https://USERNAME.github.io/REPOSITORY/ (замените после успешного deploy).

Workflow готов в .github/workflows/pages.yml. Включите Settings → Pages → Source → GitHub Actions. Подробности: [docs/PUBLISHING.md](docs/PUBLISHING.md).

## Статус проверки

Результаты фактически выполненных проверок и ограничения среды приведены в [docs/VERIFICATION.md](docs/VERIFICATION.md). Подготовленные, но не запущенные здесь проверки не отмечены как пройденные.
