/**
 * (c) 2020 Lilian Gallon, MIT License
 * File creation: 01/23/2020
 * UCSC, CSE160, Winter 2020
 * https://nero.dev
 *
 * Required:
 * - libs/
 * - init.js
 * - utils.js
 * - input.js
 *
 * Description:
 *  It contains the code to create, and draw things on the screen.
 */

 /**
 * Called once everything has been initialized.
 *
 * @param {WebGL2RenderingContext} gl WebGL Context
 */
function main(gl) {

    // MVP MATRIX
    let u_MvpMatrix = gl.getUniformLocation(gl.program, 'u_MvpMatrix');

    let mvpMatrix = new Matrix4();
    mvpMatrix.setPerspective(30, 1, 1, 100);
    mvpMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);

    gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

    let cube = new Cube(gl);

    let last = Date.now();
    let frames = 0;

    function tick() {

        clear(gl);

        mvpMatrix.rotate(1, 1, 0, 1);
        gl.uniformMatrix4fv(u_MvpMatrix, false, mvpMatrix.elements);

        cube.build();
        cube.draw();

        if(delayReached(last, 1000)) {
            (async() => {
                try {
                    getElement('stats').innerHTML = frames + ' fps';
                    last = Date.now();
                    frames = 0;
                } catch (err) {
                    console.log(err);
                }
            })();
        }

        frames++;
        requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
}

function clear(gl) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
}

function timestamp() {
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
}