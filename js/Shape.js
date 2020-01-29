class Shape {
    constructor(gl, matrix) {
        this.gl = gl;
        this.matrix = matrix;
    }

    //// ABSTRACT METHODS ////

    build() {}
    draw () {}

    //// UTILITY METHODS /////

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
    getMatrix() {
        return this.matrix;
    }

    //// SETTERS ////

    /**
     * Updates the model matrix of the cube.
     * @param {Matrix4} matrix model matrix of the cube
     */
    setMatrix(matrix) {
        this.matrix = matrix;
    }
}

Shape.lastShape = null;