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
            CAMERA_X, CAMERA_Y, CAMERA_Z,
            0, 0, 0,
            0, 1, 0);
            globalMatrix.rotate(cameraPitch, 1, 0, 0);
            globalMatrix.rotate(cameraYaw, 0, 1, 0);
            globalMatrix.rotate(cameraRoll, 0, 0, 1);
            globalMatrix.translate(-targetX, -targetY, -targetZ);

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

    function update(dt) {

        // Fox movements
        getFox().move(KEYS.ANIMAL_UP, KEYS.ANIMAL_DOWN, KEYS.ANIMAL_RIGHT, KEYS.ANIMAL_LEFT);
        if (getFox().isMoving()) {
            getElement("feet-anim").disabled = true;
            getElement("tail-anim-n").disabled = true;
            getElement("tail-anim-1").disabled = true;
            getElement("tail-anim-2").disabled = true;

            if (C_FOLLOW) {
                followShape(getFox(), 0, 0, 2);
            }
        }

        // Update shapes
        for (let shape of shapes) {
            if (!C_AXIS && shape instanceof Axis) continue;
            if (!C_FLOOR && shape instanceof Cube) continue;
            shape.update(dt);
        }
    }

    function followShape(shape, dx, dy, dz) {
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

            cameraPitch = Math.max(Math.min(cameraPitch + dy, 90), -90);
            cameraYaw += dx;
            updateGlobalMatrix();

            M_DX = e.clientX;
            M_DY = e.clientY;
        }
    };

    //// KEYBOARD ////

    getElement(CANVAS_ID).onkeydown = e => {
        // if (e.keyCode === 37) KEYS.todo = true;
        // if (e.keyCode === 38) KEYS.todo = true;
        // if (e.keyCode === 39) KEYS.todo = true;
        // if (e.keyCode === 40) KEYS.todo = true;

        if (e.keyCode === 65) KEYS.ANIMAL_LEFT = true;
        if (e.keyCode === 87) KEYS.ANIMAL_UP = true;
        if (e.keyCode === 68) KEYS.ANIMAL_RIGHT = true;
        if (e.keyCode === 83) KEYS.ANIMAL_DOWN = true;

        if (e.keyCode === 32) getFox().jump();
        //if (e.keyCode === 16) getFox().sprint(true);

        e.preventDefault();
    }

    getElement(CANVAS_ID).onkeyup = e => {
        // if (e.keyCode === 37) KEYS.todo = false;
        // if (e.keyCode === 38) KEYS.todo = false;
        // if (e.keyCode === 39) KEYS.todo = false;
        // if (e.keyCode === 40) KEYS.todo = false;

        if (e.keyCode === 65) KEYS.ANIMAL_LEFT = false;
        if (e.keyCode === 87) KEYS.ANIMAL_UP = false;
        if (e.keyCode === 68) KEYS.ANIMAL_RIGHT = false;
        if (e.keyCode === 83) KEYS.ANIMAL_DOWN = false;

        //if (e.keyCode === 16) getFox().sprint(false);

        if (!KEYS.ANIMAL_LEFT && !KEYS.ANIMAL_UP && !KEYS.ANIMAL_RIGHT && !KEYS.ANIMAL_DOWN) {
            if (getFox().isMoving()) {
                getFox().stopMoving();

                getElement("feet-anim").innerHTML = FEET_ANIM_S;
                getElement("tail-anim-1").innerHTML = TAIL_ANIM_1_S;
                getElement("tail-anim-2").innerHTML = TAIL_ANIM_2_S;
                getElement("tail-anim-n").innerHTML = TAIL_ANIM_N_S;
                getElement("feet-anim").disabled = false;
                getElement("tail-anim-1").disabled = false;
                getElement("tail-anim-2").disabled = false;
                getElement("tail-anim-n").disabled = false;
            }
        }

        e.preventDefault();
    }

    //// BUTTONS ////
    const FEET_ANIM_S = "Animate the feet";
    const FEET_ANIM_E = "Stop feet animation";
    const TAIL_ANIM_1_S = "Animate the tail (1st part)";
    const TAIL_ANIM_1_E = "Stop tail animation (1st part)";
    const TAIL_ANIM_2_S = "Animate the tail (2nd part)";
    const TAIL_ANIM_2_E = "Stop tail animation (2nd part)";
    const TAIL_ANIM_N_S = "Animate the tail (both parts)";
    const TAIL_ANIM_N_E = "Stop tail animation (both parts)";

    getElement("feet-anim").onclick = e => {
        toggleAnimation(
            getFox().animations.get(K_FEET_ANIM),
            FEET_ANIM_S,
            FEET_ANIM_E,
            e.target
        );
    }

    getElement("tail-anim-1").onclick = e => {
        toggleAnimation(
            getFox().animations.get(K_TAIL_ANIM1),
            TAIL_ANIM_1_S,
            TAIL_ANIM_1_E,
            e.target,
            [getElement("tail-anim-2"), getElement("tail-anim-n")]
        );
    }

    getElement("tail-anim-2").onclick = e => {
        toggleAnimation(
            getFox().animations.get(K_TAIL_ANIM2),
            TAIL_ANIM_2_S,
            TAIL_ANIM_2_E,
            e.target,
            [getElement("tail-anim-1"), getElement("tail-anim-n")]
        );
    }

    getElement("tail-anim-n").onclick = e => {
        toggleAnimation(
            getFox().animations.get(K_TAIL_ANIM1),
            TAIL_ANIM_N_S,
            TAIL_ANIM_N_E,
            [getElement("tail-anim-1"), getElement("tail-anim-2")]
        );

        toggleAnimation(
            getFox().animations.get(K_TAIL_ANIM2),
            TAIL_ANIM_N_S,
            TAIL_ANIM_N_E,
            e.target,
            [getElement("tail-anim-1"), getElement("tail-anim-2")]
        );
    }

    function toggleAnimation(animation, startMsg, endMsg, target, concurrents = []) {
        if (animation.isFinished()) {
            target.innerHTML = endMsg;
            animation.start();
            for (let concurrent of concurrents) concurrent.disabled = true;
        } else {
            target.innerHTML = startMsg;
            animation.stop();
            for (let concurrent of concurrents) concurrent.disabled = false;
        }
    }

    getElement("reset-cam").onclick = e => {
        cameraX = CAMERA_X;
        cameraY = CAMERA_Y;
        cameraZ = CAMERA_Z;

        cameraPitch = 0;
        cameraYaw = 0;
        cameraRoll = 0;

        targetX = 0;
        targetY = 0;
        targetZ = 0;

        updateGlobalMatrix();
    }
}