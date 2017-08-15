# from https://www.drupal.org/requirements/php#drupalversions
FROM drupal:8.3-apache

# from https://github.com/docker-library/php/issues/135
# need to set up some way for this image to send mail
# RUN apt-get update && \
# 	apt-get install -y ssmtp && \
# 	apt-get clean && \
# 	echo 'sendmail_path = /usr/sbin/ssmtp -t' > /usr/local/etc/php/conf.d/mail.ini

# RUN sed -i -e 's/mailhub=mail/mailhub=mail:1025/' \
# 	-e 's/#FromLineOverride/FromLineOverride/' \
#      #-e 's/#rewriteDomain=/rewriteDomain=ourdomain/' \
# #     -e '/hostname=/d' \
#      /etc/ssmtp/ssmtp.conf

RUN apt-get update && apt-get install -y --no-install-recommends msmtp git postgresql-9.4 vim

COPY ./msmtprc /etc/
COPY ./apache_site_config.conf /etc/apache2/sites-available/000-default.conf
COPY ./sites/default/settings.php /var/www/html/sites/default/

RUN echo 'sendmail_path = /usr/bin/msmtp -t' > /usr/local/etc/php/conf.d/mail.ini

# install dependencies for composer and drush
# RUN apt-get update && apt-get install -y --no-install-recommends git
# RUN apt-get update && apt-get install -y --no-install-recommends postgresql-9.4

# install composer (from composer website)
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" \
	&& php -r "if (hash_file('SHA384', 'composer-setup.php') === '669656bab3166a7aff8a7506b8cb2d1c292f042046c5a994c43155c0be6190fa0355160742ab2e1c88d40d5be660b410') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;" \
	&& php composer-setup.php \
	&& php -r "unlink('composer-setup.php');" \
	&& mv composer.phar /usr/local/bin/composer

# install drush using composer
RUN composer require drush/drush \
	&& ln -s /var/www/html/vendor/drush/drush/drush /usr/local/bin/drush

