# from https://www.drupal.org/requirements/php#drupalversions
FROM php:7.1-apache

RUN a2enmod rewrite

# install the PHP extensions we need
RUN set -ex \
	&& buildDeps=' \
		libjpeg62-turbo-dev \
		libpng12-dev \
		libpq-dev \		
	' \
	&& set -ex \
	&& drupalDeps=' \
		postgresql-9.4 \
		git-core \
	' \
	&& apt-get update \
	&& apt-get install -y --no-install-recommends $buildDeps $drupalDeps \
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

# install composer (from composer website)
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
	do&& php -r "if (hash_file('SHA384', 'composer-setup.php') === '544e09ee996cdf60ece3804abc52599c22b1f40f4323403c44d44fdfdd586475ca9813a858088ffbc1f233e9b180f061') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;" \
	&& php composer-setup.php \
	&& php -r "unlink('composer-setup.php');" \
	&& mv composer.phar /usr/local/bin/composer

# install drupal using composer
RUN composer create-project drupal-composer/drupal-project:8.x-dev . --stability dev --no-interaction

# add repositories
# access these modules as drupal/<module>
# means we can make a pdx/<module>?
RUN composer config repositories.drupal composer https://packages.drupal.org/8

# install drush symlink so it can be accessed form anywhere in the container
RUN ln -s /var/www/html/vendor/drush/drush/drush /usr/local/bin/drush
RUN ln -s /var/www/html/vendor/drupal/console/bin/drupal /usr/local/bin/drupal

# add composer dependencies here
RUN composer require \
drupal/token \
drupal/bootstrap \
drupal/ds

# add development dependencies
RUN composer require --dev \
drupal/admin_toolbar \
drupal/devel

RUN mkdir config \
&& mkdir sync \
&& chown -R www-data:www-data sync config

# when you run bash, this is where you'll start, and where drush will be able to run from.
WORKDIR /var/www/html/web

COPY ./settings.php /var/www/html/web/sites/default
COPY ./apache_site_config.conf /etc/apache2/sites-available/000-default.conf

# install this site from the profile in the profile directory
# use docker-compose up db first to make sure this operates correctly.
# DO NOT PERFORM THIS IN A PRODUCTION ENVIRONMENT
COPY ./profile /var/www/html/web/profiles/docker
#RUN drush si -y docker --account-name=pbotadmin --account-pass=Hf6F4OYFZ7qs
# import whatever configuration we have
COPY ./config /var/www/html/config
#RUN drush cset -y system.site uuid "9904c9d4-7bf1-48a5-96b4-63bf2b7167f9"
#RUN drupal config:import --directory="/var/www/html/config"

# makes it so Apache user can access and modify these?
# is the Apache user 
RUN chown -R www-data:www-data sites modules themes

# creates mountpoints?
VOLUME ["/var/www/html/config", "/var/www/html/web/sites", "/var/www/html/web/modules/custom", "/var/www/html/web/themes/custom"]

# for development only 
# set up msmtp config to point to mail container
COPY ./msmtprc /etc/
# set up php to use msmtp for sendmail
RUN echo 'sendmail_path = /usr/bin/msmtp -t' > /usr/local/etc/php/conf.d/mail.ini
# set up xdebug
RUN pecl install xdebug
RUN { \
	echo 'zend_extension="/usr/local/lib/php/extensions/no-debug-non-zts-20160303/xdebug.so"'; \
	echo 'xdebug.remote_enable=on'; \
	echo 'xdebug.remote_autostart=on'; \
} > /usr/local/etc/php/conf.d/xdebug.ini 
