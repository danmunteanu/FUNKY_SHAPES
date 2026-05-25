/*
 * Generate the thumbnail sprite sheet used by the Options panel.
 *
 * The app displays many tiny shape previews from one PNG instead of drawing
 * every thumbnail at runtime. This script builds that PNG from the same shared
 * shape math used by the main canvas, renders it through a real browser canvas
 * for smooth anti-aliased lines, and writes the result to the assets folder.
 *
 * Run it with:
 * npm run spritesheet
 */

import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { buildShapePoints } from '../src/shape-points.ts';

const outputPath = resolve('assets/funky-shapes-sprite-sheet.png');
const cols = 6;
const rows = 6;
const cellSize = 96;
const precisionPoints = 150;
const width = cols * cellSize;
const height = rows * cellSize;

const tempDir = mkdtempSync(join(tmpdir(), 'funky-shapes-spritesheet-'));
const htmlPath = join(tempDir, 'spritesheet.html');
const screenshotPath = join(tempDir, 'funky-shapes-sprite-sheet.png');

try {
    writeFileSync(htmlPath, getRendererHtml());
    runChromium(htmlPath);

    mkdirSync(dirname(outputPath), { recursive: true });
    writeFileSync(outputPath, readFileSync(screenshotPath));

    console.log(`Generated ${outputPath}`);
}
finally {
    rmSync(tempDir, { recursive: true, force: true });
}

function getRendererHtml() {
    return `<!doctype html>
<html>
<head>
<style>
html,
body {
    margin: 0;
    width: ${width}px;
    height: ${height}px;
    overflow: hidden;
}

canvas {
    display: block;
}
</style>
</head>
<body>
<canvas id="spritesheet" width="${width}" height="${height}"></canvas>
<script>
const cols = ${cols};
const rows = ${rows};
const cellSize = ${cellSize};
const precisionPoints = ${precisionPoints};
const pointMap = ${JSON.stringify(getSpritePoints())};
const canvas = document.getElementById('spritesheet');
const ctx = canvas.getContext('2d');

ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.strokeStyle = 'blue';
ctx.lineWidth = 2;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';

for (const points of pointMap) {
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
</script>
</body>
</html>`;
}

function getSpritePoints() {
    const sprites = [];

    for (let d = 1; d <= rows; d++) {
        for (let n = 1; n <= cols; n++) {
            sprites.push(buildShapePoints({
                n,
                d,
                precisionPoints,
                width: cellSize,
                height: cellSize,
                padding: cellSize * 0.12,
                offsetX: (n - 1) * cellSize,
                offsetY: (d - 1) * cellSize,
            }));
        }
    }

    return sprites;
}

function runChromium(htmlPath) {
    const result = spawnSync('chromium-browser', [
        '--headless=new',
        '--no-sandbox',
        `--screenshot=${screenshotPath}`,
        `--window-size=${width},${height}`,
        `--user-data-dir=${join(tempDir, 'profile')}`,
        pathToFileURL(htmlPath).href,
    ], {
        encoding: 'utf8',
        stdio: 'pipe',
    });

    if (result.status !== 0) {
        throw new Error([
            'Chromium failed while generating the sprite sheet.',
            result.stderr,
            result.stdout,
        ].filter(Boolean).join('\\n'));
    }
}
