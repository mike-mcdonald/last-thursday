import Vue from 'vue';
import Formatter from './Formatter';
import store from './store';

(function ($, Drupal, drupalSettings) {
  Drupal.behaviors.esri = {
    attach: function (context, drupalSettings) {
      if (drupalSettings['esri_geofield_map']) {
        $(context).find('.esri-geofield-map').once('esri_processed').each(function (index, element) {
          var mapid = $(element).attr('id');
          var settings = drupalSettings['esri_geofield_map'][mapid];
          /* eslint-disable no-new */
          const app = new Vue({
            el: `#${mapid}`,
            store: store,
            components: {
              Formatter
            },
            template: '<Formatter/>'
          });

          store.state.settings = settings;
        });
      }
    }
  }

}(jQuery, Drupal, drupalSettings));
