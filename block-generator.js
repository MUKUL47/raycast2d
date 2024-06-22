const BLOCK_WIDTH = 45;
document.querySelector('canvas').addEventListener('click', e => {
    boundaries.push([[e.clientX+2, e.clientY+2], [BLOCK_WIDTH, 2], getRandColor()]);
    boundaries.push([[e.clientX + BLOCK_WIDTH, e.clientY+2], [2, BLOCK_WIDTH], getRandColor()]);
    boundaries.push([[e.clientX+2, e.clientY+ BLOCK_WIDTH], [BLOCK_WIDTH, 2], getRandColor()]);
    boundaries.push([[e.clientX+2, e.clientY+2], [2, BLOCK_WIDTH], getRandColor()]);
    draw()
})