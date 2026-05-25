/*
 * Shared shape drawing math.
 *
 * The live canvas and the sprite sheet both need to draw the same curve.
 * This file keeps that logic in one place: it generates points from the
 * polar formula, measures the natural bounds of the result, then scales and
 * centers those points inside a requested box. That bounding-box step matters
 * because some formulas, like the circle from r = cos(theta), are not centered
 * around the polar origin.
 */

type Point = {
    x: number;
    y: number;
};

type Bounds = {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
};

type ShapePointOptions = {
    n: number;
    d: number;
    precisionPoints: number;
    width: number;
    height: number;
    padding?: number;
    offsetX?: number;
    offsetY?: number;
};

// Shrinks circles
const circleScale = 0.8;

/*
 * Build the final drawable points for a shape.
 *
 * Callers provide the formula values, drawing precision, and target box size.
 * The returned coordinates are ready to draw directly on a canvas.
 */
export function buildShapePoints({
    n,
    d,
    precisionPoints,
    width,
    height,
    padding = 40,
    offsetX = 0,
    offsetY = 0,
}: ShapePointOptions): Point[] {
    const rawPoints = getFormulaPoints(n, d, precisionPoints);
    const bounds = getBounds(rawPoints);
    const scaleMultiplier = isCircle(n, d) ? circleScale : 1;

    return fitPointsToBox(rawPoints, bounds, width, height, padding, offsetX, offsetY, scaleMultiplier);
}

/*
 * Detect the circle case in this formula family.
 *
 * When n and d match, the formula becomes r = cos(theta), which draws a
 * circle. It looks larger than the other shapes, so we scale it down.
 */
function isCircle(n: number, d: number): boolean {
    return n === d;
}

/*
 * Sample the polar formula across the full drawing range.
 *
 * The shape runs from 0 to 2π * d. More precision points means a smoother
 * curve, but also more line segments to draw.
 */
function getFormulaPoints(n: number, d: number, precisionPoints: number): Point[] {
    const points = [];
    const endRad = 2 * Math.PI * d;
    const stepRad = 2 * Math.PI / precisionPoints;

    for (let rad = 0; rad < endRad; rad += stepRad) {
        points.push(getFormulaPoint(n, d, rad));
    }

    points.push(getFormulaPoint(n, d, endRad));

    return points;
}

/*
 * Convert one formula sample from polar coordinates to x/y coordinates.
 *
 * The formula is r = cos(n * theta / d). At this stage the point is still in
 * the formula's own coordinate space, before canvas scaling or centering.
 */
function getFormulaPoint(n: number, d: number, rad: number): Point {
    const r = Math.cos(n * rad / d);

    return {
        x: r * Math.cos(rad),
        y: r * Math.sin(rad),
    };
}

/*
 * Find the smallest rectangle that contains all generated points.
 *
 * We use this rectangle later to center the visible shape itself, rather than
 * assuming the formula's origin is also the visual center.
 */
function getBounds(points: Point[]): Bounds {
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

/*
 * Scale and move formula-space points into the requested drawing box.
 *
 * The shape is scaled as large as possible while respecting padding, then its
 * bounding-box center is aligned with the center of the target box.
 */
function fitPointsToBox(
    points: Point[],
    bounds: Bounds,
    width: number,
    height: number,
    padding: number,
    offsetX: number,
    offsetY: number,
    scaleMultiplier: number
): Point[] {
    const shapeWidth = bounds.maxX - bounds.minX || 1;
    const shapeHeight = bounds.maxY - bounds.minY || 1;
    const availableWidth = Math.max(width - padding * 2, 1);
    const availableHeight = Math.max(height - padding * 2, 1);
    const scale = Math.min(
        availableWidth / shapeWidth,
        availableHeight / shapeHeight
    ) * scaleMultiplier;
    const shapeCenterX = bounds.minX + shapeWidth / 2;
    const shapeCenterY = bounds.minY + shapeHeight / 2;
    const boxCenterX = offsetX + width / 2;
    const boxCenterY = offsetY + height / 2;

    return points.map((point) => ({
        x: boxCenterX + (point.x - shapeCenterX) * scale,
        y: boxCenterY + (point.y - shapeCenterY) * scale,
    }));
}
