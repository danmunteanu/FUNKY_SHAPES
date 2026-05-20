<script setup>
import { computed } from 'vue';

import Card from 'primevue/card';
import Button from 'primevue/button';
import spriteSheetUrl from '../../assets/funky-shapes-sprite-sheet.png';

const props = defineProps({
    state: Object,
});

const spriteCellSize = 96;

function selectCell(row, col)
{
    props.state.d = row;
    props.state.n = col;
}

function generateSpriteSheet()
{
    const cols = props.state.max_n;
    const rows = props.state.max_d;

    const canvas = document.createElement('canvas');

    canvas.width = cols * spriteCellSize;
    canvas.height = rows * spriteCellSize;

    const ctx = canvas.getContext('2d');

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let d = 1; d <= rows; d++) {
        for (let n = 1; n <= cols; n++) {
            drawShapeThumbnail(
                ctx,
                n,
                d,
                (n - 1) * spriteCellSize,
                (d - 1) * spriteCellSize,
                spriteCellSize
            );
        }
    }

    return canvas;
}

function drawShapeThumbnail(ctx, n, d, offsetX, offsetY, size)
{
    const precision = 75;
    const stepRad = 2 * Math.PI / precision;
    const scale = size * 0.38;

    let rad = 0;
    let lastX = null;
    let lastY = null;

    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.beginPath();

    while (rad <= 2 * Math.PI * d) {
        const r = Math.cos(n * rad / d);

        const x = offsetX + size / 2 + scale * r * Math.cos(rad);
        const y = offsetY + size / 2 + scale * r * Math.sin(rad);

        if (lastX === null) {
            ctx.moveTo(x, y);
        }
        else {
            ctx.lineTo(x, y);
        }

        lastX = x;
        lastY = y;

        rad += stepRad;
    }

    ctx.stroke();
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

function downloadSpriteSheet()
{
    const canvas = generateSpriteSheet();

    const link = document.createElement('a');

    link.download = 'funky-shapes-sprite-sheet.png';
    link.href = canvas.toDataURL('image/png');

    link.click();
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

                <div class="grow"></div>

                <!-- Re-enable this when you need to regenerate the sprite sheet -->
                <Button v-if="false"
                    label="Get Sprite Sheet"
                    size="small"
                    severity="primary"
                    class="uppercase"
                    @click="downloadSpriteSheet"
                />
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