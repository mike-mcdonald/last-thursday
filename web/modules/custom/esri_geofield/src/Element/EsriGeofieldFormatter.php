<?php

namespace Drupal\esri_geofield\Element;

use Drupal\Core\Render\Element\RenderElement;
use Drupal\Core\Url;

/**
 * Provides a Geofield Map form element.
 *
 * @RenderElement("esri_geofield_formatter")
 */
class EsriGeofieldFormatter extends RenderElement {

  /**
   * {@inheritdoc}
   */
  public function getInfo() {
    return [
      '#theme' => 'esri_geofield_formatter',
      '#pre_render' => [
        [$this, 'preRenderEsriGeofieldFormatter'],
      ],
      '#attached' => [
        'library' => [
          'esri_geofield/formatter',
          'esri_geofield/esri'
        ],
      ],
    ];
  }

  /**
   * Create the render array that should come along with this element
   */
  function preRenderEsriGeofieldFormatter(array $element) {
    // pull out the id so we can map the settings and data
    $mapid = $element['#mapid'];
    
    $element['map'] = array(
      '#theme' => 'esri_geofield_formatter',
      '#mapid' => $mapid,
    );

    $element['#attached']['drupalSettings'] = [
      'esri_geofield_map' => [
        $mapid => [
          'basemap' => $element['#basemap'],
          'width' => isset($element['#dimensions']['width']) ? $element['#dimensions']['width'] : '100%',
          'height' => isset($element['#dimensions']['height']) ? $element['#dimensions']['height'] : '30vh',
          'value' => $element['#value'],
          'center' => [
            'lat' => floatval($element['#center']['lat']),
            'lon' => floatval($element['#center']['lon']),
          ],
          'zoom' => [
            'start' => intval($element['#zoom']['start']),
            'focus' => intval($element['#zoom']['focus']),
            'min' => intval($element['#zoom']['min']),
            'max' => intval($element['#zoom']['max']),
          ],
          'mapid' => $mapid,
        ],
      ],
    ];

    return $element;
  }
}