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
    // It looks good this way
    globalMatrix.setPerspective(30, 1, 1, 100);
    // Eye placed at (x, y, z), looking at (x, y, z) with the up vector being (x, y ,z)
    // Here: Eye (x=0, y=0, z=-10) looking at the center with  he up vector being Y positive
    globalMatrix.lookAt(0, 10, -20, 0, 0, 0, 0, 1, 0);

    gl.uniformMatrix4fv(u_GlobalMatrix, false, globalMatrix.elements);

    // Cubes
    let shapes = [];
    shapes.push(new Fox(gl, new Matrix4()));
    shapes.push(new Axis(gl, [1,0,0], [0,1,0], [0,0,1])); // Needs to be at the end for performance improvements

    //// LOOP ////

    let last = timestamp();
    let dt = 0;
    let step = 1/60; // -> We want 60 updates per seconds

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
        //globalMatrix.rotate(10 * dt, -1, 0.5, 0.5);
        //gl.uniformMatrix4fv(u_GlobalMatrix, false, globalMatrix.elements);

        let dx = 0;
        let dy = 0;

        if (KEYS.UP)    dy = -0.4 * dt;
        if (KEYS.DOWN)  dy =  0.4 * dt;
        if (KEYS.RIGHT) dx =  0.4 * dt;
        if (KEYS.LEFT)  dx = -0.4 * dt;

        if (dx !== 0 || dy !== 0) {
            globalMatrix.translate(dx, dy, 0);
            gl.uniformMatrix4fv(u_GlobalMatrix, false, globalMatrix.elements);
        }
    }

    //// RENDER ////

    function render(dt) {
        clear(gl)

        for (let shape of shapes) {
            shape.build();
            shape.draw();
        }
    }

    //// MOUSE ////

    getElement(CANVAS_ID).onmousemove = e => {
        if(M_DOWN) {
            let lastCoords = canvasToWebglCoords(M_DX, M_DY, M_DR, 0, 0);
            let currCoords = canvasToWebglCoords(e.clientX, e.clientY, e.target.getBoundingClientRect(), 0, 0);
            let factor = 50;

            let dx = factor * (currCoords[0] - lastCoords[0]);
            let dy = factor * (currCoords[1] - lastCoords[1]);

            globalMatrix = globalMatrix.rotate(dy, 1, 0, 0);
            globalMatrix = globalMatrix.rotate(dx, 0, 1, 0);
            gl.uniformMatrix4fv(u_GlobalMatrix, false, globalMatrix.elements);

            M_DX = e.clientX;
            M_DY = e.clientY;
        }
    };

    //// KEYBOARD ////
}