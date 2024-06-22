function euclideanDistance(x, y, origin) {
    const dx = x - origin.x;
    const dy = y - origin.y;
    return Math.sqrt(dx ** 2 + dy ** 2);
}
function getRotationAngle(origin, angle, distance) {
    const [o1, o2] = origin;
    const cX = distance * Math.cos(angle);
    const cY = distance * Math.sin(angle);
    return [cX + o1, cY + o2];
}
function onSegment(p, q, r) {
    return q[0] <= Math.max(p[0], r[0]) && q[0] >= Math.min(p[0], r[0]) &&
        q[1] <= Math.max(p[1], r[1]) && q[1] >= Math.min(p[1], r[1]);
}
function angleBetweenTwoPoints(p1, p2) {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x);
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
function calculateDestination(source, distance, degree) {
    const radians = degree * (Math.PI / 180);
    const x_destination = source[0] + distance * Math.cos(radians);
    const y_destination = source[1] + distance * Math.sin(radians);
    return [x_destination, y_destination];
}