<script setup lang="ts">
import { reactive } from 'vue';
import Editors from './components/Editors.vue';
import Canvas from './components/Canvas.vue';

//  Shared state
let state = reactive({
  n: 2,
  d: 1,

  max_n: 12,
  max_d: 12,
  max_num: 155,

  precisionPoints: 155,
  stepsPerFrame: 5,
  animate: false,  
});

</script>

<template>
  <div class="h-dvh grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 md:gap-4 px-5 mt-5">
    <div class="col-span-1 h-full">
      <Editors :state="state" />
    </div>
    <div class="col-span-2 h-full md:mt-0 mt-5">
      <Canvas :state="state" />
    </div>
  </div>
</template>
