<script setup>
import { computed } from 'vue';

import Card from 'primevue/card';
import spriteSheetUrl from '../../assets/funky-shapes-sprite-sheet.png';

const props = defineProps({
    state: Object,
});

function selectCell(row, col)
{
    props.state.d = row;
    props.state.n = col;
}

function getCellSpriteStyle(index)
{
    const col = (index - 1) % props.state.max_n;
    const row = Math.floor((index - 1) / props.state.max_n);

    return {
        backgroundImage: `url(${spriteSheetUrl})`,
        backgroundSize: backgroundSize.value,
        backgroundPosition: `${col * 100 / (props.state.max_n - 1)}% ${row * 100 / (props.state.max_d - 1)}%`,
    };
}

function gcd(a, b)
{
    while (b !== 0) {
        const temp = b;

        b = a % b;
        a = temp;
    }

    return a;
}

function getShapeKey(n, d)
{
    const g = gcd(n, d);

    return `${n / g}:${d / g}`;
}

const backgroundSize = computed(() => {
    return `${props.state.max_n * 100}% ${props.state.max_d * 100}%`;
});

const uniqueCells = computed(() => {
    const seen = new Set();
    const cells = [];

    for (let d = 1; d <= props.state.max_d; d++) {
        for (let n = 1; n <= props.state.max_n; n++) {
            const key = getShapeKey(n, d);

            if (seen.has(key)) {
                continue;
            }

            seen.add(key);

            const index = (d - 1) * props.state.max_n + n;

            cells.push({
                n,
                d,
                index,
                style: getCellSpriteStyle(index),
            });
        }
    }

    return cells;
});
</script>

<template>
    <Card>
        <template #title>
            <div class="flex items-center">
                <div class="font-semibold text-xl">
                    Options
                </div>
            </div>
        </template>

        <template #content>
            <div
                class="grid gap-2 mt-3"
                :style="{
                    gridTemplateColumns: `repeat(auto-fill, minmax(48px, 1fr))`
                }"
            >
                <button
                    v-for="cell in uniqueCells"
                    v-memo="[cell.n, cell.d, cell.index]"
                    :key="`${cell.n}:${cell.d}`"
                    type="button"
                    class="aspect-square border rounded bg-no-repeat"
                    :style="cell.style"
                    @click="selectCell(cell.d, cell.n)"
                >
                </button>
            </div>
        </template>
    </Card>
</template>
