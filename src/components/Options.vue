<script setup>
import Card from 'primevue/card';

const props = defineProps({
    state: Object,
});

function selectCell(row, col)
{
    props.state.d = row;
    props.state.n = col;
}

function getCellIndex(row, col)
{
    return (row - 1) * props.state.max_n + col;
}
</script>

<template>
    <Card>
        <template #title>
            <div class="font-semibold text-xl">
                Options
            </div>
        </template>

        <template #content>
            <div
                class="grid gap-2"
                :style="{
                    gridTemplateColumns: `repeat(${props.state.max_n}, minmax(0, 1fr))`
                }"
            >
                <button
                    v-for="index in props.state.max_n * props.state.max_d"
                    :key="index"
                    type="button"
                    class="aspect-square border rounded text-sm hover:bg-surface-100"
                    @click="selectCell(
                        Math.ceil(index / props.state.max_n),
                        ((index - 1) % props.state.max_n) + 1
                    )"
                >
                    {{ index }}
                </button>
            </div>
        </template>
    </Card>
</template>