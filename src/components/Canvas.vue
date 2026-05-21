<script setup>
import { ref, watch, computed, onMounted, onBeforeUnmount } from 'vue';
import p5 from 'p5';
import Card from 'primevue/card';
import Button from 'primevue/button';
import SelectButton from 'primevue/selectbutton';

const props = defineProps({
    state: Object,
});

const canvasContainer = ref(null);

let p5Instance = null;

let finished = false;
let rad = 0;

const stepRad = computed(() => {
    return 2 * Math.PI / props.state.precisionPoints;
});

let lastX = null;
let lastY = null;

//  Download image name
const imageName = 'funky-shape';

const speedOptions = [
    { 'label': 'Slow', 'value': 1 },
    { 'label': 'Fast', 'value': 15 },
    { 'label': 'Instant', 'value': 40 },
];

const speed = ref(speedOptions[1].value);

const precisionOptions = [
    { label: 'Low', value: 30 },
    { label: 'Medium', value: 70 },
    { label: 'High', value: 150 },
];

const precision = ref(precisionOptions[1].value);

watch(speed, (value) => {

    props.state.stepsPerFrame = value;

    if (value === speedOptions[2].value) {
        props.state.animate = false;
    } else {
        props.state.animate = true;
    }

}, {
    immediate: true
});

watch(precision, (value) => {
    props.state.precisionPoints = value;
}, {
    immediate: true
});

onMounted(() => {
    p5Instance = new p5((p) => {

        p.setup = () => setup(p);
        p.draw = () => draw(p);

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
        props.state.precisionPoints
    ], () => {
        restartDrawing();
    }
);

function setup(p)
{
    //  Create canvas
    const width = canvasContainer.value.clientWidth;
    const height = canvasContainer.value.clientHeight;
    const canvas = p.createCanvas(width, height);
    
    //  Make the canvas scrollable
    canvas.elt.style.pointerEvents = 'none';

    //  Setup p5 instance
    p.background(255);
    p.colorMode(p.HSB);
    p.textSize(20);
    p.stroke('blue');
    p.strokeWeight(3);

    p.noLoop();

    //  Draw!
    restartDrawing();
}

function draw(p)
{
    for (let i = 0; i < props.state.stepsPerFrame; i++) {

        if (finished) {
            p.noLoop();
            break;
        }

        const endRad = 2 * Math.PI * props.state.d;
        const currentRad = Math.min(rad, endRad);

        let r = Math.cos(props.state.n * currentRad / props.state.d);

        let scale = 150;

        let x = p.width / 2 + scale * r * Math.cos(currentRad);
        let y = p.height / 2 + scale * r * Math.sin(currentRad);

        if (lastX !== null && lastY !== null) {
            p.line(lastX, lastY, x, y);
        }

        lastX = x;
        lastY = y;

        if (currentRad >= endRad) {
            finished = true;
            p.noLoop();
            break;
        }

        rad += stepRad.value;
    }
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
    finished = false;

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
        while (!finished) {
            draw(p5Instance);
        }
    }
}

function downloadCanvas()
{
    if (!p5Instance) {
        return;
    }

    p5Instance.saveCanvas(imageName, 'png');
}
</script>

<template>
    <!-- <pre>{{ props }}</pre> -->
    <Card class="flex flex-col">
        <template #title>
            <div class="flex items-center">
                <div class="text-xl font-semibold">
                    Shape
                </div>

                <div class="grow"></div>

                <Button
                    size="small"
                    severity="primary"
                    label="Download"
                    class="uppercase"
                    @click="downloadCanvas"
                />
            </div>
        </template>

        <template #content>
            <div
                ref="canvasContainer"
                class="w-full min-h-[400px]"
            />
        </template>

        <template #footer>
            <div class="flex flex-col gap-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-5 mt-3">
                    <div class="flex flex-col gap-2">
                        <label for="speed" class="text-sm">Animation</label>

                        <SelectButton
                            inputId="speed"
                            v-model="speed"
                            :options="speedOptions"
                            optionLabel="label"
                            optionValue="value"
                            :allowEmpty="false"
                            size="small"
                            fluid
                        />
                    </div>

                    <div class="flex flex-col gap-2">
                        <label for="precision" class="text-sm">Precision</label>

                        <SelectButton
                            inputId="precision"
                            v-model="precision"
                            :options="precisionOptions"
                            optionLabel="label"
                            optionValue="value"
                            :allowEmpty="false"
                            size="small"
                            fluid
                        />
                    </div>
                </div>
            </div>
        </template>
    </Card>    
</template>