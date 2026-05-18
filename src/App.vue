<script setup lang="ts">
import { reactive } from 'vue';
import Editors from './components/Editors.vue';
import Canvas from './components/Canvas.vue';

let state = reactive({
  n: 1,
  d: 1,
});

</script>

<template>
  <div class="grid grid-cols-6 gap-4">
    <Editors v-model:n="state.n" v-model:d="state.d" />
    <Canvas :n="state.n" :d="state.d" />
  </div>
</template>
