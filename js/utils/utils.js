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
 * Warning: It only works in 2D. TODO: update it for 3D?
 *
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