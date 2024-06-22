
const ctx = document.querySelector('canvas').getContext("2d");
let origin = { x: 150, y: 20 }
const boundaries = [
    [[75, 125], [175, 1], 'blue'],
    [[150, 400], [250, 1], 'gray'],
    [[300, 350], [200, 1], 'gold'],
    //
    [[0, 600], [600, 1], 'black'],
    [[600, 0], [600, 1], 'black'],
    [[600, 0], [1, 600], 'black'],
    [[0, 600], [1, 600], 'black'],
    [[600, 600], [1, 600], 'black'],
    [[0, 0], [1, 600], 'black'],
    [[0, 0], [600, 1], 'black'],

];
const WALK_SPEED = 3;
const FOV_DEGREE = 90;
const CURSOR_SPEED = 4;
let boundariesMap = [];
let wallMap = new Map();
let viewAngle = 0;
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        viewAngle -= 5;
        viewAngle = viewAngle < 0 ? 359 : viewAngle;
    } else if (e.key === 'ArrowRight') {
        viewAngle = (viewAngle + 5) % 360;
    }
    // draw()
})
function rotate(left, intensity = CURSOR_SPEED) {
    if (left) {
        viewAngle -= intensity;
        viewAngle = viewAngle < 0 ? 359 : viewAngle;
    } else {
        viewAngle = (viewAngle + intensity) % 360;
    }
    draw()
}
// document.querySelectorAll('canvas')[0].addEventListener('click', e => draw(e));
let lastPosition;
let isMouseActive;
document.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    lastPosition && rotate(lastPosition > clientX);
    lastPosition = clientX;
})
let shortestRay = Number.MAX_SAFE_INTEGER;
function draw(e) {
    shortestRay = Number.MAX_SAFE_INTEGER;
    boundariesMap = [];
    wallMap = new Map();
    ctx.clearRect(0, 0, 800, 800);
    boundaries.forEach(([p1, p2]) => {
        ctx.fillRect(p1[0], p1[1], p2[0], p2[1])
    });
    origin = e ? { x: e.clientX, y: e.clientY } : origin
    const from = (viewAngle - FOV_DEGREE) < 0 ? 359 + viewAngle - FOV_DEGREE : (viewAngle - FOV_DEGREE);
    let i = from;
    while (i < (from + FOV_DEGREE)) {
        const angle = i++ % 360;
        let dist = 800;
        let nextPoint = calculateDestination([origin.x, origin.y], dist, angle);
        const intersectedBoundaries = boundaries.filter(([p1, p2]) => doIntersect([origin.x, origin.y], nextPoint, [p1[0], p1[1]], [p1[0] + p2[0], p1[1] + p2[1]]));
        let idx = 'white'
        if (intersectedBoundaries.length > 0) {
            const [_, safeNextPoint] = intersectedBoundaries.reduce(([distance, point], c, i) => {
                const [p1, p2] = c;
                const [x, y] = getIntersectionPoint([origin.x, origin.y], nextPoint, [p1[0], p1[1]], [p1[0] + p2[0], p1[1] + p2[1]]);
                const distanceFromOrigin = euclideanDistance(x, y, origin);
                if (distanceFromOrigin <= distance) {
                    idx = c[2]
                    return [distanceFromOrigin, [x, y]];
                }
                return [distance, point];
            }, [Number.MAX_SAFE_INTEGER, nextPoint]);
            nextPoint = safeNextPoint;
        }
        // const rayAngle = angle - (69 / 2) ;
        drawLine(nextPoint[0], nextPoint[1], origin.x, origin.y);
        let distFromOrigin = Math.round(euclideanDistance(nextPoint[0], nextPoint[1], origin))// * Math.cos(rayAngleRad);
        boundariesMap.push([distFromOrigin, idx, nextPoint, angle])
        shortestRay = Math.min(shortestRay, distFromOrigin);
    }
    renderscene();
}
function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
}


const ctxScreen = document.querySelectorAll('canvas')[1].getContext("2d");

function renderscene() {
    ctxScreen.clearRect(0, 0, 2000, 2000);
    for (let i = 0; i < boundariesMap.length; i++) {
        const [height, color] = boundariesMap[i];
        const projectedSliceHeigh = (64 / height) * 255;
        const fromTop = 300 - (projectedSliceHeigh / 2);
        ctxScreen.fillStyle = '#66ffe359';
        ctxScreen.fillRect(i * 10, 0, 10, fromTop);
        ctxScreen.globalAlpha = projectedSliceHeigh / 200;
        ctxScreen.fillStyle = color;
        ctxScreen.fillRect(i * 10, fromTop, 10, projectedSliceHeigh);
        ctxScreen.globalAlpha = 1;
        ctxScreen.fillStyle = '#00000017';
        ctxScreen.fillRect(i * 10, fromTop + projectedSliceHeigh, 10, 1000);
    }
}
let keyCode = null;
function loop() {
    if (keyCode === 'w' && shortestRay > 5) {
        const [_, __, target, angle] = boundariesMap[Math.round(boundariesMap.length / 2)];
        let [x, y] = getRotationAngle([origin.x, origin.y], angleBetweenTwoPoints(origin, { x: target[0], y: target[1] }), WALK_SPEED);
        origin = { x, y };
        draw()
    }
    keyCode = null;
    window.requestAnimationFrame(loop)
}
function collision() {

}
loop();
document.addEventListener('mousedown', (e) => isMouseActive = e.button === 0);
document.addEventListener('mouseup', (e) => isMouseActive = e.button === 0 ? false : isMouseActive);
document.addEventListener('keydown', (e) => keyCode = e.key);
