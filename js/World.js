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
     * @param {Integer} width canvas width
     * @param {Integer} height canvas height
     */
    constructor (gl, mouse, keyboard, textures, width, height) {
        this.gl = gl;
        this.mouse = mouse;
        this.keyboard = keyboard;
        this.shapes = [];
        this.gameLoop = null;
        this.textures = textures;
        this.camera = new Camera(gl,
            -2, 5, 20,
            0, 0, 0,
            90.0, width, height,
            Camera.FIRST_PERSON);
        this.camera.rotateY(-90);

        // Sensibilities
        this.MOUSE_ROTATION_SENS = 5;
        this.KEYBOARD_ROTATION_SENS = 40;
        this.KEYBOARD_MOVING_SEN = 10;
    }

    /**
     * It creates the world
     */
    create () {
        this.shapes.push(new Fox(this.gl, (new Matrix4()).translate(-3, 0, 7).rotate(180, 0, 1, 0).scale(0.3,0.3,0.3)));
        this.shapes.push(new Axis(this.gl, [1,0,0], [0,1,0], [0,0,1]));
        this.shapes.push(new Cube(this.gl, (new Matrix4()).scale(100,100,100), [0, 0, 0.5], this.textures.getTexture('clouds'), 'clouds'));

        for (let shape of WORLD1) {
            let cube;
            let pos = (new Matrix4()).translate(shape.x+0.5, shape.y+0.5, shape.z+0.5).scale(0.5, 0.5, 0.5);
            let texture = this.textures.getTexture(shape.block);
            cube = new Cube(this.gl, pos, null,  texture, shape.block);
            this.shapes.push(cube);
        }

        this.getFox().toggleTailAnimation();

        this.gameLoop = new GameLoop(dt => this._update(dt), dt => this._render(dt));
        this.gameLoop.start();
    }

    /**
     * @param {float} dt time difference since last update
     */
    _update (dt) {
        // Mouse events //
        if (this.mouse.isDown() || this.keyboard.isDown(Keyboard.K_Q) || this.keyboard.isDown(Keyboard.K_E)) {
            let dx = 0;
            let dy = 0;

            if (this.mouse.isDown()) {
                dx = this.mouse.getDeltaPos()[0];
                dy = - this.mouse.getDeltaPos()[1];

                dx *= this.MOUSE_ROTATION_SENS;
                dy *= this.MOUSE_ROTATION_SENS;
            } else if (this.keyboard.isDown(Keyboard.K_Q)) {
                dx = - this.KEYBOARD_ROTATION_SENS;
            } else {
                dx = this.KEYBOARD_ROTATION_SENS;
            }

            dx *= dt;
            dy *= dt;

            this.camera.rotateX(Math.max(Math.min(dy, 90), -90));
            this.camera.rotateY(dx);
        }

        this.mouse.recordLastPos(this.mouse.getMovingPos());

        // Keyboard events //

        // Fox
        this.getFox().move(
            this.keyboard.isDown(Keyboard.K_UP),
            this.keyboard.isDown(Keyboard.K_DOWN),
            this.keyboard.isDown(Keyboard.K_RIGHT),
            this.keyboard.isDown(Keyboard.K_LEFT));

        this.getFox().run(this.keyboard.isDown(Keyboard.K_SHIFT));
        this.getFox().jump(this.keyboard.isDown(Keyboard.K_SPACE));
        this.getFox().breakdance(this.keyboard.isDown(Keyboard.K_CTRL));

        // Camera
        if (this.keyboard.isDown(Keyboard.K_W)) this.camera.moveForward(this.KEYBOARD_MOVING_SEN * dt);
        if (this.keyboard.isDown(Keyboard.K_S)) this.camera.moveBackward(this.KEYBOARD_MOVING_SEN * dt);
        if (this.keyboard.isDown(Keyboard.K_D)) this.camera.moveRight(this.KEYBOARD_MOVING_SEN * dt);
        if (this.keyboard.isDown(Keyboard.K_A)) this.camera.moveLeft(this.KEYBOARD_MOVING_SEN * dt);

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

    getFox() {
        return this.shapes[0];
    }

    /**
     * It clears the screen.
     */
    clear() {
        this.gl.clearColor(0.0, 0.4, 1.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }
}