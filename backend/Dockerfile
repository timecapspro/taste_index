FROM php:8.2-cli

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    libjpeg62-turbo-dev \
    libfreetype6-dev \
    zip \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY composer.json composer.lock* ./
# На билде не всегда есть интернет, поэтому composer install делаем best-effort,
# но не валим сборку. Vendor кэшируем только если он реально собрался.
RUN composer install --no-interaction --no-progress --prefer-dist || echo "composer install пропущен на сборке"

# Сохраняем собранный vendor в отдельное место, чтобы можно было заполнить
# именованный volume даже при отсутствии интернета на рантайме
RUN mkdir -p /opt/vendor-cache && \
    if [ -d vendor ] && [ -n "$(ls -A vendor 2>/dev/null)" ]; then cp -a vendor/. /opt/vendor-cache/; fi

COPY . .
# Повторяем установку после копирования всего кода, но тоже без падения сборки.
RUN composer install --no-interaction --no-progress --prefer-dist || echo "composer install пропущен после копирования исходников"

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

RUN php -r "file_exists('.env') || copy('.env.example', '.env');" && \
    php -r "!file_exists('storage') && mkdir('storage');" && \
    php -r "!file_exists('storage/logs') && mkdir('storage/logs');" && \
    php -r "!file_exists('bootstrap/cache') && mkdir('bootstrap/cache');" && \
    chmod -R 775 storage bootstrap && \
    php artisan key:generate --force || true

CMD ["/usr/local/bin/entrypoint.sh"]
