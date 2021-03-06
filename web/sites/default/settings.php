<?php

/**
 * Load services definition file.
 */
$settings['container_yamls'][] = __DIR__ . '/services.yml';

/**
 * Include the Pantheon-specific settings file.
 *
 * n.b. The settings.pantheon.php file makes some changes
 *      that affect all envrionments that this site
 *      exists in.  Always include this file, even in
 *      a local development environment, to ensure that
 *      the site settings remain consistent.
 */
include __DIR__ . "/settings.pantheon.php";

/**
 * Place the config directory outside of the Drupal root.
 */
$config_directories = [
  CONFIG_SYNC_DIRECTORY => dirname(DRUPAL_ROOT) . '/config/sync',
];

/**
 * If there is a local settings file, then include it
 */
$local_settings = __DIR__ . "/settings.local.php";
if (file_exists($local_settings)) {
  include $local_settings;
}

$settings['install_profile'] = 'lightning';

// Set environment variable for config_split module
if (isset($_ENV['PANTHEON_ENVIRONMENT'])) {
  // Pantheon environments are 'live', 'test', 'dev', and '[multidev name]'
  $env = $_ENV['PANTHEON_ENVIRONMENT'];
}
else {
  // Treat local dev same as Pantheon 'dev'
  $env = 'dev';
}

// Enable/disable config_split configurations based on the current environment
switch ($env) {
  case 'live':
    $config['config_split.config_split.config_dev']['status'] = FALSE;
    $config['config_split.config_split.config_prod']['status'] = TRUE;
    break;
    case 'test':
    $config['config_split.config_split.config_dev']['status'] = FALSE;
    $config['config_split.config_split.config_prod']['status'] = FALSE;
    break;
    case 'dev':
    default:  // Everything else (i.e. various multidev environments)
    $config['config_split.config_split.config_dev']['status'] = TRUE;
    $config['config_split.config_split.config_prod']['status'] = FALSE;
    break;
}
