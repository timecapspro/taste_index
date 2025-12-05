# Taste Index Monorepo

Проект MVP "ИндексВкуса" сочетает Next.js (frontend) и Laravel API (backend) с MySQL, Swagger и phpMyAdmin в Docker Compose.

## Быстрый старт

```bash
docker compose up --build
```

Доступы после запуска:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8082
- Swagger UI: http://localhost:8082/api/documentation
- phpMyAdmin (через basic-auth): http://localhost:8081
- Быстрая проверка API: `./scripts/smoke.sh` (использует demo/unverified учётки)

### .env

Скопируйте файлы из примеров:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

В корне укажите `MYSQL_*` и креды для basic-auth (`PMA_BASIC_USER`, `PMA_BASIC_PASS`).

### Демо доступ

```
login: demo
email: demo@example.com
password: demo12345
```

### Полезные команды

- Запуск миграций: `docker compose exec api php artisan migrate`
- Сиды демо-данных: `docker compose exec api php artisan db:seed`
- Проверка API: `curl http://localhost:8082/api/ping`
- Smoke-тест авторизации: `./scripts/smoke.sh`

### Установка зависимостей в контейнерах

- Backend (Laravel): зависимости собираются на этапе сборки образа и сохраняются в кэше. При старте
  composer запускается только если volume `api_vendor` пустой; без сети контейнер восстановит `vendor`
  из слоя образа и пропустит composer. Ручной перезапуск: `docker compose exec api composer install`
- Frontend (Next.js): `docker compose exec frontend npm install`

## Структура

- `frontend/` — Next.js (App Router, Tailwind, next-themes)
- `backend/` — Laravel + Sanctum + Swagger (скелет для дальнейшей доработки)
- `docker-compose.yml` — сервисы db/api/frontend/phpmyadmin/pma_proxy
- `ui.jsx` — эталон прототипа интерфейса

## Примечания

- В репозитории находится минимальный каркас Laravel/Next: зависимости бэкенда ставятся автоматически при `docker compose up`,
  для фронтенда достаточно `npm install` внутри контейнеров или локально.
- phpMyAdmin защищён обратным прокси `pma_proxy` с basic-auth; пароли формируются из переменных окружения.
- CORS разрешает фронтенд `http://localhost:3000`.
