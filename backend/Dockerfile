FROM php:8.2-fpm

WORKDIR /var/www/html

# 依存パッケージのインストール
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    zip \
    unzip \
    libzip-dev

# PHPの拡張機能をインストール
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip

# Composerのインストール
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# アプリケーションファイルをコピー
COPY . .

# Laravelインストール処理
RUN composer create-project --prefer-dist laravel/laravel=^11.0 /var/www/html-temp && \
    cp -r /var/www/html-temp/. /var/www/html/ && \
    rm -rf /var/www/html-temp

# パーミッションの設定
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache && \
    chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# 8000番ポートを公開
EXPOSE 8000

# サーバーの起動
CMD php artisan serve --host=0.0.0.0 --port=8000
