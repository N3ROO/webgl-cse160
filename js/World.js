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
        this.shapes = [];
        this.gameLoop = null;
        this.textures = textures;
        this.camera = new Camera(gl,
            0, 0, 5,
            0, 0, 0,
            0, 0, -1,
            Camera.FIRST_PERSON);
        this.camera.rotateY(-90);
    }

    /**
     * It creates the world
     */
    create () {

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
            let factor = 0.1;

            let dx = this.mouse.getDeltaPos()[0];
            let dy = - this.mouse.getDeltaPos()[1];

            dx *= factor;
            dy *= factor;

            this.camera.rotateX(Math.max(Math.min(dy, 90), -90));
            this.camera.rotateY(dx);
            this.camera.apply();
        }

        let step = 10 * dt;
        if (this.keyboard.isDown(Keyboard.K_UP)) this.camera.moveForward(step);
        if (this.keyboard.isDown(Keyboard.K_DOWN)) this.camera.moveBackward(step);
        if (this.keyboard.isDown(Keyboard.K_RIGHT)) this.camera.moveRight(step);
        if (this.keyboard.isDown(Keyboard.K_LEFT)) this.camera.moveLeft(step);
        this.camera.apply();

        this.mouse.recordLastPos(this.mouse.getMovingPos());

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
}