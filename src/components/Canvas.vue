<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import p5 from 'p5';

const props = defineProps({
    state: Object,
});

const canvasContainer = ref(null);

let p5Instance = null;
let canvas = null;

let rad = 0;
let stepRad = 2 * Math.PI  / props.state.numPoints;

let lastX = null;
let lastY = null;

onMounted(() => {
    p5Instance = new p5((p) => {

        p.setup = () => setup(p);
        p.draw = () => draw(p);
        p.keyPressed = () => keyPressed(p);

    }, canvasContainer.value);

});

onBeforeUnmount(() => {
    if (p5Instance) {
        p5Instance.remove();
    }
});

watch(
    () => [props.state.n, props.state.d, props.state.numPoints],
    () => {
        restartDrawing();
    }
);

function setup(p)
{
    canvas = p.createCanvas(720, 400);
    canvas.mousePressed(() => {
        mousePressed(p);
    });

    p.background(0);
    p.colorMode(p.HSB);
    p.textSize(20);

    p.stroke('white');
    p.strokeWeight(2);

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

    rad += stepRad;

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

function restartDrawing()
{
    rad = 0;

    lastX = null;
    lastY = null;

    if (!p5Instance) {
        return;
    }

    p5Instance.background(0);

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
    <div>
        <div class="text-2xl mb-4">
            Canvas
        </div>

        <div ref="canvasContainer"></div>

        <!-- <pre>{{props}}</pre> -->
    </div>
</template>