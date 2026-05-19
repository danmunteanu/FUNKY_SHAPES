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

const emit = defineEmits([
    'update:state.n',
    'update:state.d',
]);

</script>

<template>
    <Card>
        <template #title>Editors</template>
        <template #content>
            <div class="flex gap-6">
                <div class="w-32 flex-none">
                    <InputGroup>
                        <InputGroupAddon>
                            <label for="number_n">N:</label>
                        </InputGroupAddon>
                        <InputNumber
                            v-model="props.state.n"
                            id="number_n"
                            :min="1"
                            :max="6"
                        />
                    </InputGroup>
                </div>
                <div class="flex-auto">
                    <Slider v-model="props.state.n" :min="1" :max="6" class="mt-5" fluid/>
                </div>
            </div>

            <div class="flex gap-6">
                <div class="w-32">
                    <InputGroup>
                        <InputGroupAddon>
                            <label for="number_d">D:</label>
                        </InputGroupAddon>
                        <InputNumber
                            v-model="props.state.d"
                            id="number_d"
                            :min="1"
                            :max="6"
                        />
                    </InputGroup>
                </div>
                <div class="flex-auto">
                    <Slider v-model="props.state.d" :min="1" :max="6" class="mt-5"/>
                </div>
            </div>
        </template>
        <template #footer>
            <div class="flex gap-6 items-center">
                <div class="w-32 flex-none">
                    <Checkbox
                        v-model="state.animate"
                        inputId="animate"
                        name="animate"
                        binary
                    />
                    <label for="animate">
                        Animate
                    </label>
                </div>
                <div class="flex-auto">
                    <InputNumber
                        v-model="props.state.numPoints"
                        id="number_d"
                        :min="5"
                        :max="55"
                        :step="5"
                        fluid
                    />
                </div>
            </div>
        </template>
    </Card>
</template>