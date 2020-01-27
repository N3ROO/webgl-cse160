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