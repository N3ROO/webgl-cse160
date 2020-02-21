/**
 * (c) 2020 Lilian Gallon, MIT License
 * File creation: 02/18/2020
 * UCSC, CSE160, Winter 2020
 * https://nero.dev
 *
 * Required:
 *  - Nothing
 *
 * Description:
 *  It simplifies everything about moving a camera in the world.
 */

class Camera {

    /**
     * @param {WebGL2RenderingContext} gl
     * @param {Float} x position of the camera
     * @param {Float} y position of the camera
     * @param {Float} z position of the camera
     * @param {Float} dirX direction of the camera (what it looks)
     * @param {Float} dirY direction of the camera (what it looks)
     * @param {Float} dirZ direction of the camera (what it looks)
     * @param {Float} fov field of view
     * @param {Integer} screenWidth screen's width
     * @param {Integer} screenHeight screen's height
     * @param {Camera.FIRST_PERSON or Camera.THIRD_PERSON} mode
     */
    constructor (gl, x, y, z, dirX, dirY, dirZ, fov, screenWidth, screenHeight, mode) {
        this.gl = gl;
        this.mode = mode;

        if (mode === Camera.THIRD_PERSON) console.warn("Third person camera not working correctly yet");

        // Projection matrix

        this.fov = fov;
        this.aspect = screenWidth / screenHeight;
        this.far = 200;
        this.near = 1;

        this.u_ProjectionMatrix = this.gl.getUniformLocation(this.gl.program, 'u_ProjectionMatrix');
        this.updateProjectionMatrix();

        // View matrix

        this.cameraX = x;
        this.cameraY = y;
        this.cameraZ = z;

        this.pitch = 0;
        this.yaw = 0;
        this.roll = 0;

        this.directionX = dirX;
        this.directionY = dirY;
        this.directionZ = dirZ;

        this.upX = 0;
        this.upY = 1;
        this.upZ = 0;

        this.u_ViewMatrix = this.gl.getUniformLocation(this.gl.program, 'u_ViewMatrix');
        this.updateViewMatrix();
    }

    // PROJECTION MATRIX //

    changeFov (fov) {
        this.fov = fov;
        this.updateProjectionMatrix();
    }

    updateProjectionMatrix () {
        let projectionMatrix = new Matrix4();
        //projectionMatrix.setPerspective(this.fov, this.aspect, this.near, this.far);
        projectionMatrix.setPerspective(this.fov, this.aspect, this.near, this.far);
        this.gl.uniformMatrix4fv(this.u_ProjectionMatrix, false, projectionMatrix.elements);
    }

    // VIEW MATRIX //

    /**
     * Moves the camera forward (relative to what's it's currrently looking at)
     * @param {Float} step
     */
    moveForward (step) {
        this.move(step, 0);
    }

    /**
     * Moves the camera backward (relative to what's it's currrently looking at)
     * @param {Float} step
     */
    moveBackward (step) {
        this.move(step, 1);
    }

    /**
     * Moves the camera on the left (relative to what's it's currrently looking at)
     * @param {Float} step
     */
    moveLeft (step) {
        this.move(step, 2);
    }

    /**
     * Moves the camera on the right (relative to what's it's currrently looking at)
     * @param {Float} step
     */
    moveRight (step) {
        this.move(step, 3);
    }

    /**
     * Moves the camera.
     * @param {Float} step
     * @param {0, 1, 2, or 3} direction 0: forward, 1: backward, 2: left, 3: right
     */
    move (step, direction) {
        if (direction === 1 || direction === 2) step *= -1;

        if (direction === 0 || direction === 1) {
            this.cameraX += step * this.directionX;
            this.cameraY += step * this.directionY;
            this.cameraZ += step * this.directionZ;
        } else {
            // We do the cross product to get the right vector (according to the camera)
            let crossX = this.directionY * this.upZ - this.directionZ * this.upY;
            let crossY = this.directionX * this.upZ - this.directionZ * this.upX;
            let crossZ = this.directionX * this.upY - this.directionY * this.upX;

            // Then we normalize it otherwise it may return different vectors based on the direction vector
            let length = Math.sqrt(crossX**2 + crossY**2 + crossZ**2);

            let normX = crossX / length;
            let normY = crossY / length;
            let normZ = crossZ / length;

            this.cameraX += normX * step;
            this.cameraY += normY * step;
            this.cameraZ += normZ * step;
        }
        this.updateViewMatrix();
    }


    /**
     * It rotates the camera around the X axis.
     * @param {Float} alpha
     */
    rotateX (alpha) {
        this.pitch += alpha;
        if(this.pitch > 89) this.pitch =  89;
        if(this.pitch < -89) this.pitch = -89;
        this.updateViewMatrix();
    }

    /**
     * It rotates the camera around the Y axis.
     * @param {Float} alpha
     */
    rotateY (alpha) {
        this.yaw += alpha;
        this.updateViewMatrix();
    }

    /**
     * It rotates the camera around the Z axis.
     * @param {Float} alpha
     */
    rotateZ (alpha) {
        this.roll += alpha;
        this.updateViewMatrix();
    }

    /**
     * Not availible when using first person.
     * It changes what the camera is focusing.
     * @param {Float} x
     * @param {Float} y
     * @param {Float} z
     */
    target (x, y, z) {
        if (this.mode === Camera.THIRD_PERSON) {
            this.directionX = x;
            this.directionY = y;
            this.directionZ = z;
            this.updateViewMatrix();
        } else {
            console.warn('Do not use target(x, y, z) when using Camera.FIRST_PERSON');
        }
    }

    /**
     * It changes the camera mode to first person.
     * @param {Float} x x pos of the player's eyes
     * @param {Float} y y pos of the player's eyes
     * @param {Float} z z pos of the player's eyes
     * @param {Float} lx x pos of what the player is looking (usually 0 or 1 or -1)
     * @param {Float} ly y pos of what the player is looking (usually 0 or 1 or -1)
     * @param {Float} lz z pos of what the player is looking (usually 0 or 1 or -1)
     */
    setFirstPerson (x, y, z, lx, ly, lz) {
        // Move the camera to the player's eyes
        this.cameraX = x;
        this.cameraY = y;
        this.cameraZ = z;

        // Set the rotation to 0
        this.pitch = 0;
        this.yaw = 0;
        this.roll = 0;

        // Change what the camera is looking at
        this.directionX = lx;
        this.directionY = ly;
        this.directionZ = lz;

        // Change the mode
        this.mode = Camera.FIRST_PERSON;

        this.updateViewMatrix();
    }

    /**
     * It changes the camera mode to third person.
     * @param {Float} x x pos of the camera somewhere around the player
     * @param {Float} y y pos of the camera somewhere around the player
     * @param {Float} z z pos of the camera somewhere around the player
     * @param {Float} px x pos the player
     * @param {Float} py y pos the player
     * @param {Float} pz z pos the player
     */
    setThirdPerson (x, y, z, px, py, pz) {
        console.warn("Third person camera not working correctly yet");

        // Move the camera somewhere around the player
        this.cameraX = x;
        this.cameraY = y;
        this.cameraZ = z;

        // Set the rotation to 0
        this.pitch = 0;
        this.yaw = 0;
        this.roll = 0;

        // The camera is looking at the player
        this.directionX = px;
        this.directionY = py;
        this.directionZ = pz;

        // Change the mode
        this.mode = Camera.THIRD_PERSON;

        this.updateViewMatrix();
    }

    /**
     * It applies the last changes to the camera.
     */
    updateViewMatrix () {
        let viewMatrix = new Matrix4();
        if (this.mode === Camera.THIRD_PERSON) {
            // Not working properly, need to think about it if I want to implement 3rd person view
            viewMatrix.lookAt(this.cameraX, this.cameraY, this.cameraZ, this.directionX, this.directionY, this.directionZ, this.upX, this.upY, this.upZ);
            viewMatrix.rotate(this.pitch, 1, 0, 0);
            viewMatrix.rotate(this.yaw, 0, 1, 0);
            viewMatrix.rotate(this.roll, 0, 0, 1);
        } else {
            this.directionX = Math.cos(this.yaw * Math.PI/180) * Math.cos(this.pitch * Math.PI/180);
            this.directionY = Math.sin(this.pitch * Math.PI/180);
            this.directionZ = Math.sin(this.yaw * Math.PI/180) * Math.cos(this.pitch * Math.PI/180);

            /*
            let length = Math.sqrt(directionX**2 + directionY**2 + directionZ**2);
            this.directionX = directionX / length;
            this.directionY = directionY / length;
            this.directionZ = directionZ / length;*/

            viewMatrix.lookAt(
                this.cameraX, this.cameraY, this.cameraZ,
                this.directionX + this.cameraX, this.directionY + this.cameraY, this.directionZ + this.cameraZ,
                this.upX, this.upY, this.upZ);
        }
        this.gl.uniformMatrix4fv(this.u_ViewMatrix, false, viewMatrix.elements);
    }
}

Camera.FIRST_PERSON = 0;
Camera.THIRD_PERSON = 1;