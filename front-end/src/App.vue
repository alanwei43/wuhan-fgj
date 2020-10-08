<template>
  <div id="app">
    <e-chart />
  </div>
</template>

<script>
import EChart from "./components/EChart.vue";

export default {
  name: "App",
  components: {
    "e-chart": EChart,
  },
};
</script>
