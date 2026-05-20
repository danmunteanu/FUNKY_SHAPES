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
            <div class="grid grid-cols-1 gap-4 items-center mt-3">
                <InputGroup class="w-full min-w-0">
                    <InputGroupAddon class="w-32">
                        <label for="number_n" class="text-xs">Frequency</label>
                    </InputGroupAddon>

                    <InputNumber
                        class="flex-auto"
                        v-model="props.state.n"
                        id="number_n"
                        size="small"
                        buttonLayout="horizontal"
                        :min="1"
                        :max="state.max_n"
                        showButtons
                        highlightOnFocus
                        fluid
                    >
                        <template #incrementbuttonicon>
                            <span class="pi pi-plus text-sm" />
                        </template>
                        <template #decrementbuttonicon>
                            <span class="pi pi-minus text-sm" />
                        </template>
                    </InputNumber>
                </InputGroup>

                <Slider
                    v-model="props.state.n"
                    :min="1"
                    :max="state.max_n"
                    class="w-full min-w-0 md:mt-3 md:mb-3"
                />

                <div class="mt-3"></div>

                <InputGroup class="w-full min-w-0">
                    <InputGroupAddon class="w-32">
                        <label for="number_d" class="text-xs">Divisor</label>
                    </InputGroupAddon>

                    <InputNumber
                        class="flex-auto"
                        v-model="props.state.d"
                        id="number_d"
                        size="small"
                        buttonLayout="horizontal"
                        :min="1"
                        :max="state.max_d"
                        showButtons
                        highlightOnFocus
                        fluid
                    >
                        <template #incrementbuttonicon>
                            <span class="pi pi-plus text-sm" />
                        </template>
                        <template #decrementbuttonicon>
                            <span class="pi pi-minus" />
                        </template>
                    </InputNumber>
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