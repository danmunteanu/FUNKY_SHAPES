<script setup lang="ts">
import { reactive } from 'vue';
import Editors from './components/Editors.vue';
import Canvas from './components/Canvas.vue';

let state = reactive({
  n: 1,
  d: 1,
  numPoints: 55,
  animate: true,
});

</script>

<template>
  <div class="grid grid-cols-6 gap-4">
    <Editors :state="state" />
    <Canvas :state="state" />
  </div>
</template>
