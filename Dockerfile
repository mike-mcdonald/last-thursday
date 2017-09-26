# from https://www.drupal.org/requirements/php#drupalversions
FROM php:7.1-apache

RUN a2enmod rewrite

# install the PHP extensions we need
RUN set -ex \
	&& buildDeps=' \
		libjpeg62-turbo-dev \
		libpng12-dev \
		libpq-dev \
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
		git \
		vim \
	' \
	&& apt-get update \
	&& apt-get install -y --no-install-recommends $buildDeps \
	&& rm -rf /var/lib/apt/lists/* \
	&& apt-get purge -y --auto-remove $buildDeps


WORKDIR /var/www/html

# install composer (from composer website)
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
	&& php -r "if (hash_file('SHA384', 'composer-setup.php') === '669656bab3166a7aff8a7506b8cb2d1c292f042046c5a994c43155c0be6190fa0355160742ab2e1c88d40d5be660b410') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;" \
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
# always add whatever dependencies your custom module may have here
# Drupal won't be able to enable any custom module you have in your profile without them installed from here
RUN composer require \
drupal/token \
drupal/bootstrap \
drupal/ds

# add development dependencies
RUN composer require --dev \
drupal/admin_toolbar \
drupal/devel

# create the sync directory referenced in the settings file.
RUN mkdir sync \
&& mkdir config

RUN chown -R www-data:www-data sync config

COPY ./apache_site_config.conf /etc/apache2/sites-available/000-default.conf
COPY ./settings.php /var/www/html/web/sites/default/

# setup SSL
COPY ./certs/server.crt /etc/ssl/certs/server.crt
COPY ./certs/server.key /etc/ssl/private/server.key
COPY ./default-ssl.conf /etc/apache2/sites-available/default-ssl.conf
RUN ln -s /etc/apache2/sites-available/default-ssl.conf /etc/apache2/sites-enabled/default-ssl.conf

# when you run bash, this is where you'll start, and where drush will be able to run from.
WORKDIR /var/www/html/web

COPY ./modules /var/www/html/web/modules/custom
COPY ./themes /var/www/html/web/themes/custom

# install this site from the profile in the profile directory
# use docker-compose up db first to make sure this operates correctly.
# DO NOT PERFORM THIS IN A PRODUCTION ENVIRONMENT
COPY ./profile /var/www/html/web/profiles/docker
RUN drush si -y docker --account-name=pbotadmin --account-pass=Hf6F4OYFZ7qs
# import whatever configuration we have
COPY ./config /var/www/html/config
RUN drush cset -y system.site uuid "c9140aff-d1b6-48b5-9e62-080f9b8bf92d"
#RUN drupal config:import --directory="/var/www/html/config"

# makes it so Apache user can access and modify these?
# is the Apache user www-data?
RUN chown -R www-data:www-data sites modules themes

# creates mountpoints (where you can attach volumes)?
VOLUME ["/var/www/html/config", "/var/www/html/sync", "/var/www/html/web/modules/custom", "/var/www/html/web/themes/custom"]

# for development only 
# set up php to use msmtp for sendmail
# msmtp was configured by ./msmtprc above to point to mailhog
RUN echo 'sendmail_path = /usr/bin/msmtp -t' > /usr/local/etc/php/conf.d/mail.ini
COPY ./msmtprc /etc/

# set up xdebug
RUN pecl install xdebug
RUN { \
	# magic number?
	echo 'zend_extension="/usr/local/lib/php/extensions/no-debug-non-zts-20160303/xdebug.so"'; \
	echo 'xdebug.remote_enable=on'; \
	echo 'xdebug.remote_autostart=on'; \
# php looks for configs in this conf.d directory 
} > /usr/local/etc/php/conf.d/xdebug.ini 
