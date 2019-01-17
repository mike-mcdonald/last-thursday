<template>
  <div class="topbar">
    <DrawButton type="point" />
    <DrawButton type="multipoint" />
    <DrawButton type="polyline" />
    <DrawButton type="polygon" />
    <button name="reset"
      class="action-button esri-icon-trash reset"
      type="button"
      title="Clear graphics"
      @click="clearGraphics">
    </button>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import * as esriLoader from 'esri-loader';

import DrawButton from '@/components/DrawButton';
import symbols from '../utilities/symbols';

export default {
    name: 'Drawbar',
    components: {
      DrawButton,
    },
    created: function() {
      esriLoader.loadModules([
        'esri/widgets/Sketch/SketchViewModel'
      ]).then(
        ([
          SketchViewModel,
        ]) => {
          // create a new sketch view model
          const sketchViewModel = new SketchViewModel({
            view: this.mapView,
            pointSymbol: symbols.point,
            polylineSymbol: symbols.polyline,
            polygonSymbol: symbols.polygon,
          });

          sketchViewModel.on('draw-complete', (evt) => {
            this.clearMessages();
            const geometry = evt.geometry;
            this.addGeometry(geometry);
            let location = {};
            if (geometry.extent) {
              location = {
                x: geometry.extent.center.x,
                y: geometry.extent.center.y,
              }
            }
            else {
              // Points don't have extent
              location = {
                x: geometry.x,
                y: geometry.y,
              }
            }
            this.setAddressField(location);
            esriLoader.loadModules([
              'esri/geometry/support/webMercatorUtils',
            ]).then(([
              webMercatorUtils,
            ]) => {
              this.setValueField(webMercatorUtils.webMercatorToGeographic(geometry));
            });
          });

          this.setSketchViewModel(sketchViewModel);
        });
    },
    computed: {
      ...mapState({
        sketchViewModel: state => state.drawbar.sketchViewModel,
        mapView: state => state.map.mapView,
      })
    },
    methods: {
      ...mapActions([
        'clearGraphics',
        'setSketchViewModel',
        'addGeometry',
        'setAddressField',
        'setValueField',
        'clearMessages',
      ]),
    },
};
</script>

<style>
.portland-geofield-map-app .topbar {
  background: #fff;
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: .5rem;
}
</style>
