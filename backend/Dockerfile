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
RUN composer install --no-interaction --no-progress --prefer-dist || true

COPY . .
RUN composer install --no-interaction --no-progress --prefer-dist || true

RUN php -r "file_exists('.env') || copy('.env.example', '.env');" && \
    php -r "!file_exists('storage') && mkdir('storage');" && \
    php artisan key:generate --force || true

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]
