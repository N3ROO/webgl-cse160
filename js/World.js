/**
 * (c) 2020 Lilian Gallon, MIT License
 * File creation: 02/14/2020
 * UCSC, CSE160, Winter 2020
 * https://nero.dev
 *
 * Required:
 *  - Nothing
 *
 * Description:
 *  Utility class for mouse events
 */

class World {

    constructor (gl, mouse, keyboard) {
        this.gl = gl;
        this.mouse = mouse;
        this.keyboard = keyboard;

        // Camera info
        this.cameraX = 15;
        this.cameraY = 10;
        this.cameraZ = -15;

        this.cameraPitch = 0;
        this.cameraYaw = 0;
        this.cameraRoll = 0;

        this.targetX = 0;
        this.targetY = 0;
        this.targetZ = 0;

        this.u_GlobalMatrix = this.gl.getUniformLocation(this.gl.program, 'u_GlobalMatrix');

        // Shapes
        this.shapes = [];

        // Misc
        this.gameLoop = null;
    }

    create () {
        this.updateGlobalMatrix();

        this.shapes.push(new Fox(this.gl, new Matrix4()));
        this.shapes.push(new Axis(this.gl, [1,0,0], [0,1,0], [0,0,1]));
        this.shapes.push(new Cube(this.gl, (new Matrix4()).translate(0,-0.01,0).scale(20, 0.01, 20), [0.0, 0.6, 0.3]));

        this.gameLoop = new GameLoop(dt => this.update(dt), dt => this.render(dt));
        this.gameLoop.start();
    }

    update (dt) {
        // Keyboard
        this.getFox().move(
            this.keyboard.isDown(Keyboard.K_UP),
            this.keyboard.isDown(Keyboard.K_DOWN),
            this.keyboard.isDown(Keyboard.K_RIGHT),
            this.keyboard.isDown(Keyboard.K_LEFT)
        );

        this.getFox().run(
            this.keyboard.isDown(Keyboard.K_SHIFT)
        );

        if (this.keyboard.isDown(Keyboard.K_SPACE)) {
            this.getFox().jump();
        }

        if (this.keyboard.justUp()) {
            if(!this.keyboard.isDown(Keyboard.K_UP) &&
                !this.keyboard.isDown(Keyboard.K_DOWN) &&
                !this.keyboard.isDown(Keyboard.K_RIGHT) &&
                !this.keyboard.isDown(Keyboard.K_LEFT)) {

                    if (this.getFox().isMoving()) {
                    this.getFox().stopMoving();
                    this.resetButtons();
                }
            }
        }

        if (this.getFox().isMoving()) {
            if (C_FOLLOW) {
                this.followShape(this.getFox(), 0, - getPosition(this.getFox().getDefaultMatrix())[1], 0);
            }
        }

        // Mouse
        if (this.mouse.isDown()) {
            let factor = 0.1;

            let dx = this.mouse.getDeltaPos()[0];
            let dy = - this.mouse.getDeltaPos()[1];

            dx *= factor;
            dy *= factor;

            this.cameraPitch = Math.max(Math.min(this.cameraPitch + dy, 90), -90);
            this.cameraYaw += dx;
            this.updateGlobalMatrix();
        }

        // Update shapes
        for (let shape of this.shapes) {
            if (!C_AXIS && shape instanceof Axis) continue;
            if (!C_FLOOR && shape instanceof Cube) continue;
            shape.update(dt);
        }
    }

    render (dt) {
        clear(this.gl)

        for (let shape of this.shapes) {
            if (!C_AXIS && shape instanceof Axis) continue;
            if (!C_FLOOR && shape instanceof Cube) continue;
            shape.build();
            shape.draw();
        }
    }

    // To remove

    resetButtons () {
        getElement("feet-anim").innerHTML = FEET_ANIM_S;
        getElement("tail-anim-1").innerHTML = TAIL_ANIM_1_S;
        getElement("tail-anim-2").innerHTML = TAIL_ANIM_2_S;
        getElement("tail-anim-n").innerHTML = TAIL_ANIM_N_S;
        getElement("feet-anim").disabled = false;
        getElement("tail-anim-1").disabled = false;
        getElement("tail-anim-2").disabled = false;
        getElement("tail-anim-n").disabled = false;
    }

    getFox () {
        return this.shapes[0];
    }

    // Utility

    resetCamera () {
        this.cameraX = 15;
        this.cameraY = 10;
        this.cameraZ = -15;

        this.cameraPitch = 0;
        this.cameraYaw = 0;
        this.cameraRoll = 0;

        this.targetX = 0;
        this.targetY = 0;
        this.targetZ = 0;

        this.updateGlobalMatrix();
    }

    followShape (shape, dx, dy, dz) {
        let pos = getPosition(shape.matrix);
        this.targetX = pos[0] + dx;
        this.targetY = pos[1] + dy;
        this.targetZ = pos[2] + dz;
        this.updateGlobalMatrix();
    }

    updateGlobalMatrix () {
        let globalMatrix = new Matrix4();
        globalMatrix.setPerspective(30, 1, 1, 100);
        globalMatrix.lookAt(
            this.cameraX, this.cameraY, this.cameraZ,
            0, 0, 0,
            0, 1, 0);
        globalMatrix.rotate(this.cameraPitch, 1, 0, 0);
        globalMatrix.rotate(this.cameraYaw, 0, 1, 0);
        globalMatrix.rotate(this.cameraRoll, 0, 0, 1);
        globalMatrix.translate(- this.targetX, - this.targetY, - this.targetZ);
        this.gl.uniformMatrix4fv(this.u_GlobalMatrix, false, globalMatrix.elements);
    }

}

// To remove
const FEET_ANIM_S = "Animate the feet";
const FEET_ANIM_E = "Stop feet animation";
const TAIL_ANIM_1_S = "Animate the tail (1st part)";
const TAIL_ANIM_1_E = "Stop tail animation (1st part)";
const TAIL_ANIM_2_S = "Animate the tail (2nd part)";
const TAIL_ANIM_2_E = "Stop tail animation (2nd part)";
const TAIL_ANIM_N_S = "Animate the tail (both parts)";
const TAIL_ANIM_N_E = "Stop tail animation (both parts)";