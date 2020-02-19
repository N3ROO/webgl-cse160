/**
 * (c) 2020 Lilian Gallon, MIT License
 * File creation: 02/14/2020
 * UCSC, CSE160, Winter 2020
 * https://nero.dev
 *
 * Required:
 *  - libs/cuon*.js
 *  - libs/webgl*.js
 *
 * Description:
 *  The main class that handle everything.
 */

class World {

    /**
     * It initializes all the needed attributes. You need
     * to call create() to create the world.
     *
     * @param {WebGL2RenderingContext} gl
     * @param {Mouse} mouse
     * @param {Keyboard} keyboard
     * @param {TextureManager} textures
     */
    constructor (gl, mouse, keyboard, textures) {
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

        this.textures = textures;
    }

    /**
     * It creates the world
     */
    create () {
        this.updateGlobalMatrix();

        // this.shapes.push(new Fox(this.gl, new Matrix4()));
        this.shapes.push(new Axis(this.gl, [1,0,0], [0,1,0], [0,0,1]));
        this.shapes.push(new Cube(this.gl, new Matrix4(), this.textures.getTexture('stone')));

        this.gameLoop = new GameLoop(dt => this._update(dt), dt => this._render(dt));
        this.gameLoop.start();
    }

    /**
     * @param {float} dt time difference since last update
     */
    _update (dt) {
        // Mouse events //
        if (this.mouse.isDown()) {
            let factor = 0.3;

            let dx = this.mouse.getDeltaPos()[0];
            let dy = - this.mouse.getDeltaPos()[1];

            dx *= factor;
            dy *= factor;

            this.cameraPitch = Math.max(Math.min(this.cameraPitch + dy, 90), -90);
            this.cameraYaw += dx;
            this.updateGlobalMatrix();

            this.mouse.recordLastPos(this.mouse.getMovingPos());
        }

        // Update shapes //
        for (let shape of this.shapes) {
            if (!C_AXIS && shape instanceof Axis) continue;
            shape.update(dt);
        }
    }

    /**
     * @param {float} dt time difference since last update
     */
    _render (dt) {
        this.clear();

        for (let shape of this.shapes) {
            if (!C_AXIS && shape instanceof Axis) continue;
            shape.build();
            shape.draw();
        }
    }

    // Utility

    /**
     * It clears the screen.
     */
    clear() {
        this.gl.clearColor(0.0, 0.4, 1.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }

    /**
     * It resets the camera to its default position.
     */
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

    /**
     * It updates the camera to follow the specified shape.
     *
     * @param {Shape} shape
     * @param {float} dx delta x from the shape's x position
     * @param {float} dy delta y from the shape's x position
     * @param {float} dz delta z from the shape's x position
     */
    followShape (shape, dx, dy, dz) {
        let pos = getPosition(shape.matrix);
        this.targetX = pos[0] + dx;
        this.targetY = pos[1] + dy;
        this.targetZ = pos[2] + dz;
        this.updateGlobalMatrix();
    }

    /**
     * It updates the global matrix (the camera).
     */
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