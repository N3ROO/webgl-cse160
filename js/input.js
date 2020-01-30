/**
 * (c) 2020 Lilian Gallon, MIT License
 * File creation: 01/23/2020
 * UCSC, CSE160, Winter 2020
 * https://nero.dev
 *
 * Required:
 *  - utils.js
 *
 * Description:
 *  It contains variables and functions which keep track of the
 *  user's input.
 */

//// CONTROLS ////
var C_AXIS = true;

//// MOUSE EVENTS ////
var M_DOWN = false;
var M_DX = null;
var M_DY = null;
var M_DR = null;
var M_UX = null;
var M_UY = null;
var M_UR = null;

//// KEYBOARD EVENTS ////
var KEYS = {
    UP: false,
    DOWN: false,
    RIGHT: false,
    LEFT: false
};


/**
 * It updates the statistics tag.
 * @param {*} shapesDrawn number of shapes drawn,
 * @param {*} timeElapsed time it took to draw them.
 */
function updateStatistics(shapesDrawn, timeElapsed) {
    getElement('stats').innerText = shapesDrawn + " shape(s) drawn in " + timeElapsed + " ms.";

    let color = "grey";
    if (timeElapsed <= 50) {
        color = "green";
    } else if (timeElapsed > 50 && timeElapsed < 80) {
        color = "orange";
    } else {
        color = "red";
    }

    getElement('stats').style.color = color;
}

getElement(CANVAS_ID).onmousedown = e => {
    M_DOWN = true;
    M_DX = e.clientX;
    M_DY = e.clientY;
    M_DR = e.target.getBoundingClientRect();
}

getElement(CANVAS_ID).onmouseup = e => {
    M_DOWN = false;
    M_UX = e.clientX;
    M_UY = e.clientY;
    M_UR = e.target.getBoundingClientRect();
}

getElement(CANVAS_ID).onkeydown = e => {
    console.log(e.keyCode);
    if (e.keyCode === 37 || e.keyCode === 65) KEYS.LEFT = true;
    if (e.keyCode === 38 || e.keyCode === 87) KEYS.UP = true;
    if (e.keyCode === 39 || e.keyCode === 68) KEYS.RIGHT = true;
    if (e.keyCode === 40 || e.keyCode === 83) KEYS.DOWN = true;
}

getElement(CANVAS_ID).onkeyup = e => {
    if (e.keyCode === 37 || e.keyCode === 65) KEYS.LEFT = false;
    if (e.keyCode === 38 || e.keyCode === 87) KEYS.UP = false;
    if (e.keyCode === 39 || e.keyCode === 68) KEYS.RIGHT = false;
    if (e.keyCode === 40 || e.keyCode === 83) KEYS.DOWN = false;
}