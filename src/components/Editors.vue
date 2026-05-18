<script setup>
import { ref } from 'vue';
import InputNumber from 'primevue/inputnumber';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import Checkbox from 'primevue/checkbox';

const props = defineProps({
    state: Object,
});

const emit = defineEmits([
    'update:state.n',
    'update:state.d',
]);

</script>

<template>
	<div class="flex flex-col md:flex-row gap-8">
        <div class="md:w-1/2">
        	<div class="card flex flex-col gap-4">
                <div class="font-semibold text-xl">Editors</div>
                <div class="flex flex-wrap gap-4">
                    <div class="flex flex-col grow basis-0 gap-2">
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
                    <div class="flex flex-col grow basis-0 gap-2">
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
                    <div class="flex items-center gap-2">
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
                </div>
            </div>
        </div>
    </div>
</template>