<script setup>
import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue';
import p5 from 'p5';
import Card from 'primevue/card';

const props = defineProps({
    state: Object,
});

const canvasContainer = ref(null);

let p5Instance = null;
let canvas = null;

let rad = 0;

const stepRad = computed(() => {
    return 2 * Math.PI / props.state.numPoints;
});

let lastX = null;
let lastY = null;

onMounted(() => {
    p5Instance = new p5((p) => {

        p.setup = () => setup(p);
        p.draw = () => draw(p);
        p.keyPressed = () => keyPressed(p);

    }, canvasContainer.value);

    window.addEventListener('resize', resizeCanvas);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeCanvas);
    
    if (p5Instance) {
        p5Instance.remove();
    }
});

watch(
    () => [
        props.state.n, 
        props.state.d, 
        props.state.numPoints
    ], () => {
        restartDrawing();
    }
);

function setup(p)
{
    const width = canvasContainer.value.clientWidth;
    const height = canvasContainer.value.clientHeight;

    // console.log(`${width}x${height}`);

    canvas = p.createCanvas(width, height);
    canvas.mousePressed(() => {
        mousePressed(p);
    });

    p.background(255);
    p.colorMode(p.HSB);
    p.textSize(20);
    p.colorMode(p.HSB);
    p.stroke('blue');
    p.strokeWeight(3);

    p.noLoop();

    restartDrawing();
}

function draw(p)
{
    let r = Math.cos(props.state.n * rad / props.state.d);

    let scale = 150;

    let x = p.width / 2 + scale * r * Math.cos(rad);
    let y = p.height / 2 + scale * r * Math.sin(rad);

    if (lastX !== null && lastY !== null) {
        p.line(lastX, lastY, x, y);
    }

    lastX = x;
    lastY = y;

    rad += stepRad.value;

    if (rad > 2 * Math.PI * props.state.d) {
        p.noLoop();
    }
}

function mousePressed(p)
{
    restartDrawing();
}

function keyPressed(p)
{
    p.redraw();
}

function resizeCanvas()
{
    if (!p5Instance || !canvasContainer.value) {
        return;
    }

    const width = canvasContainer.value.clientWidth;
    const height = canvasContainer.value.clientHeight;

    p5Instance.resizeCanvas(width, height);

    restartDrawing();
}

function restartDrawing()
{
    rad = 0;

    lastX = null;
    lastY = null;

    if (!p5Instance) {
        return;
    }

    p5Instance.background(255);

    p5Instance.noLoop();

    if (props.state.animate) {
        p5Instance.loop();
    }
    else {
        while (rad <= 2 * Math.PI * props.state.d) {
            draw(p5Instance);
        }
    }
}
</script>

<template>
    <!-- <pre>{{ props }}</pre> -->
    <Card class="flex flex-col">
        <template #title>
            Canvas
        </template>

        <template #content>
            <div class="h-full min-h-0">
                <div
                    ref="canvasContainer"
                    class="w-full h-full min-h-[480px]"
                />
            </div>
        </template>
    </Card>    
</template>