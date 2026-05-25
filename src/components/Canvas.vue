<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
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

    shapePoints = buildShapePoints(p5Instance.width, p5Instance.height);

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

function buildShapePoints(canvasWidth, canvasHeight)
{
    const rawPoints = getFormulaPoints();
    const bounds = getBounds(rawPoints);

    return fitPointsToCanvas(rawPoints, bounds, canvasWidth, canvasHeight);
}

function getFormulaPoints()
{
    const points = [];
    const endRad = 2 * Math.PI * props.state.d;
    const stepRad = 2 * Math.PI / props.state.precisionPoints;

    for (let rad = 0; rad < endRad; rad += stepRad) {
        points.push(getFormulaPoint(rad));
    }

    points.push(getFormulaPoint(endRad));

    return points;
}

function getFormulaPoint(rad)
{
    const r = Math.cos(props.state.n * rad / props.state.d);

    return {
        x: r * Math.cos(rad),
        y: r * Math.sin(rad),
    };
}

function getBounds(points)
{
    return points.reduce((bounds, point) => ({
        minX: Math.min(bounds.minX, point.x),
        maxX: Math.max(bounds.maxX, point.x),
        minY: Math.min(bounds.minY, point.y),
        maxY: Math.max(bounds.maxY, point.y),
    }), {
        minX: Infinity,
        maxX: -Infinity,
        minY: Infinity,
        maxY: -Infinity,
    });
}

function fitPointsToCanvas(points, bounds, canvasWidth, canvasHeight)
{
    const padding = 40;
    const shapeWidth = bounds.maxX - bounds.minX || 1;
    const shapeHeight = bounds.maxY - bounds.minY || 1;
    const availableWidth = Math.max(canvasWidth - padding * 2, 1);
    const availableHeight = Math.max(canvasHeight - padding * 2, 1);
    const scale = Math.min(
        availableWidth / shapeWidth,
        availableHeight / shapeHeight
    );
    const shapeCenterX = bounds.minX + shapeWidth / 2;
    const shapeCenterY = bounds.minY + shapeHeight / 2;
    const canvasCenterX = canvasWidth / 2;
    const canvasCenterY = canvasHeight / 2;

    return points.map((point) => ({
        x: canvasCenterX + (point.x - shapeCenterX) * scale,
        y: canvasCenterY + (point.y - shapeCenterY) * scale,
    }));
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
