/**
 * (c) 2020 Lilian Gallon, MIT License
 * File creation: 02/22/2020
 * UCSC, CSE160, Winter 2020
 * https://nero.dev
 *
 * Required:
 *  Cube.js
 *
 * Description:
 *  It simplifies moving and rendering the light in the world.
 */

class Lighting {

    /**
     * @param {WebGL2RenderingContext} gl
     * @param {Float} x light position
     * @param {Float} y light position
     * @param {Float} z light position
     * @param {Float} lr light color
     * @param {Float} lg light color
     * @param {Float} lb light color
     * @param {Float} ar ambient color
     * @param {Float} ag ambient color
     * @param {Float} ab ambient color
     */
    constructor (gl, x, y, z, lr, lg, lb, ar, ag, ab) {
        this.gl = gl;

        this.u_AmbientLight = this.gl.getUniformLocation(this.gl.program, 'u_AmbientLight');
        this.u_LightColor = this.gl.getUniformLocation(this.gl.program, 'u_LightColor');
        this.u_LightPosition = this.gl.getUniformLocation(this.gl.program, 'u_LightPosition');

        this.setPos(x, y, z);
        this.setLightColor(lr, lg, lb);
        this.setAmbientColor(ar, ag, ab);
        this.updateLightCube();
    }

    setPos (x, y, z) {
        this.pos = {
            x: x,
            y: y,
            z: z
        };
        this.gl.uniform3f(this.u_LightPosition, x, y, z);
    }

    setLightColor (r, g, b) {
        this.lightColor = {
            r: r,
            g: g,
            b: b
        };
        this.gl.uniform3f(this.u_LightColor, r, g, b);
    }

    setAmbientColor (r, g, b) {
        this.ambientColor = {
            r: r,
            g: g,
            b: b
        };
        this.gl.uniform3f(this.u_AmbientLight, r, g, b);
    }

    /**
     * It updates the light cube representing the light
     */
    updateLightCube () {
        let size = 0.1;
        let mat = (new Matrix4()).translate(this.pos.x, this.pos.y, this.pos.z).scale(size, size, size);
        this.lightCube = new Cube(this.gl, mat, [this.lightColor.r, this.lightColor.g, this.lightColor.b, 1], null, null);
    }

    /**
     * It renders the light cube representing the light
     */
    renderLightCube () {
        this.lightCube.build();
        this.lightCube.draw();
    }
}