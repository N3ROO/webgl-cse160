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
        this.opaqueShapes = [];
        this.transparentShapes = [];
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

        // Lighting
        this.normalMatrix = new Matrix4();
        this.u_NormalMatrix = this.gl.getUniformLocation(this.gl.program, 'u_NormalMatrix');
        this.lighting = new Lighting(this.gl, 10, 10, 10, 0.3, 0.3, 0.3, 0.2, 0.2, 0.2); // Needs to by sync with HTML!

        this.onFocusChangedListeners = []
        this.foxFocused = false;
        this.lastFoxFocused = false;
    }

    /**
     * It creates the world
     */
    create () {
        this.opaqueShapes.push(new Fox(this.gl, (new Matrix4()).translate(-3, 0, 7).rotate(180, 0, 1, 0).scale(0.3,0.3,0.3)));
        this.opaqueShapes.push(new Axis(this.gl, [1,0,0], [0,1,0], [0,0,1]));
        this.opaqueShapes.push(new Sky(this.gl, (new Matrix4()).translate(0, 70, 0).scale(80,80,80), this.textures.getTexture('SkySmackdown_night'), 'SkySmackdown_night'));
        this.opaqueShapes.push(new Floor(this.gl, (new Matrix4()).translate(0,0.9,0).scale(80, 0.1, 80), this.textures.getTexture('grass'), 'grass', 80));

        let createCube = (shape) => {
            let pos = (new Matrix4()).translate(shape.x+0.501, shape.y+0.501, shape.z+0.501)

            if (shape.block.startsWith('door')) {
                pos.translate(0, 0, 0.399).scale(0.499, 0.499, 0.1); // Heading z+
            } else {
                pos.scale(0.499, 0.499, 0.499);
            }

            let texture = this.textures.getTexture(shape.block);

            if (shape.block.startsWith('leaves')) {
                return new Cube(this.gl, pos, [0, 0.3, 0, 0], texture, shape.block);
            } else {
                return new Cube(this.gl, pos, null,  texture, shape.block);
            }
        }

        // Opaque textures first
        for (let shape of WORLD1.opaque) {
            this.opaqueShapes.push(createCube(shape));
        }

        // Then, transparent textures
        for (let shape of WORLD1.transparent) {
            this.transparentShapes.push(createCube(shape));
        }

        // Then, we sort the transparent texutres according to the distance from the camera
        this.sortTransparentShapes();
        this.camera.addOnCamMovingListener((cam) => { this.sortTransparentShapes(); });
        /* move light with cam
        this.camera.addOnCamMovingListener((cam) => { 
            let pos = cam.getInfo();
            this.gl.uniform3f(this.u_LightPosition, pos.x, pos.y, pos.z);
        });*/
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

            if (this.foxFocused) {
                // Rotate fox
                this.getFox().rotate(yaw);
                this.getFox().applyMovements();
            } else {
                this.camera.rotateX(Math.max(Math.min(pitch, 90), -90));
                this.camera.rotateY(yaw);
                //this.camera.rotateZ(Math.max(Math.min(roll, 180), -180));
            }
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
        if (this.keyboard.isDown(Keyboard.K_W)) { this.foxFocused = false; this.camera.moveForward(this.KEYBOARD_MOVING_SEN * dt); };
        if (this.keyboard.isDown(Keyboard.K_S)) { this.foxFocused = false; this.camera.moveBackward(this.KEYBOARD_MOVING_SEN * dt); };
        if (this.keyboard.isDown(Keyboard.K_D)) { this.foxFocused = false; this.camera.moveRight(this.KEYBOARD_MOVING_SEN * dt); };
        if (this.keyboard.isDown(Keyboard.K_A)) { this.foxFocused = false; this.camera.moveLeft(this.KEYBOARD_MOVING_SEN * dt); };

        if (this.getFox().isMoving() || this.getFox().jumping) {
            this.followFox(dt);
            this.foxFocused = true;
        } else {
            this.camera.resetMovingAnimation();
            this.camera.resetHeadingAnimation();
        }

        // Update shapes //
        for (let shape of this.opaqueShapes) {
            if (!C_AXIS && shape instanceof Axis) continue;
            shape.update(dt);
        }

        for (let shape of this.transparentShapes) {
            shape.update(dt);
        }

        if (this.lastFoxFocused !== this.foxFocused) {
            for(let listener of this.onFocusChangedListeners) listener(this.foxFocused);
        }
        this.lastFoxFocused = this.foxFocused;
    }

    followFox (dt) {
        let lengthXZfromFox = 3;
        let heightFromFox = 1;

        // Calculate new cam position
        let alpha = -(this.getFox().getRotation()+90);
        let x = Math.cos(alpha * Math.PI/180) * lengthXZfromFox;
        let z = Math.sin(alpha * Math.PI/180) * lengthXZfromFox;
        let pos = getPosition(this.getFox().matrix);
        this.camera.moveToSmooth(x + pos[0], pos[1] + heightFromFox, z + pos[2], dt);

        // Calculate new cam rotation to look at the fox
        this.camera.headToSmooth(0, - this.getFox().getRotation()+90, 0, dt)
    }

    /**
     * @param {float} dt time difference since last update
     */
    _render (dt) {
        this.clear();

        this.lighting.renderLightCube();

        for (let shape of this.opaqueShapes) {
            if (!C_AXIS && shape instanceof Axis) continue;
            shape.build();

            this.normalMatrix = this.normalMatrix.setInverseOf(shape.matrix);
            this.normalMatrix.transpose();
            this.gl.uniformMatrix4fv(this.u_NormalMatrix, false, this.normalMatrix.elements);

            shape.draw();
        }

        for (let shape of this.transparentShapes) {
            shape.build();

            this.normalMatrix = this.normalMatrix.setInverseOf(shape.matrix);
            this.normalMatrix.transpose();
            this.gl.uniformMatrix4fv(this.u_NormalMatrix, false, this.normalMatrix.elements);

            shape.draw();
        }
    }

    // Utility

    onFocusChangedListener (func) {
        this.onFocusChangedListeners.push(func);
    }

    updateLightPosition () {
        let pos = this.camera.getInfo();
        this.lighting.setPos(pos.x, pos.y, pos.z);
        this.lighting.updateLightCube();
    }

    updateLightColor (r, g, b) {
        this.lighting.setLightColor(r, g, b);
        this.lighting.updateLightCube();
    }

    updateAmbientColor (r, g, b) {
        this.lighting.setAmbientColor(r, g, b);
    }

    sortTransparentShapes () {
        this.transparentShapes.sort( (a, b) => {
            let cam = this.camera.getInfo();
            let posa = getPosition(a.matrix);
            let posb = getPosition(b.matrix);
            let dista = Math.sqrt(
                (cam.x - posa[0])**2 +
                (cam.y - posa[1])**2 +
                (cam.z - posa[2])**2
            );
            let distb = Math.sqrt(
                (cam.x - posb[0])**2 +
                (cam.y - posb[1])**2 +
                (cam.z - posb[2])**2
            );

            return distb - dista;
        });
    }

    getCamera () {
        return this.camera;
    }

    getFox () {
        return this.opaqueShapes[0];
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
        this.opaqueShapes[2].changeTexture(this.textures.getTexture(textureName));
    }

    /**
     * It clears the screen.
     */
    clear() {
        this.gl.clearColor(0.0, 0.4, 1.0, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }
}