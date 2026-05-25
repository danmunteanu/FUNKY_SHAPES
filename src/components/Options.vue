<script setup>
import { computed } from 'vue';

import Card from 'primevue/card';
import Button from 'primevue/button';
import spriteSheetUrl from '../../assets/funky-shapes-sprite-sheet.png';
import { buildShapePoints } from '../shape-points';

const props = defineProps({
    state: Object,
});

const spriteCellSize = 96;
const spritePrecisionPoints = 150;

//  Enable this when you must regenerate the sprite sheet
const enableSpriteSheet = false;

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
    const points = buildShapePoints({
        n,
        d,
        precisionPoints: spritePrecisionPoints,
        width: size,
        height: size,
        padding: size * 0.12,
        offsetX,
        offsetY,
    });

    ctx.strokeStyle = 'blue';
    ctx.lineWidth = 2;
    ctx.beginPath();

    points.forEach((point, index) => {
        if (index === 0) {
            ctx.moveTo(point.x, point.y);
        }
        else {
            ctx.lineTo(point.x, point.y);
        }
    });

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

        <template #footer>
            <Button v-if="enableSpriteSheet"
                label="Generate Spritesheet"
                size="small"
                severity="info"
                class="mt-3 w-full uppercase"
                @click="downloadSpriteSheet"
            />
        </template>
    </Card>
</template>
