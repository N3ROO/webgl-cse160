/**
 * (c) 2020 Lilian Gallon, MIT License
 * File creation: 01/23/2020
 * UCSC, CSE160, Winter 2020
 * https://nero.dev
 *
 * Required:
 * - libs/
 *
 * Description:
 *  This class is used to easily create a cube:
 *    v6----- v5
 *   /|      /|
 *  v1------v0|
 *  | |     | |
 *  | |v7---|-|v4
 *  |/      |/
 *  v2------v3
 */


class Cube {
    /**
     * It initializes all the arrays needed.
     * @param {WebGL2RenderingContext} gl WebGL Context,
     * @param {Matrix4} matrix model matrix
     */
    constructor(gl, matrix) {
        this.gl = gl;
        this.matrix = matrix;

        this.vertices = new Float32Array([
            1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,  // v0-v1-v2-v3 front
            1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,  // v0-v3-v4-v5 right
            1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,  // v0-v5-v6-v1 up
           -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,  // v1-v6-v7-v2 left
           -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,  // v7-v4-v3-v2 down
            1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0   // v4-v7-v6-v5 back
        ]);

        this.colors = new Float32Array([
            0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  0.4, 0.4, 1.0,  // v0-v1-v2-v3 front(blue)
            0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  0.4, 1.0, 0.4,  // v0-v3-v4-v5 right(green)
            1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  1.0, 0.4, 0.4,  // v0-v5-v6-v1 up(red)
            1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  1.0, 1.0, 0.4,  // v1-v6-v7-v2 left
            1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  1.0, 1.0, 1.0,  // v7-v4-v3-v2 down
            0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0,  0.4, 1.0, 1.0   // v4-v7-v6-v5 back
        ]);

        this.indices = new Uint8Array([
            0, 1, 2,    0, 2, 3,    // front
            4, 5, 6,    4, 6, 7,    // right
            8, 9,10,    8,10,11,    // up
            12,13,14,  12,14,15,    // left
            16,17,18,  16,18,19,    // down
            20,21,22,  20,22,23     // back
        ]);
    }

    /**
     * It fills the buffer with the vertices to draw a cube.
     */
    build() {
        let indexBuffer = this.gl.createBuffer();
        if (!indexBuffer) {
            console.error('Could not create a buffer');
            return false;
        }

        this._bindAttrib(this.vertices, 3, this.gl.FLOAT, 'a_Position');

        // We update the colors only if needed (it will work if nothing else than this class is used)
        if (Cube.lastCube === null || Cube.lastCube.colors !== this.colors) {
            this._bindAttrib(this.colors  , 3, this.gl.FLOAT, 'a_Color');
            Cube.lastCube = this;
        }
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.indices, this.gl.STATIC_DRAW);

        return true;
    }

    /**
     * It draws the cube.
     * Make sure that you did not modify the WebGL buffer since the last
     * build() call.
     */
    draw() {
        this.gl.drawElements(this.gl.TRIANGLES, this.indices.length, this.gl.UNSIGNED_BYTE, 0);
    }

    //// PRIVATE METHODS ////

    /**
     * It binds the given data to the specified variable in the GPU.
     * @param {Float32Array} data the data,
     * @param {GLint} num the size,
     * @param {GLenum} type the variable type,
     * @param {String} attr the variable name (attribute)
     */
    _bindAttrib(data, num, type, attr) {
        let buffer = this.gl.createBuffer();
        if (!buffer) {
            console.error('Could not create a buffer');
            return false;
        }

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, data, this.gl.STATIC_DRAW);

        let a_attr = this.gl.getAttribLocation(this.gl.program, attr);
        if (a_attr < 0) {
            console.error('Failed to get the storage location of ' + attr);
            return 0;
        }
        this.gl.vertexAttribPointer(a_attr, num, type, false, 0, 0);
        this.gl.enableVertexAttribArray(a_attr);
    }

    //// GETTERS ////

    /**
     * Returns the model matrix of the cube
     */
    get matrix() {
        return this._matrix;
    }

    //// SETTERS ////

    /**
     * Dynamically updates the model matrix of the cube
     * @param {Matrix4} matrix model matrix of the cube.
     */
    set matrix(matrix) {
        this._matrix = matrix;
        let u_ModelMatrix = this.gl.getUniformLocation(this.gl.program, 'u_ModelMatrix');
        this.gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
    }

    //// GRAVEYARD ////

    /** I coded a simplified version of what the GPU already does lol (ModelMatrix * Position)
    get matrix() {
        return this.matrix;
    }

    set matrix(matrix) {
        // We need to update the vertices
        this.vertices = new Float32Array([
            1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,  // v0-v1-v2-v3 front
            1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,  // v0-v3-v4-v5 right
            1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,  // v0-v5-v6-v1 up
           -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,  // v1-v6-v7-v2 left
           -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,  // v7-v4-v3-v2 down
            1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0   // v4-v7-v6-v5 back
        ]);

        let i = 0;
        while (i < 72) {
            // First we build the current vertex
            let x = this.vertices[i];
            let y = this.vertices[i+1];
            let z = this.vertices[i+2];
            let vertex  = new Vector3([x, y, z]);

            // Now we multiply it with the given matrix
            let newVertex = matrix.multiplyVector3(vertex);

            // Then we update the vertex position
            let newX = newVertex.elements[0];
            let newY = newVertex.elements[1];
            let newZ = newVertex.elements[2];
            this.vertices[i]   = newX;
            this.vertices[i+1] = newY;
            this.vertices[i+2] = newZ;

            // Finally we go to the next vertex
            i += 3
        }

        this._matrix = matrix;
    } */
}

Cube.lastCube = null;