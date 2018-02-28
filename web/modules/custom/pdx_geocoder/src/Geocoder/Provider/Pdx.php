<?php

namespace Drupal\pdx_geocoder\Geocoder\Provider;

use Geocoder\Exception\NoResult;
use Geocoder\Exception\UnsupportedOperation;
use Geocoder\Provider\AbstractHttpProvider;
use Geocoder\Provider\Provider;
use Ivory\HttpAdapter\HttpAdapterInterface;
use proj4php\Proj4php;
use proj4php\Proj;
use proj4php\Point;

/**
 * Provides a file handler to be used by 'pdx' plugin.
 * 
 * @author Mike McDonald <michael.mcdonald@portlandoregon.gov>
 */
class Pdx extends AbstractHttpProvider implements Provider
{
    /**
     * @var string
     */
    const ENDPOINT_URL = '%s://www.portlandmaps.com/arcgis/rest/services/Public/Address_Geocoding_PDX/GeocodeServer/findAddressCandidates?Single+Line+Input=%s';

    /**
     * @var string
     */
    const REVERSE_ENDPOINT_URL = '%s://www.portlandmaps.com/arcgis/rest/services/Public/Address_Geocoding_PDX/GeocodeServer/reverseGeocode?location=%F,%F';

    /**
     * @var string
     */
    private $sourceCountry;

    /**
     * @var string
     */
    private $protocol;

    /**
     * @param HttpAdapterInterface $adapter       An HTTP adapter
     * @param string               $sourceCountry Country biasing (optional)
     * @param bool                 $useSsl        Whether to use an SSL connection (optional)
     */
    public function __construct(HttpAdapterInterface $adapter, $sourceCountry = null, $useSsl = true)
    {
        parent::__construct($adapter);

        $this->sourceCountry = $sourceCountry;
        $this->protocol      = $useSsl ? 'https' : 'http';
    }

    /**
     * {@inheritDoc}
     */
    public function geocode($address)
    {
        if (filter_var($address, FILTER_VALIDATE_IP)) {
            throw new UnsupportedOperation('The ArcGISOnline provider does not support IP addresses, only street addresses.');
        }

        // Save a request if no valid address entered
        if (empty($address)) {
            throw new NoResult('Invalid address.');
        }

        $query = sprintf(self::ENDPOINT_URL, $this->protocol, urlencode($address));
        $json  = $this->executeQuery($query);

        // no result
        if (empty($json->candidates)) {
            throw new NoResult(sprintf('No results found for query "%s".', $query));
        }

        $results = [];
        foreach ($json->candidates as $candidate) {
            $data = $candidate->attributes;

            $coordinates  = (array) ['x' => $candidate->location->x, 'y' => $candidate->location->y];
            $streetName   = $this->createStreetName($data);
            $streetNumber = !empty($data->House) ? $data->House : null;
            $city         = !empty($data->City) ? $data->City : null;
            $state        = !empty($data->State) ? $data->State : null;
            $zipcode      = !empty($data->ZIP) ? $data->ZIP : null;

            $adminLevels = [];
            foreach (['Region', 'Subregion'] as $i => $property) {
                if (!empty($data->{$property})) {
                    $adminLevels[] = ['name' => $data->{$property}, 'level' => $i + 1];
                }
            }

            $results[] = array_merge($this->getDefaults(), [
                'latitude'     => $coordinates['y'],
                'longitude'    => $coordinates['x'],
                'streetNumber' => $streetNumber,
                'streetName'   => $streetName,
                'locality'     => $city,
                'postalCode'   => $zipcode,
                'adminLevels'  => $adminLevels,
            ]);
        }

        return $this->returnResults($results);
    }

    /**
     * {@inheritDoc}
     */
    public function reverse($latitude, $longitude)
    {
        // convert to projection used by PDX Geocoder (3857).
        $coordinates = $this->convertCoordinates($latitude, $longitude);

        $longitude  = $coordinates['x'];
        $latitude   = $coordinates['y'];

        $query = sprintf(self::REVERSE_ENDPOINT_URL, $this->protocol, $longitude, $latitude);
        $json  = $this->executeQuery($query);

        if (property_exists($json, 'error')) {
            throw new NoResult(sprintf('No results found for query "%s".', $query));
        }

        $data = $json->address;

        $streetName     = !empty($data->Street) ? $data->Street : null;
        $city           = !empty($data->City) ? $data->City : null;
        $zipcode        = !empty($data->ZIP) ? $data->ZIP : null;
        $county         = !empty($data->Subregion) ? $data->Subregion : null;
        $state          = !empty($data->State) ? $data->State : null;

        return $this->returnResults([
            array_merge($this->getDefaults(), [
                'latitude'    => $latitude,
                'longitude'   => $longitude,
                'streetName'  => $streetName,
                'locality'    => $city,
                'postalCode'  => $zipcode,
                'adminLevels' => [
                  0 => [
                    'level' => 1,
                    'name' => 'Oregon',
                    'code' => 'OR',
                  ],
                ],
                'county'      => $county,
            ])
        ]);
    }

    /**
     * {@inheritDoc}
     */
    public function getName()
    {
        return 'arcgis_online';
    }

    private function createStreetName($candidate)
    {
        $components = [
            'Side',
            'PreDir',
            'PreType',
            'StreetName',
            'SufType',
            'SufDir',
        ];

        $result = '';

        foreach ($components as $key => $component) {
            $result = $result . $candidate->{$component};
        }

        return $result;
    }

    private function convertCoordinates($latitude, $longitude)
    {
      // Initialise Proj4
      $proj4 = new Proj4php();

      // Create two different projections.
      $proj3857    = new Proj('EPSG:3857', $proj4);
      $proj4326  = new Proj('EPSG:4326', $proj4);

      // Create a point.
      $pointSrc = new Point($longitude, $latitude, $proj4326);

      // Transform the point between datums.
      $pointDest = $proj4->transform($proj3857, $pointSrc);

      return ['x' => $pointDest->x, 'y' => $pointDest->y];
    } 

    /**
     * @param string $query
     */
    private function buildQuery($query)
    {
        if (null !== $this->sourceCountry) {
            $query = sprintf('%s&sourceCountry=%s', $query, $this->sourceCountry);
        }

        return sprintf('%s&maxLocations=%d&f=%s&outFields=*&outSR=4326', $query, $this->getLimit(), 'json');
    }

    /**
     * @param string $query
     */
    private function executeQuery($query)
    {
        $query   = $this->buildQuery($query);
        $content = (string) $this->getAdapter()->get($query)->getBody();

        if (empty($content)) {
            throw new NoResult(sprintf('Could not execute query "%s".', $query));
        }

        $json = json_decode($content);

        // API error
        if (!isset($json)) {
            throw new NoResult(sprintf('Could not execute query "%s".', $query));
        }

        return $json;
    }
}
