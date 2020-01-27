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

    //// INIT ////

    // Global matrix
    let u_GlobalMatrix = gl.getUniformLocation(gl.program, 'u_GlobalMatrix');

    let globalMatrix = new Matrix4();
    globalMatrix.setPerspective(30, 1, 1, 100);
    globalMatrix.lookAt(3, 3, 7, 0, 0, 0, 0, 1, 0);

    gl.uniformMatrix4fv(u_GlobalMatrix, false, globalMatrix.elements);

    // Cubes
    let cubes = [];
    let cube = new Cube(gl, new Matrix4());
    cubes.push(cube);

    //// LOOP ////

    let last = timestamp();
    let dt = 0;
    let step = 1/60; // We want 60 fps

    let fpsmeter = new FPSMeter({ decimals: 0, graph: true, theme: 'transparent', left: '10px', top: '10px' });

    function tick() {
        fpsmeter.tickStart();

        let now = timestamp();
        dt = dt + Math.min(1, (now - last) / 1000);

        while (dt > step) {
            dt = dt - step;
            update(step);
        }

        render(dt);

        fpsmeter.tick();

        last = now;
        requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);

    //// UPDATE ////

    function update(dt) {
        globalMatrix.rotate(10 * dt, -1, 0.5, 0.5);
        gl.uniformMatrix4fv(u_GlobalMatrix, false, globalMatrix.elements);
    }

    //// RENDER ////

    function render(dt) {
        clear(gl)

        for (let cube of cubes) {
            cube.build();
            cube.draw();
        }
    }
}