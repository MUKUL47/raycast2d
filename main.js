function calculateDestination(source, distance, degree) {
    const radians = degree * (Math.PI / 180);
    const x_destination = source[0] + distance * Math.cos(radians);
    const y_destination = source[1] + distance * Math.sin(radians);
    return [x_destination, y_destination];
}
const ctx = document.querySelector('canvas').getContext("2d");
let origin = { x: 150, y: 20 }
const rays = [];
for (let i = 0; i < 360; i++) {
    const ray = {
        angle: i,
    };
    rays.push(ray);
}
const boundaries = [
    [[75, 125], [175, 1], 'blue'],
    [[40, 275], [41, 1], 'green'],
    [[150, 400], [250, 1], 'gray'],
    // [[500, 300], [1, 100], 'black'],
    [[300, 350], [200, 1], 'gold'],
    // Additional closed boundaries (rectangular walls)
    [[100, 100], [1, 200], 'red'],    // Vertical start of a rectangle
    [[101, 300], [200, 1], 'red'],    // Horizontal bottom of the same rectangle
    // [[300, 100], [1, 200], 'red'],    // Vertical end of the same rectangle
    [[100, 100], [200, 1], 'red'],    // Horizontal top of the same rectangle

    [[200, 50], [1, 300], 'purple'],  // Vertical start of a rectangle
    // [[201, 350], [300, 1], 'purple'], // Horizontal bottom of the same rectangle
    [[500, 50], [1, 300], 'purple'],  // Vertical end of the same rectangle
    // [[200, 50], [300, 1], 'purple'],  // Horizontal top of the same rectangle

    // [[250, 150], [1, 250], 'orange'], // Vertical start of a rectangle
    // [[251, 400], [250, 1], 'orange'], // Horizontal bottom of the same rectangle
    // [[500, 150], [1, 250], 'orange'], // Vertical end of the same rectangle
    // [[250, 150], [250, 1], 'orange'], // Horizontal top of the same rectangle

    // [[350, 100], [1, 400], 'cyan'],   // Vertical start of a rectangle
    // [[351, 500], [400, 1], 'cyan'],   // Horizontal bottom of the same rectangle
    // [[750, 100], [1, 400], 'cyan'],   // Vertical end of the same rectangle
    [[350, 100], [400, 1], 'cyan'],   // Horizontal top of the same rectangle

    // [[450, 50], [1, 500], 'magenta'], // Vertical start of a rectangle
    [[451, 550], [500, 1], 'magenta'],// Horizontal bottom of the same rectangle
    [[950, 50], [1, 500], 'magenta'], // Vertical end of the same rectangle
    // [[450, 50], [500, 1], 'magenta'], // Horizontal top of the same rectangle
// 
    [[550, 200], [1, 300], 'lime'],   // Vertical start of a rectangle
    // [[551, 500], [300, 1], 'lime'],   // Horizontal bottom of the same rectangle
    [[850, 200], [1, 300], 'lime'],   // Vertical end of the same rectangle
    [[550, 200], [300, 1], 'lime'],   // Horizontal top of the same rectangle

    [[600, 250], [1, 350], 'pink'],   // Vertical start of a rectangle
    // [[601, 600], [350, 1], 'pink'],   // Horizontal bottom of the same rectangle
    // [[950, 250], [1, 350], 'pink'],   // Vertical end of the same rectangle
    // [[600, 250], [350, 1], 'pink'],   // Horizontal top of the same rectangle

    // [[700, 150], [1, 400], 'brown'],  // Vertical start of a rectangle
    // [[701, 550], [400, 1], 'brown'],  // Horizontal bottom of the same rectangle
    // [[1100, 150], [1, 400], 'brown'], // Vertical end of the same rectangle
    [[700, 150], [400, 1], 'brown'],  // Horizontal top of the same rectangle

    [[800, 100], [1, 450], 'gray'],   // Vertical start of a rectangle
    [[801, 550], [450, 1], 'gray'],   // Horizontal bottom of the same rectangle
    // [[1250, 100], [1, 450], 'gray'],  // Vertical end of the same rectangle
    [[800, 100], [450, 1], 'gray'],   // Horizontal top of the same rectangle

    [[900, 50], [1, 500], 'silver'],  // Vertical start of a rectangle
    // [[901, 550], [500, 1], 'silver'], // Horizontal bottom of the same rectangle
    [[1400, 50], [1, 500], 'silver'], // Vertical end of the same rectangle
    [[900, 50], [500, 1], 'silver']   // Horizontal top of the same rectangle
];

let boundariesMap = [];
let wallMap = new Map();
let viewAngle = 0;
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        viewAngle -= 1;
        viewAngle = viewAngle < 0 ? 319 : viewAngle;
    } else if (e.key === 'ArrowRight') {
        viewAngle = (viewAngle + 1) % 360;
    }
    console.log(viewAngle)
    draw()
})
document.querySelectorAll('canvas')[0].addEventListener('mousemove', e => draw(e));

function draw(e) {
    boundariesMap = [];
    wallMap = new Map();
    ctx.clearRect(0, 0, 800, 800);
    boundaries.forEach(([p1, p2]) => {
        ctx.fillRect(p1[0], p1[1], p2[0], p2[1])
    });
    origin = e ? { x: e.clientX, y: e.clientY } : origin
    rays.forEach((ray) => {
        if(ray.angle > 70) return;
        let dist = 700;
        let nextPoint = calculateDestination([origin.x, origin.y], dist, ray.angle);
        const intersectedBoundaries = boundaries.filter(([p1, p2]) => doIntersect([origin.x, origin.y], nextPoint, [p1[0], p1[1]], [p1[0] + p2[0], p1[1] + p2[1]]));
        let idx = 'white'
        if (intersectedBoundaries.length > 0) {
            const [_, safeNextPoint] = intersectedBoundaries.reduce(([distance, point], c, i) => {
                const [p1, p2] = c;
                const [x, y] = getIntersectionPoint([origin.x, origin.y], nextPoint, [p1[0], p1[1]], [p1[0] + p2[0], p1[1] + p2[1]]);
                const distanceFromOrigin = euclideanDistance(x, y, origin);
                // const distanceFromOrigin = (Math.abs(x - origin.x) + Math.abs(y - origin.y));
                if (distanceFromOrigin <= distance) {
                    idx = c[2]
                    return [distanceFromOrigin, [x, y]];
                }
                return [distance, point];
            }, [Number.MAX_SAFE_INTEGER, nextPoint]);
            nextPoint = safeNextPoint;
        }
        // const rayAngle = ray.angle - (69 / 2) ;
        const rayAngleRad = ray.angle * (Math.PI / 180); // Convert to radians
        drawLine(nextPoint[0], nextPoint[1], origin.x, origin.y);
        let distFromOrigin = Math.round(euclideanDistance(nextPoint[0], nextPoint[1], origin))// * Math.cos(rayAngleRad);//Math.round(Math.abs(nextPoint[0] - origin.x) + Math.abs(nextPoint[1] - origin.y));
       boundariesMap.push([distFromOrigin, idx])
        // distFromOrigin = Math.abs(800 - distFromOrigin);
        if (wallMap.has(idx)) {
            wallMap.set(idx, [...wallMap.get(idx), distFromOrigin].sort((a,b) => a- b))
        } else {
            wallMap.set(idx, [distFromOrigin])
        }
    });
    renderscene();
    console.log(boundariesMap)
}
function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.closePath();
}

function onSegment(p, q, r) {
    return q[0] <= Math.max(p[0], r[0]) && q[0] >= Math.min(p[0], r[0]) &&
        q[1] <= Math.max(p[1], r[1]) && q[1] >= Math.min(p[1], r[1]);
}

function intersectOrigin(p, q, r) {
    let val = (q[1] - p[1]) * (r[0] - q[0]) - (q[0] - p[0]) * (r[1] - q[1]);
    if (val === 0) return 0;
    return (val > 0) ? 1 : 2;
}

function doIntersect(p1, q1, p2, q2) {
    let o1 = intersectOrigin(p1, q1, p2);
    let o2 = intersectOrigin(p1, q1, q2);
    let o3 = intersectOrigin(p2, q2, p1);
    let o4 = intersectOrigin(p2, q2, q1);
    if (o1 !== o2 && o3 !== o4)
        return true;
    if (o1 === 0 && onSegment(p1, p2, q1)) return true;
    if (o2 === 0 && onSegment(p1, q2, q1)) return true;
    if (o3 === 0 && onSegment(p2, p1, q2)) return true;
    if (o4 === 0 && onSegment(p2, q1, q2)) return true;
    return false;
}
function getIntersectionPoint(p1, q1, p2, q2) {
    const a1 = q1[1] - p1[1];
    const b1 = p1[0] - q1[0];
    const c1 = a1 * p1[0] + b1 * p1[1];
    const a2 = q2[1] - p2[1];
    const b2 = p2[0] - q2[0];
    const c2 = a2 * p2[0] + b2 * p2[1];
    const d = a1 * b2 - a2 * b1;
    if (d === 0) {
        return null;
    } else {
        const x = (b2 * c1 - b1 * c2) / d;
        const y = (a1 * c2 - a2 * c1) / d;
        return [x, y];
    }
}


const ctxScreen = document.querySelectorAll('canvas')[1].getContext("2d");

function renderscene() {
    ctxScreen.clearRect(0, 0, 2000, 2000);
    for (let i = 0; i < boundariesMap.length; i++) {
        const [height, color] = boundariesMap[i];
        // const column = i +1;
        const projectedSliceHeigh = (128 / height) * 255;
        const fromTop = 200 - (projectedSliceHeigh / 2);
        console.log(fromTop)
        ctxScreen.fillStyle = color;
        ctxScreen.fillRect(i * 5 , fromTop , 5, projectedSliceHeigh);
    }
}
