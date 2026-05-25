<script setup lang="ts">
import { reactive } from 'vue';
import Editors from './components/Editors.vue';
import Canvas from './components/Canvas.vue';
import Options from './components/Options.vue';

//  Shared state
let state = reactive({
  n: 2,
  d: 1,

  max_n: 6,
  max_d: 6,
  max_num: 155,

  precisionPoints: 155,
  stepsPerFrame: 5,
  animate: false,  
});

</script>

<template>
  <div class="h-dvh grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 md:gap-4 md:content-start lg:content-normal px-5 mt-5">
    <div class="col-span-1 h-full md:col-start-1 md:row-start-1 lg:col-start-auto lg:row-start-auto xl:col-start-2">
      <Editors :state="state" />
    </div>
    <div class="col-span-2 h-full md:mt-0 mt-5 md:col-start-2 md:row-start-1 md:row-span-2 lg:col-start-auto lg:row-start-auto lg:row-span-1">
      <Canvas :state="state" />
    </div>
    <div class="col-span-1 h-full md:mt-0 mt-5 md:col-start-1 md:row-start-2 lg:col-start-auto lg:row-start-auto">
      <Options :state="state" />
    </div>
  </div>
</template>
