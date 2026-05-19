<script setup lang="ts">
import { reactive } from 'vue';
import Editors from './components/Editors.vue';
import Canvas from './components/Canvas.vue';

let state = reactive({
  n: 1,
  d: 1,
  numPoints: 35,
  animate: true,
});

</script>

<template>
  <div class="grid grid-cols-4 gap-4 px-5 mt-5">
    <div class="col-span-2">
      <Editors :state="state" />
    </div>
    <div class="col-span-2">
      <Canvas :state="state" />
    </div>
  </div>
</template>
