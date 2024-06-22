function getWallheight(angle, distance, screenWidth, screenHeight) {
    const radians = Math.PI/3;
    const columnOffset = distance - (screenWidth / 2);
    const angleOffset = (columnOffset/screenWidth) * radians;
    const rayAngle = angle + angleOffset;
    const diff = rayAngle - angle;
    return screenHeight / distance * Math.cos(diff)
}
function euclideanDistance(x, y, origin) {
    const dx = x - origin.x;
    const dy = y - origin.y;
    return Math.sqrt(dx ** 2 + dy ** 2);
}