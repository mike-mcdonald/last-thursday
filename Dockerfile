# from https://www.drupal.org/requirements/php#drupalversions
FROM php:7.1-apache

RUN a2enmod rewrite
# enables SSL for apache
RUN a2enmod ssl

# install the PHP extensions we need
RUN set -ex \
	&& buildDeps=' \
		libjpeg62-turbo-dev \
		libpng12-dev \
		libpq-dev \
	' \
	# install postgres and git
	&& devDeps=' \
		git-core \
		postgresql-9.4 \
	' \ 
	&& apt-get update \
	&& apt-get install -y --no-install-recommends $buildDeps \
	&& rm -rf /var/lib/apt/lists/* \
	&& docker-php-ext-configure gd \
		--with-jpeg-dir=/usr \
		--with-png-dir=/usr \
	&& docker-php-ext-install -j "$(nproc)" gd mbstring opcache pdo pdo_mysql pdo_pgsql zip \
	&& apt-mark manual \
		libjpeg62-turbo \
		libpq5 \
	&& apt-get purge -y --auto-remove $buildDeps

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

# set up development dependencies
RUN set -ex \
	&& buildDeps=' \
		msmtp \
		vim \
	' \
	&& apt-get update \
	&& apt-get install -y --no-install-recommends $buildDeps \
	&& rm -rf /var/lib/apt/lists/*


WORKDIR /var/www/html

# copy the composer project you set up into the container
ADD ./docroot .

# makes Apache point to the web folder and increases request size limits
COPY ./apache_site_config.conf /etc/apache2/sites-available/000-default.conf

# install drush and drupal console symlink so it can be accessed from anywhere in the container
RUN ln -s /var/www/html/vendor/drush/drush/drush /usr/local/bin/drush
RUN ln -s /var/www/html/vendor/drupal/console/bin/drupal /usr/local/bin/drupal

# when you run bash, this is where you'll start, and where drush will be able to run from.
WORKDIR /var/www/html/web

# install this site from the profile in the profile directory
# use docker-compose up db first to make sure this operates correctly.
# DO NOT PERFORM THIS IN A PRODUCTION ENVIRONMENT
RUN drupal site:install seed --site-name="PBOT Drupal Seed" --account-name=pbotadmin --account-pass=Hf6F4OYFZ7qs
RUN drupal config:override system.site uuid "9904c9d4-7bf1-48a5-96b4-63bf2b7167f9"
RUN drupal config:import

# makes it so Apache user can access and modify these?
# is the Apache user www-data?
RUN chown -R www-data:www-data sites modules themes

# creates mountpoints (where you can attach volumes)?
VOLUME ["/var/www/html"]

# for development only 
# set up msmtp config to point to mail container
COPY ./msmtprc /etc/
# set up php to use msmtp for sendmail
# msmtp was configured by ./msmtprc above to point to mailhog
RUN echo 'sendmail_path = /usr/bin/msmtp -t' > /usr/local/etc/php/conf.d/mail.ini
# set up xdebug
RUN pecl install xdebug
# php looks for configs in this conf.d directory 
RUN { \
	echo 'zend_extension="/usr/local/lib/php/extensions/no-debug-non-zts-20160303/xdebug.so"'; \
	echo 'xdebug.remote_enable=on'; \
	echo 'xdebug.remote_autostart=on'; \
} > /usr/local/etc/php/conf.d/xdebug.ini 
