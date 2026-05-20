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

const speedOptions = [
    { 'label': 'Slow', 'value': 1 },
    { 'label': 'Fast', 'value': 15 },
    { 'label': 'Instant', 'value': 40 },
];

const speed = ref(speedOptions[1].value);

watch(speed, (value) => {

    props.state.stepsPerFrame = value;

    if (value === speedOptions[2].value) {
        props.state.animate = false;
    } else {
        props.state.animate = true;
    }

}, {
    immediate: true
});

const precisionOptions = [
    { label: 'Low', value: 30 },
    { label: 'Medium', value: 70 },
    { label: 'High', value: 150 },
];

const precision = ref(precisionOptions[1].value);

watch(precision, (value) => {
    props.state.precisionPoints = value;
}, {
    immediate: true
});

</script>

<template>
    <Card>
        <template #title>
            <div class="font-semibold text-xl">Editors</div>
        </template>
        <template #content>
            <div class="flex items-center justify-start gap-2">
                <label for="parameter">Parameters</label>
            </div>
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

            <div class="card flex flex-col gap-4 mt-8">
                <div class="flex flex-col gap-2">
                    <label for="precision">Precision</label>
                    <SelectButton
                        class="col-span-2"
                        inputId="precision"
                        v-model="precision"
                        :options="precisionOptions"
                        optionLabel="label"
                        optionValue="value"
                        :allowEmpty="false"
                        size="small"
                        fluid
                    />
                </div>

                <div class="flex flex-col gap-2 mt-2">
                    <div class="flex items-center justify-start gap-2">
                        <label for="animate">Animation</label>
                    </div>
                    <SelectButton
                        class="col-span-2"
                        inputId="speed"
                        v-model="speed"
                        :options="speedOptions"
                        optionLabel="label"
                        optionValue="value"
                        :allowEmpty="false"
                        size="small"
                        fluid
                    />
                </div>
            </div>
        </template>
    </Card>
</template>