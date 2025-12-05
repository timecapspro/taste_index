#!/bin/sh
set -e

APP_DIR=/var/www/html
VENDOR_DIR="$APP_DIR/vendor"
CACHE_DIR=/opt/vendor-cache
DB_HOST=${DB_HOST:-db}
DB_PORT=${DB_PORT:-3306}
DB_DATABASE=${DB_DATABASE:-forge}
DB_USERNAME=${DB_USERNAME:-root}
DB_PASSWORD=${DB_PASSWORD:-}

# Laravel ожидает каталоги storage и bootstrap/cache даже на стадии composer install
# (composer запускает package:discover). Создаём их заранее и выставляем права,
# чтобы скрипты не падали на пустом bind mount. Явно задаём владельца и права,
# чтобы кэш можно было записывать независимо от того, как смонтирован volume.
mkdir -p \
  "$APP_DIR/storage/logs" \
  "$APP_DIR/storage/framework/cache" \
  "$APP_DIR/storage/framework/sessions" \
  "$APP_DIR/storage/framework/views" \
  "$APP_DIR/bootstrap/cache"
chown -R www-data:www-data "$APP_DIR/storage" "$APP_DIR/bootstrap"
chmod -R 775 "$APP_DIR/storage" "$APP_DIR/bootstrap"

# Public может отсутствовать в bind mount, создаём пустую папку, чтобы artisan serve не падал
mkdir -p "$APP_DIR/public"

# Seed vendor directory from cached copy baked into the image when available
if [ ! -d "$VENDOR_DIR" ] || [ -z "$(ls -A "$VENDOR_DIR" 2>/dev/null)" ]; then
  if [ -d "$CACHE_DIR" ] && [ -n "$(ls -A "$CACHE_DIR" 2>/dev/null)" ]; then
    echo "Восстанавливаем vendor из кэша образа..."
    mkdir -p "$VENDOR_DIR"
    cp -a "$CACHE_DIR"/. "$VENDOR_DIR"/
  fi
fi

# Запускаем composer install только если vendor пуст — так не ломаемся без сети,
# если зависимости уже были собраны на этапе сборки образа.
if [ ! -d "$VENDOR_DIR" ] || [ -z "$(ls -A "$VENDOR_DIR" 2>/dev/null)" ]; then
  if ! composer install --no-interaction --no-progress --prefer-dist; then
    echo "Composer недоступен (скорее всего, нет доступа в интернет). Используем уже имеющийся vendor, если он есть."
  fi
fi

if [ ! -d "$VENDOR_DIR" ] || [ -z "$(ls -A "$VENDOR_DIR" 2>/dev/null)" ]; then
  echo "Vendor по‑прежнему пустой. Без доступа к репозиторию зависимостей контейнер не сможет стартовать."
  exit 1
fi

# Обновляем автозагрузку, чтобы новые сидеры/фабрики подтянулись даже при старом vendor
composer dump-autoload --no-interaction --optimize || true

echo "Ожидаем доступности БД ${DB_HOST}:${DB_PORT}..."
for i in $(seq 1 30); do
  if php -r "try { new PDO('mysql:host=${DB_HOST};port=${DB_PORT};dbname=${DB_DATABASE}', '${DB_USERNAME}', '${DB_PASSWORD}'); } catch (Exception $e) { exit(1);} " >/dev/null 2>&1; then
    echo "БД доступна."
    break
  fi
  sleep 2
done


php artisan migrate --force || true
php artisan db:seed || true
php artisan serve --host=0.0.0.0 --port=8000
