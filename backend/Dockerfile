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
RUN composer install --no-interaction --no-progress --prefer-dist

# Сохраняем собранный vendor в отдельное место, чтобы можно было заполнить
# именованный volume даже при отсутствии интернета на рантайме
RUN mkdir -p /opt/vendor-cache && \
    if [ -d vendor ] && [ -n "$(ls -A vendor 2>/dev/null)" ]; then cp -a vendor/. /opt/vendor-cache/; fi

COPY . .
RUN composer install --no-interaction --no-progress --prefer-dist

COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

RUN php -r "file_exists('.env') || copy('.env.example', '.env');" && \
    php -r "!file_exists('storage') && mkdir('storage');" && \
    php artisan key:generate --force || true

CMD ["/usr/local/bin/entrypoint.sh"]
