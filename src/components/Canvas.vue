<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import p5 from 'p5';
import Card from 'primevue/card';
import Button from 'primevue/button';
import SelectButton from 'primevue/selectbutton';
import ColorPicker from 'primevue/colorpicker';
import Slider from 'primevue/slider';
import { buildShapePoints } from '../shape-points';

const props = defineProps({
    state: Object,
});

const canvasContainer = ref(null);

let p5Instance = null;

let finished = false;
let shapePoints = [];
let currentPointIndex = 1;

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
    { label: 'High', value: 150 },  //  this is not relevant as it's replaced with instant drawing
];

const precision = ref(precisionOptions[2].value);
const pickerColor = ref(props.state.color);

watch(speed, (value) => {

    props.state.stepsPerFrame = value;

    if (value === speedOptions[2].value) {
        props.state.animate = false;
    } else {
        props.state.animate = true;
    }

    if (p5Instance) {
        restartDrawing();
    }

}, {
    immediate: true
});

watch(precision, (value) => {
    props.state.precisionPoints = value;
}, {
    immediate: true
});

watch(() => props.state.color, (value) => {
    pickerColor.value = value;
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
        props.state.precisionPoints,
        props.state.color,
        props.state.lineThickness
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
    p.stroke(getShapeColor());
    p.strokeWeight(props.state.lineThickness);

    p.noLoop();

    //  Draw!
    restartDrawing();
}

function draw(p)
{
    for (let i = 0; i < props.state.stepsPerFrame; i++) {

        if (finished || currentPointIndex >= shapePoints.length) {
            finished = true;
            p.noLoop();
            break;
        }

        const previousPoint = shapePoints[currentPointIndex - 1];
        const currentPoint = shapePoints[currentPointIndex];

        p.line(previousPoint.x, previousPoint.y, currentPoint.x, currentPoint.y);

        currentPointIndex++;

        if (currentPointIndex >= shapePoints.length) {
            finished = true;
            p.noLoop();
            break;
        }
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
    finished = false;
    currentPointIndex = 1;

    if (!p5Instance) {
        return;
    }

    shapePoints = buildShapePoints({
        n: props.state.n,
        d: props.state.d,
        precisionPoints: props.state.precisionPoints,
        width: p5Instance.width,
        height: p5Instance.height,
    });

    p5Instance.background(255);
    p5Instance.stroke(getShapeColor());
    p5Instance.strokeWeight(props.state.lineThickness);
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

function getShapeColor()
{
    return `#${props.state.color}`;
}

function commitPickerColor()
{
    props.state.color = pickerColor.value;
}

function getDownloadName()
{
    return `${imageName}_f${props.state.n}_d${props.state.d}`;
}

function downloadCanvas()
{
    if (!p5Instance) {
        return;
    }

    p5Instance.saveCanvas(getDownloadName(), 'png');
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

                <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-5 md:mt-0">
                    <div class="flex flex-col gap-2">
                        <label for="line-thickness" class="text-sm">
                            Pen Size: {{ props.state.lineThickness }}
                        </label>

                        <Slider
                            inputId="line-thickness"
                            v-model="props.state.lineThickness"
                            :min="1"
                            :max="9"
                            class="mt-3"
                        />
                    </div>

                    <div class="mt-3 flex flex-col items-center gap-2 text-center md:mt-0">
                        <span class="text-sm">Color</span>

                        <ColorPicker
                            v-model="pickerColor"
                            class="w-fit"
                            @hide="commitPickerColor"
                        />
                    </div>
                </div>
            </div>
        </template>
    </Card>    
</template>
