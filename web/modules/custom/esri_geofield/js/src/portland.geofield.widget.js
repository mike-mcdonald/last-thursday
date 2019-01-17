import Vue from 'vue';
import Widget from './Widget';
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
              Widget
            },
            template: '<Widget/>'
          });

          store.state.settings = settings;
          store.state.widget = true;
          store.state.field.addressField = settings.addressField;
          store.state.field.valueField = settings.wktid;
        });
      }
    }
  }

}(jQuery, Drupal, drupalSettings));
