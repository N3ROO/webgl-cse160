/**
 * (c) 2020 Lilian Gallon, MIT License
 * File creation: 01/23/2020
 * UCSC, CSE160, Winter 2020
 * https://nero.dev
 *
 * Required:
 *  TODO:
 *
 * Description:
 *  TODO:
 */

// Controls
var C_CLEAR_BUTTON = 'clear';
var C_DRAWING_MODE = 0;
var C_RED = 0.5;
var C_GREEN = 0.0;
var C_BLUE = 1.0;
var C_SIZE = 40.0;
var C_SEGS = 10;
var C_DELAY = 100;

// Translation
var C_TX = 0.0;
var C_TY = 0.0;
var C_STEP = 0.01;

// Magic numbers (used by C_DRAWING_MODE)
var M_SQUARE = 0;
var M_TRIANGLE = 1;
var M_CIRCLE = 2;

/**
 * It updates the values of the global variables, and it also
 * updates the preview color.
 */
function updateColors() {
    let r = getElement('red');
    let g = getElement('green');
    let b = getElement('blue');
    let p = getElement('color-preview');

    C_RED = r.value;
    C_GREEN = g.value;
    C_BLUE = b.value;

    p.style.background = "rgb(" + C_RED*255 + "," + C_GREEN*255 + "," + C_BLUE*255 + ")"
}