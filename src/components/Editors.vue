<script setup>
import { ref, watch } from 'vue';
import InputNumber from 'primevue/inputnumber';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import Slider from 'primevue/slider';
import Card from 'primevue/card';
import FloatLabel from 'primevue/floatlabel';
import SelectButton from 'primevue/selectbutton';

const props = defineProps({
    state: Object,
});


</script>

<template>
    <Card>
        <template #title>
            <div class="font-semibold text-xl">Parameters</div>
        </template>
        <template #content>
            <div class="grid grid-cols-2 md:grid-cols-1 xl:grid-cols-2 gap-4 items-center mt-3">
                <InputGroup class="w-full min-w-0">
                    <InputGroupAddon>
                        <label for="number_n">N:</label>
                    </InputGroupAddon>

                    <InputNumber
                        v-model="props.state.n"
                        id="number_n"
                        :min="1"
                        :max="state.max_n"
                        showButtons
                        highlightOnFocus
                        fluid
                    />
                </InputGroup>

                <Slider
                    v-model="props.state.n"
                    :min="1"
                    :max="state.max_n"
                    class="w-full min-w-0 md:mt-3 md:mb-3"
                />

                <InputGroup class="w-full min-w-0">
                    <InputGroupAddon>
                        <label for="number_d">D:</label>
                    </InputGroupAddon>

                    <InputNumber
                        v-model="props.state.d"
                        id="number_d"
                        :min="1"
                        :max="state.max_d"
                        showButtons
                        highlightOnFocus
                        fluid
                    />
                </InputGroup>

                <Slider
                    v-model="props.state.d"
                    :min="1"
                    :max="state.max_d"
                    class="w-full min-w-0 md:mt-3 md:mb-3"
                />
            </div>
        </template>
    </Card>
</template>