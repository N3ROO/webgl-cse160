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
        this.shapes.push(new Sky(this.gl, (new Matrix4()).translate(0, 70, 0).scale(80,80,80), this.textures.getTexture('SkySmackdown_night'), 'SkySmackdown_night'));
        this.shapes.push(new Floor(this.gl, (new Matrix4()).translate(0,0.9,0).scale(80, 0.1, 80), this.textures.getTexture('grass'), 'grass', 80));

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

        // Send the event to all the listeners to init them with the initial cam
        this.camera.fireEvents();
    }

    /**
     * @param {float} dt time difference since last update
     */
    _update (dt) {
        // Mouse events //
        if (this.mouse.isDown() || this.keyboard.isDown(Keyboard.K_Q) || this.keyboard.isDown(Keyboard.K_E)) {
            let pitch = 0; // rx
            let yaw = 0; // ry
            // let roll = 0; // rz

            if (this.mouse.isDown()) {
                yaw = this.mouse.getDeltaPos()[0];
                pitch = - this.mouse.getDeltaPos()[1];

                yaw *= this.MOUSE_ROTATION_SENS;
                pitch *= this.MOUSE_ROTATION_SENS;
            } else if (this.keyboard.isDown(Keyboard.K_Q)) {
                //roll = - this.KEYBOARD_ROTATION_SENS;
                yaw = - this.KEYBOARD_ROTATION_SENS;
            } else {
                //roll = this.KEYBOARD_ROTATION_SENS;
                yaw = this.KEYBOARD_ROTATION_SENS;
            }

            yaw *= dt;
            pitch *= dt;

            this.camera.rotateX(Math.max(Math.min(pitch, 90), -90));
            this.camera.rotateY(yaw);
            //this.camera.rotateZ(Math.max(Math.min(roll, 180), -180));
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

        if (this.getFox().isMoving() || this.getFox().jumping) {
            let pos = getPosition(this.getFox().matrix);
            this.camera.moveToSmooth(pos[0], pos[1] + 1, pos[2] - 3, dt);
            this.camera.headToSmooth(0, 90, 0, dt);
        } else {
            this.camera.resetMovingAnimation();
            this.camera.resetHeadingAnimation();
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
            //if (shape.textureName === 'leaves_big_oak_opaque') this.gl.depthMask(this.gl.FALSE));
            shape.draw();
            //if (shape.textureName === 'glass_black') this.gl.enable(this.gl.DEPTH_TEST);
        }
    }

    // Utility

    getCamera () {
        return this.camera;
    }

    getFox () {
        return this.shapes[0];
    }

    /**
     * It changes the world ambiance (day / night)
     * @param {Boolean} day true -> sets the time to day, night otherwise
     */
    changeTime (day) {
        let textureName;
        if (day) {
            textureName = 'SkySmackdown';
        } else {
            textureName = 'SkySmackdown_night';
        }
        this.shapes[2].changeTexture(this.textures.getTexture(textureName));
    }

    /**
     * It clears the screen.
     */
    clear() {
        this.gl.clearColor(0.0, 0.4, 1.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }
}