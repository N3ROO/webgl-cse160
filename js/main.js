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

    const CAMERA_X = 15;
    const CAMERA_Y = 10;
    const CAMERA_Z = -15;

    // Global matrix
    let cameraX = CAMERA_X;
    let cameraY = CAMERA_Y;
    let cameraZ = CAMERA_Z;

    let cameraPitch = 0;
    let cameraYaw = 0;
    let cameraRoll = 0;

    let targetX = 0;
    let targetY = 0;
    let targetZ = 0;

    let u_GlobalMatrix = gl.getUniformLocation(gl.program, 'u_GlobalMatrix');

    function updateGlobalMatrix() {
        let globalMatrix = new Matrix4();
        globalMatrix.setPerspective(30, 1, 1, 100);
        globalMatrix.lookAt(
            cameraX, cameraY, cameraZ,
            targetX, targetY, targetZ,
            0, 1, 0);
        globalMatrix.rotate(cameraPitch, 1, 0, 0);
        globalMatrix.rotate(cameraYaw, 0, 1, 0);
        globalMatrix.rotate(cameraRoll, 0, 0, 1);

        gl.uniformMatrix4fv(u_GlobalMatrix, false, globalMatrix.elements);
    }

    updateGlobalMatrix();

    // Shapes
    let shapes = [];
    shapes.push(new Fox(gl, new Matrix4()));
    shapes.push(new Axis(gl, [1,0,0], [0,1,0], [0,0,1]));
    shapes.push(new Cube(gl, (new Matrix4()).translate(0,-0.01,0).scale(20, 0.01, 20), [0.8, 0.8, 0.8]));

    function getFox() {
        return shapes[0];
    }

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

    function update(dt) {
        // Camera translation
        let dx = 0;
        let dy = 0;

        if (KEYS.CAMERA_UP)    dy =  5 * dt;
        if (KEYS.CAMERA_DOWN)  dy = -5 * dt;
        if (KEYS.CAMERA_RIGHT) dx = -5 * dt;
        if (KEYS.CAMERA_LEFT)  dx =  5 * dt;

        if (dx !== 0 || dy !== 0) {
            cameraX += dx;
            cameraY += dy;
            updateGlobalMatrix();
        }

        // Fox movements
        getFox().move(KEYS.ANIMAL_UP, KEYS.ANIMAL_DOWN, KEYS.ANIMAL_RIGHT, KEYS.ANIMAL_LEFT)
        if (getFox().isMoving() && C_FOLLOW) {
            followShape(getFox(), 0, 0, 2);
        }

        // Update shapes
        for (let shape of shapes) {
            if (!C_AXIS && shape instanceof Axis) continue;
            if (!C_FLOOR && shape instanceof Cube) continue;
            shape.update(dt);
        }
    }

    function followShape(shape, dx, dy, dz) {
        // reset to def pos
        cameraPitch = cameraYaw = 0;
        cameraX = CAMERA_X;
        cameraY = CAMERA_Y;
        cameraZ = CAMERA_Z;

        let pos = getPosition(shape.matrix);
        targetX = pos[0] + dx;
        targetY = pos[1] + dy;
        targetZ = pos[2] + dz;
        updateGlobalMatrix();
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

            cameraPitch += dy;
            cameraYaw += dx;
            updateGlobalMatrix();

            M_DX = e.clientX;
            M_DY = e.clientY;
        }
    };

    //// KEYBOARD ////

    getElement(CANVAS_ID).onkeydown = e => {
        if (e.keyCode === 37) KEYS.CAMERA_LEFT = true;
        if (e.keyCode === 38) KEYS.CAMERA_UP = true;
        if (e.keyCode === 39) KEYS.CAMERA_RIGHT = true;
        if (e.keyCode === 40) KEYS.CAMERA_DOWN = true;

        if (e.keyCode === 65) KEYS.ANIMAL_LEFT = true;
        if (e.keyCode === 87) KEYS.ANIMAL_UP = true;
        if (e.keyCode === 68) KEYS.ANIMAL_RIGHT = true;
        if (e.keyCode === 83) KEYS.ANIMAL_DOWN = true;

        if (e.keyCode === 32) {
            getFox().jump();
        }

        e.preventDefault();
    }

    getElement(CANVAS_ID).onkeyup = e => {
        if (e.keyCode === 37) KEYS.CAMERA_LEFT = false;
        if (e.keyCode === 38) KEYS.CAMERA_UP = false;
        if (e.keyCode === 39) KEYS.CAMERA_RIGHT = false;
        if (e.keyCode === 40) KEYS.CAMERA_DOWN = false;

        if (e.keyCode === 65) KEYS.ANIMAL_LEFT = false;
        if (e.keyCode === 87) KEYS.ANIMAL_UP = false;
        if (e.keyCode === 68) KEYS.ANIMAL_RIGHT = false;
        if (e.keyCode === 83) KEYS.ANIMAL_DOWN = false;

        if (!KEYS.ANIMAL_LEFT && !KEYS.ANIMAL_UP && !KEYS.ANIMAL_RIGHT && !KEYS.ANIMAL_DOWN) {
            if (getFox().isMoving()) {
                getFox().stopMoving();
            }
        }

        e.preventDefault();
    }
}