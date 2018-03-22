FROM php:7.1-fpm

RUN apt-get update && apt-get install -my gnupg
# Get the repository set up for postgresql
RUN { \
	echo 'deb http://apt.postgresql.org/pub/repos/apt/ jessie-pgdg main'; \
	} > /etc/apt/sources.list.d/pgdg.list
RUN curl https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -

RUN apt-get update && apt-get upgrade -y && apt-get -f install -y --no-install-recommends \
	libfreetype6-dev \
	libjpeg62-turbo-dev \
	libmcrypt-dev \
	libpng-dev \
	libpq-dev \
	libmemcached11 \
	libmemcachedutil2 \
	build-essential \
	libmemcached-dev \
	libz-dev \
	postgresql-client-9.6 \
	git-core \
	msmtp \
	vim \
	&& docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/ \
	&& docker-php-ext-install -j$(nproc) gd mbstring opcache pdo pdo_mysql pdo_pgsql zip 

RUN pecl install xdebug memcached \
	&& docker-php-ext-enable xdebug
RUN { \
	echo 'xdebug.remote_enable=on'; \
	echo 'xdebug.remote_autostart=on'; \
} > /usr/local/etc/php/conf.d/xdebug.ini 
RUN { \
	echo 'extension=memcached.so'; \
	echo 'memcache.hash_strategy=consistent'; \
	} > /usr/local/etc/php/conf.d/memcached.ini 

# set recommended PHP.ini settings
# see https://secure.php.net/manual/en/opcache.installation.php
RUN { \
	echo 'opcache.memory_consumption=128'; \
	echo 'opcache.interned_strings_buffer=8'; \
	echo 'opcache.max_accelerated_files=4000'; \
	echo 'opcache.revalidate_freq=60'; \
	echo 'opcache.fast_shutdown=1'; \
	echo 'opcache.enable_cli=1'; \
	} > /usr/local/etc/php/conf.d/opcache-recommended.ini


# install drush and drupal console symlink so it can be accessed from anywhere in the container
RUN ln -s /var/www/html/vendor/drush/drush/drush /usr/local/bin/drush
RUN ln -s /var/www/html/vendor/drupal/console/bin/drupal /usr/local/bin/drupal

# when you run bash, this is where you'll start, and where drush will be able to run from.
WORKDIR /var/www/html/web