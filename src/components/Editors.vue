<script setup>
import { ref } from 'vue';
import InputNumber from 'primevue/inputnumber';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';

const props = defineProps({
    n: Number,
    d: Number,
});

const emit = defineEmits([
    'update:n',
    'update:d',
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
                                :modelValue="props.n"
                                @update:modelValue="emit('update:n', $event)"
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
                                :modelValue="props.d"
                                @update:modelValue="emit('update:d', $event)"
                                id="number_d"
                                :min="1"
                                :max="6"
                            />
						</InputGroup>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>