class Axis {

    constructor(gl, xColor, yColor, zColor) {
        this.gl = gl;
        this.xColor = xColor;
        this.yColor = yColor;
        this.zColor = zColor;

        this.vertices = new Float32Array([
            -50, 0, 0,  50, 0, 0,
            0, -50, 0,  0, 50, 0,
            0, 0, -50,  0, 0, 50
        ]);

        this.colors = new Float32Array([
            xColor[0], yColor[0], zColor[0], xColor[0], yColor[0], zColor[0],
            xColor[1], yColor[1], zColor[1], xColor[1], yColor[1], zColor[1],
            xColor[2], yColor[2], zColor[2], xColor[2], yColor[2], zColor[2],
        ]);

        this.indices = new Uint8Array([
            0, 1, 2, 3, 4, 5
        ]);
    }

    build() {
        let buffer = this.gl.createBuffer();
        if(!buffer) {
            console.error('Could not create a buffer');
            return null;
        }

        this._bindAttrib(this.colors, 3, this.gl.FLOAT, 'a_Color');
        this._bindAttrib(this.vertices, 3, this.gl.FLOAT, 'a_Position');
        let u_ModelMatrix = this.gl.getUniformLocation(this.gl.program, 'u_ModelMatrix');
        this.gl.uniformMatrix4fv(u_ModelMatrix, false, (new Matrix4()).elements);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.indices, this.gl.STATIC_DRAW);
    }

    draw() {
        this.gl.drawElements(this.gl.LINES, this.indices.length, this.gl.UNSIGNED_BYTE, 0);
    }

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
}