#!/bin/sh
set -e

APP_DIR=/var/www/html
VENDOR_DIR="$APP_DIR/vendor"
CACHE_DIR=/opt/vendor-cache

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

# Laravel ожидает каталоги storage и bootstrap/cache. Создаём и выставляем права, чтобы
# artisan-команды не падали при пустых volume.
mkdir -p "$APP_DIR/storage/logs" "$APP_DIR/bootstrap/cache"
chmod -R 775 "$APP_DIR/storage" "$APP_DIR/bootstrap"

php artisan migrate --force || true
php artisan db:seed || true
php artisan serve --host=0.0.0.0 --port=8000
