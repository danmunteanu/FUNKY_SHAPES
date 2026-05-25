<script setup>
import { ref, watch } from 'vue';
import InputNumber from 'primevue/inputnumber';
import Slider from 'primevue/slider';
import Card from 'primevue/card';

const props = defineProps({
    state: Object,
});

const frequency = ref(props.state.n);
const divisor = ref(props.state.d);

watch(() => props.state.n, (value) => {
    frequency.value = value;
});

watch(() => props.state.d, (value) => {
    divisor.value = value;
});

function commitFrequency()
{
    props.state.n = frequency.value;
}

function commitDivisor()
{
    props.state.d = divisor.value;
}
</script>

<template>
    <Card>
        <template #title>
            <div class="font-semibold text-xl">Parameters</div>
        </template>

        <template #content>
            <div class="flex flex-col gap-2 mt-3">
                <label for="number_n" class="text-sm">Frequency</label>
                <div class="flex gap-5 items-center">
                    <Slider
                        v-model="frequency"
                        :min="1"
                        :max="state.max_n"
                        class="flex-none w-64 sm:w-108 md:w-32 xl:w-44 md:mt-3 md:mb-3"
                        fluid
                        @click="commitFrequency"
                        @slideend="commitFrequency"
                    />

                    <InputNumber
                        :disabled="true"
                        v-model="frequency"
                        id="number_n"
                        size="small"
                        :min="1"
                        :max="state.max_n"
                        class="flex-auto"
                        fluid
                    >
                        <template #incrementbuttonicon>
                            <span class="pi pi-plus text-sm" />
                        </template>
                        <template #decrementbuttonicon>
                            <span class="pi pi-minus text-sm" />
                        </template>
                    </InputNumber>
                </div>
            </div>

            <div class="flex flex-col gap-2 mt-6">
                <label for="number_d" class="text-sm">Divisor</label>
                <div class="flex gap-5 items-center">
                    <Slider
                        v-model="divisor"
                        :min="1"
                        :max="state.max_d"
                        class="flex-none w-64 sm:w-108 md:w-32 xl:w-44 md:mt-3 md:mb-3"
                        @click="commitDivisor"
                        @slideend="commitDivisor"
                    />

                    <InputNumber
                        :disabled="true"
                        v-model="divisor"
                        id="number_d"
                        size="small"
                        :min="1"
                        :max="state.max_d"
                        class="flex-auto"
                        fluid
                    >
                        <template #incrementbuttonicon>
                            <span class="pi pi-plus text-sm" />
                        </template>
                        <template #decrementbuttonicon>
                            <span class="pi pi-minus" />
                        </template>
                    </InputNumber>
                </div>
            </div>
        </template>
    </Card>
</template>
