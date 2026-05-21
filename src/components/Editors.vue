<script setup>
import { ref, watch } from 'vue';
import InputNumber from 'primevue/inputnumber';
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
            <div class="flex flex-col gap-2 mt-3">
                <label for="number_n" class="text-sm">Frequency</label>
                <div class="flex gap-5 items-center">
                    <Slider
                        v-model="props.state.n"
                        :min="1"
                        :max="state.max_n"
                        class="flex-none w-64 sm:w-108 md:w-32 xl:w-48 md:mt-3 md:mb-3"
                        fluid
                    />

                    <InputNumber
                        :disabled="true"
                        v-model="props.state.n"
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
                        v-model="props.state.d"
                        :min="1"
                        :max="state.max_d"
                        class="flex-none w-64 sm:w-108 md:w-32 xl:w-48 md:mt-3 md:mb-3"
                    />

                    <InputNumber
                        :disabled="true"
                        v-model="props.state.d"
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