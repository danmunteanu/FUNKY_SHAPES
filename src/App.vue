<script setup lang="ts">
import { reactive } from 'vue';
import Editors from './components/Editors.vue';
import Canvas from './components/Canvas.vue';
import Options from './components/Options.vue';

const currentYear = new Date().getFullYear();

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
  color: '0000ff',
  lineThickness: 3,
});

</script>

<template>
  <div class="min-h-dvh flex flex-col">
    <div class="grow grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 md:gap-4 md:content-start lg:content-normal px-5 mt-5 xl:px-22">
      <div class="col-span-1 h-full md:col-start-1 md:row-start-1 lg:col-start-auto lg:row-start-auto">
        <Editors :state="state" />
      </div>
      <div class="col-span-2 h-full md:mt-0 mt-5 md:col-start-2 md:row-start-1 md:row-span-2 lg:col-start-auto lg:row-start-auto lg:row-span-1">
        <Canvas :state="state" />
      </div>
      <div class="col-span-1 h-full md:mt-0 mt-5 md:col-start-1 md:row-start-2 lg:col-start-auto lg:row-start-auto">
        <Options :state="state" />
      </div>
    </div>

    <footer class="px-5 py-6 mt-8 border-t border-slate-200 text-sm text-slate-600 xl:px-22">
      <div class="flex flex-col items-center gap-2 text-center md:flex-row md:justify-between md:text-left">
        <p class="bg-gradient-to-r from-slate-900 via-blue-700 to-emerald-600 bg-clip-text text-lg font-semibold text-transparent">
          Funky Shapes
        </p>
        <p>
          Reality Frameworks &copy; {{ currentYear }}
        </p>
      </div>
    </footer>
  </div>
</template>
