<?php

namespace Drupal\pdx_geocoder\Plugin\Geocoder\Provider;

use Drupal\geocoder\ProviderUsingHandlerWithAdapterBase;

/**
 * Provides an Pdx geocoder provider plugin.
 *
 * @GeocoderProvider(
 *   id = "pdx",
 *   name = "City of Portland",
 *   handler = "\Drupal\pdx_geocoder\Geocoder\Provider\Pdx",
 *   arguments = {
 *     "sourcecountry" = NULL,
 *     "usessl" = true
 *   }
 * )
 */
class Pdx extends ProviderUsingHandlerWithAdapterBase {}