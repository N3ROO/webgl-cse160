/**
 * (c) 2020 Lilian Gallon, MIT License
 * File creation: 01/23/2020
 * UCSC, CSE160, Winter 2020
 * https://nero.dev
 *
 * Required:
 * - libs/
 * - Shape.js
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


class Cube extends Shape {
    /**
     * It initializes all the arrays needed.
     *
     * Colors parameter: null by default: front (aqua), right (green), up (red),
     * left (yellow), down (white), back (purple).
     * Accepted parameters:
     * - [r, g, b]: all the faces will have the same color
     * - [r,g,b, r,g,b, ...]: front, right, up, left, down, and back color.
     *
     * @param {WebGL2RenderingContext} gl WebGL Context,
     * @param {Matrix4} matrix model matrix,
     * @param {Array} colors color of the cube (see above for details)
     */
    constructor(gl, matrix, colors=null) {
        super(gl, matrix);

        if (colors === null) {
            colors = [
                0.4, 0.4, 1.0, // front (aqua)
                0.4, 1.0, 0.4, // right (green)
                1.0, 0.4, 0.4, // up    (red)
                1.0, 1.0, 0.4, // left  (yellow)
                1.0, 1.0, 1.0, // down  (white)
                0.4, 1.0, 1.0  // back  (purple)
            ];
        }

        let vcolors = [];
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 4; j++) {
                for (let k = 0; k < 3; k++) {
                    vcolors.push(
                        colors.length === 3 ? colors[k] : colors[k+3*i]
                    );
                }
            }
        }

        this.colors = new Float32Array(vcolors);

        this.vertices = new Float32Array([
            1.0, 1.0, 1.0,  -1.0, 1.0, 1.0,  -1.0,-1.0, 1.0,   1.0,-1.0, 1.0,  // v0-v1-v2-v3 front
            1.0, 1.0, 1.0,   1.0,-1.0, 1.0,   1.0,-1.0,-1.0,   1.0, 1.0,-1.0,  // v0-v3-v4-v5 right
            1.0, 1.0, 1.0,   1.0, 1.0,-1.0,  -1.0, 1.0,-1.0,  -1.0, 1.0, 1.0,  // v0-v5-v6-v1 up
           -1.0, 1.0, 1.0,  -1.0, 1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0,-1.0, 1.0,  // v1-v6-v7-v2 left
           -1.0,-1.0,-1.0,   1.0,-1.0,-1.0,   1.0,-1.0, 1.0,  -1.0,-1.0, 1.0,  // v7-v4-v3-v2 down
            1.0,-1.0,-1.0,  -1.0,-1.0,-1.0,  -1.0, 1.0,-1.0,   1.0, 1.0,-1.0   // v4-v7-v6-v5 back
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
     * The function is optimized if there is no variation between cubes (ex: same
     * color, same model matrix & same position).
     * @return null if an error occured, the current instance otherwise.
     */
    build() {
        let updateColor = false;
        let updateMatrix = false;

        if (Shape.lastShape === null || !(Shape.lastShape instanceof Cube)) {
            updateColor = true;
            updateMatrix = true;

            // The last shape is not a cube, so we need to update the index buffer
            let indexBuffer = this.gl.createBuffer();
            if (!indexBuffer) {
                console.error('Could not create a buffer');
                return null;
            }
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
            this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.indices, this.gl.STATIC_DRAW);

            // All the cubes have the same position
            this._bindAttrib(this.vertices, 3, this.gl.FLOAT, 'a_Position');
        } else {
            updateColor = !float32Equals(Shape.lastShape.colors, this.colors);
            updateMatrix = Shape.lastShape.matrix !== this.matrix;
        }

        if (updateColor) {
            this._bindAttrib(this.colors, 3, this.gl.FLOAT, 'a_Color');
        }

        if (updateMatrix) {
            let u_ModelMatrix = this.gl.getUniformLocation(this.gl.program, 'u_ModelMatrix');
            this.gl.uniformMatrix4fv(u_ModelMatrix, false, this.matrix.elements);
        }

        Shape.lastShape = this;

        return this;
    }

    /**
     * It draws the cube.
     * Make sure that you did not modify the WebGL buffer since the last
     * build() call.
     */
    draw() {
        this.gl.drawElements(this.gl.TRIANGLES, this.indices.length, this.gl.UNSIGNED_BYTE, 0);
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