<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import p5 from 'p5';

const props = defineProps({
    n: Number,
    d: Number,
});

const canvasContainer = ref(null);

let p5Instance = null;

const numPt = 55;
let stepRad = 2 * Math.PI  / numPt;

let rad = 0;

onMounted(() => {
    p5Instance = new p5((p) => {

        p.setup = () => setup(p);
        p.draw = () => draw(p);
        p.mousePressed = () => mousePressed(p);
        p.keyPressed = () => keyPressed(p);

    }, canvasContainer.value);
});

onBeforeUnmount(() => {
    if (p5Instance) {
        p5Instance.remove();
    }
});

function setup(p)
{
	p.createCanvas(720, 400);

	p.colorMode(p.HSB);
	p.textSize(20);

	p.noLoop();
}

function draw(p)
{
    p.background(0);

    if (rad > 2 * Math.PI)
    	return;

    let val = Math.cos(1.0 * props.n * rad / props.d);

    console.log(val);

    rad += stepRad;

	p.stroke('white');
  	p.strokeWeight(5);

    p.line(20, 20, 100, 100);

    p.describe('circle in center');
}

function mousePressed(p)
{
    if (p.isLooping()) {
        p.noLoop();
    }
    else {
        p.loop();
    }
}

function keyPressed(p)
{
    p.redraw();
}

</script>

<template>
    <div>
        <div class="text-2xl mb-4">
            Canvas
            
        </div>

        <div ref="canvasContainer"></div>
        <pre>{{props}}</pre>
    </div>
</template>