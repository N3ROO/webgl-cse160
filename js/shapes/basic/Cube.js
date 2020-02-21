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
     * - [r, g, b, a]: all the faces will have the same color
     * - [r,g,b,a, r,g,b,a ...]: front, right, up, left, down, and back color.
     *
     * @param {WebGL2RenderingContext} gl WebGL Context,
     * @param {Matrix4} matrix model matrix,
     * @param {Array} colors color of the cube (see above for details) -> null = ignore
     * @param {Texture} texture texture -> null = ignore
     * @param {Texture} textureName textureName (for optimization)
     */
    constructor(gl, matrix, colors, texture, textureName) {
        super(gl, matrix);

        this.colors = null;
        this.textureName = null;
        this.texture = null;

        if (colors !== null) {
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
        }

        if (texture !== null) {
            this.textureName = textureName;
            this.texture = texture;

            this.textureCoords = new Float32Array([
                1.0, 0.0,  0.0, 0.0,  0.0, 1.0,  1.0, 1.0, // Front
                0.0, 0.0,  0.0, 1.0,  1.0, 1.0,  1.0, 0.0, // Right 0.0, 0.0,  1.0, 0.0,  1.0, 1.0,  0.0, 1.0,
                1.0, 0.0,  0.0, 0.0,  0.0, 1.0,  1.0, 1.0, // Top
                0.0, 0.0,  1.0, 0.0,  1.0, 1.0,  0.0, 1.0, // Left
                0.0, 0.0,  1.0, 0.0,  1.0, 1.0,  0.0, 1.0, // Bottom
                0.0, 1.0,  1.0, 1.0,  1.0, 0.0,  0.0, 0.0, // Back
            ]);
        }

        if (texture === null && colors === null) console.error('Please specify either the colors or the teture of the cube');

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

        this.u_Sampler = this.gl.getUniformLocation(this.gl.program,'u_Sampler');
        this.u_ModelMatrix = this.gl.getUniformLocation(this.gl.program, 'u_ModelMatrix')
        this.a_Color = this.gl.getAttribLocation(this.gl.program, 'a_Color');
        this.a_Position = this.gl.getAttribLocation(this.gl.program, 'a_Position');
        this.a_TexCoord = this.gl.getAttribLocation(this.gl.program, 'a_TexCoord');
    }

    /**
     * It fills the buffer with the vertices to draw a cube.
     * The function is optimized if there is no variation between cubes (ex: same
     * color, same model matrix & same position).
     * @return null if an error occured, the current instance otherwise.
     */
    build() {
        let updateColor = false;
        let updateTexture = false;
        let updateMatrix = false;

        if (Shape.lastShape === null || !(Shape.lastShape instanceof Cube)) {
            updateColor = this.colors === null ? false : true;
            updateTexture = this.texture === null ? false : true;
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
            this._bindAttrib(this.vertices, 3, this.gl.FLOAT, this.a_Position);
        } else {
            updateColor = this.colors === null ? false : !float32Equals(Shape.lastShape.colors, this.colors);
            updateTexture = this.texture === null ? false : !float32Equals(Shape.lastShape.textureCoords, this.textureCoords) || Shape.lastShape.textureName != this.textureName;
            updateMatrix = Shape.lastShape.matrix !== this.matrix;
        }

        if (updateTexture) {
            // Remove the color
            this._bindAttrib([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 3, this.gl.FLOAT, this.a_Color);
            // Bind the texture coords
            this._bindAttrib(this.textureCoords, 2, this.gl.FLOAT, this.a_TexCoord);
            // Bind the texture to texture unit 0
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
            // Tell the shader we bound the texture to texture unit 0
            this.gl.uniform1i(this.u_Sampler, 0);
        }

        if (updateColor) {
            if (this.texture === null) {
                this.gl.disableVertexAttribArray(this.gl.getAttribLocation(this.gl.program, this.a_TexCoord));
            }
            this._bindAttrib(this.colors, 3, this.gl.FLOAT, this.a_Color);
        }

        if (updateMatrix) {
            this.gl.uniformMatrix4fv(this.u_ModelMatrix, false, this.matrix.elements);
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
}