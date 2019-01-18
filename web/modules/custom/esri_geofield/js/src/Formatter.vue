<template>
  <div :id="mapid">
    <Map/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import Map from "./components/Map";
import Messages from "./components/Messages";
import Drawbar from './components/Drawbar.vue';
import Search from './components/Search.vue';

export default {
  name: "Formatter",
  components: {
    Map,
  },
  computed: {
    ...mapGetters([
      'mapid',
    ])
  },
  methods: {

  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
