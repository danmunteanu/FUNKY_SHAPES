<script setup>
import { ref } from 'vue';
import InputNumber from 'primevue/inputnumber';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import Checkbox from 'primevue/checkbox';
import Slider from 'primevue/slider';
import Card from 'primevue/card';

const props = defineProps({
    state: Object,
});

</script>

<template>
    <Card>
        <template #title>Editors</template>
        <template #content>
            <div class="grid grid-cols-2 md:grid-cols-1 xl:grid-cols-2 gap-4 items-center">
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

        <template #footer>
            <div class="grid grid-cols-2 md:grid-cols-1 xl:flex xl:items-center xl:gap-6 mt-10">
                <div class="flex items-center gap-2">
                    <Checkbox
                        v-model="props.state.animate"
                        inputId="animate"
                        name="animate"
                        binary
                    />

                    <label for="animate">
                        Animate
                    </label>
                </div>

                <div class="hidden xl:block xl:grow"></div>

                <div class="w-32">
                    <InputNumber
                        v-model="props.state.numPoints"
                        id="number_num_points"
                        :min="25"
                        :max="state.max_num"
                        :step="5"
                        showButtons
                        fluid
                        highlightOnFocus
                    />
                </div>
            </div>
        </template>
    </Card>
</template>