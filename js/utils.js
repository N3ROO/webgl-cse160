/**
 * (c) 2020 Lilian Gallon, MIT License
 * File creation: 01/23/2020
 * UCSC, CSE160, Winter 2020
 * https://nero.dev
 *
 * Required:
 *  Nothing.
 *
 * Description:
 *  Here goes all the functions that we will use multiple
 *  times. These functions should not change for every case
 *  use. In fact, they are meant to work for any use.
 */

 /**
 * From coordinates on the canvas, it returns the coordinates on the
 * WebGL world.
 * @param {Float} x x canvas coordinate
 * @param {Float} y y canvas coordinate
 * @param {Array} r bounding rect of cursor
 * @param {Float} worldX world x (if the center of the canvas is not 0,0)
 * @param {Float} worldY world y (if the center of the canvas is not 0,0)
 *
 * @returns A 2D array containing [x, y], the coordinates in the WebGL world
 */
function canvasToWebglCoords(x, y, r, worldX=0.0, worldY=0.0) {
    let c = getElement(CANVAS_ID);

    return [
        ((x - r.left) - c.height/2) / (c.height/2) - worldX,
        (c.width/2 - (y - r.top)) / (c.width/2) - worldY
    ];
}

/**
 * It clears the screen to black.
 * @param {WebGL2RenderingContext} gl WebGL context
 */
function clear(gl) {
    gl.clearColor(0.0, 0.4, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

/**
 * It returns the element with the specified id. It writes an
 * error if the id could not be found.
 *
 * ERROR:
 * It returns null if the element could not be found.
 */
function getElement(id) {
    let elem = document.getElementById(id);
    if (!elem) {
        console.error('Could not find canvas with id "' + id + '"');
        return null;
    }

    return elem;
}

/**
 * This function returns true if the delay has been reached.
 * @param {*} time time to compare (ms),
 * @param {*} delay delay (ms).
 */
function delayReached(time, delay) {
    return Date.now() - time >= delay;
}

/**
 * This functions returns true if the given square is outside of
 * the screen.
 * @param {*} x position of the middle of the square (x)
 * @param {*} y position of the middle of the square (y)
 * @param {*} width width of the square
 * @param {*} height height of the square
 * @param {*} worldX world x (if the center of the canvas is not 0,0)
 * @param {*} worldY world y (if the center of the canvas is not 0,0)
 */
function outsideOfScreen(x, y, width, height, worldX, worldY) {
    return ( (x + width/2 + worldX < - 1.0) || // out left
        (x - width/2 + worldX > + 1.0) || // out right
        (y + height/2 + worldY < - 1.0) || // out bottom
        (y - height/2 + worldY > + 1.0)    // out top
    )
}

/**
 * Returns the timestamp in ms.
 */
function timestamp() {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}

/**
 * Returns true if the arrays are the same.
 * @param {Float32Array} source
 * @param {Float32Array} target
 */
function float32Equals(source, target) {
    if (source === null || target === null) return false;
    if (source.length !== target.length) return false;
    for (let i = 0; i < source.length; i++) {
        if (source[i] !== target[i]) return false;
    }
    return true;
}

/**
 * Returns the (x, y, z) coordinates from a 4x4 matrix.
 * @param {Matrix4} matrix
 */
function getPosition(matrix) {
    return [matrix.elements[12], matrix.elements[13], matrix.elements[14]];
}