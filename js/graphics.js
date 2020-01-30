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
    shapes.push(new Cube(gl, (new Matrix4()).translate(0,-0.01,0).scale(20, 0.01, 20), [0.8, 0.8, 0.8]));

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

    let KEY_MOVE = false; // TODO: remove test
    let a = 0;

    function update(dt) {
        //shapes[0].getMatrix().rotate(10*dt, -1, 0.5, 0.5);
        //shapes[0].requestUpdate();
        //gl.uniformMatrix4fv(u_GlobalMatrix, false, globalMatrix.elements);

        let dx = 0;
        let dy = 0;

        if (KEYS.UP)    dy = -5 * dt;
        if (KEYS.DOWN)  dy =  5 * dt;
        if (KEYS.RIGHT) dx =  5 * dt;
        if (KEYS.LEFT)  dx = -5 * dt;
        if (KEY_MOVE) shapes[0].move();

        if (dx !== 0 || dy !== 0) {
            globalMatrix.translate(dx, dy, 0);
            gl.uniformMatrix4fv(u_GlobalMatrix, false, globalMatrix.elements);
        }

        for (let shape of shapes) {
            if (!C_AXIS && shape instanceof Axis) continue;
            if (!C_FLOOR && shape instanceof Cube) continue;
            shape.update(dt);
        }
    }

    //// RENDER ////

    function render(dt) {
        clear(gl)

        for (let shape of shapes) {
            if (!C_AXIS && shape instanceof Axis) continue;
            if (!C_FLOOR && shape instanceof Cube) continue;
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

    getElement(CANVAS_ID).onkeydown = e => {
        if (e.keyCode === 76) KEY_MOVE = true;
        if (e.keyCode === 37 || e.keyCode === 65) KEYS.LEFT = true;
        if (e.keyCode === 38 || e.keyCode === 87) KEYS.UP = true;
        if (e.keyCode === 39 || e.keyCode === 68) KEYS.RIGHT = true;
        if (e.keyCode === 40 || e.keyCode === 83) KEYS.DOWN = true;
    }

    getElement(CANVAS_ID).onkeyup = e => {
        if (e.keyCode === 76) {
            shapes[0].stopMoving();
            KEY_MOVE = false;
        }
        if (e.keyCode === 37 || e.keyCode === 65) KEYS.LEFT = false;
        if (e.keyCode === 38 || e.keyCode === 87) KEYS.UP = false;
        if (e.keyCode === 39 || e.keyCode === 68) KEYS.RIGHT = false;
        if (e.keyCode === 40 || e.keyCode === 83) KEYS.DOWN = false;
    }
}