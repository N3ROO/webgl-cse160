/**
 * (c) 2020 Lilian Gallon, MIT License
 * File creation: 01/28/2020
 * UCSC, CSE160, Winter 2020
 * https://nero.dev
 *
 * Required:
 * - libs/
 * - Animal.js
 *
 * Description:
 *  This class creates a beautiful cubic cat!
 */


class Fox extends Animal {

    constructor(gl, matrix) {
        super(gl, matrix);

        let color = [0.7, 0.65, 0.72];
        let m = null;

        //// Body ////
        m = (new Matrix4()).scale(1, 1, 2).translate(0, 0, 1);
        this.shapes.push(new Cube(gl, m, [1, 0.5, 0]));

        //// FEET ///
        color = [1, 0.4, 0];

        m = new Matrix4();
        m.translate(0.5, -1, 0.5);
        m.scale(0.4, 0.8, 0.4);
        this.shapes.push(new Cube(gl, m, color)); // front right (relative to fox)

        m = new Matrix4();
        m.translate(-0.5, -1, 0.5);
        m.scale(0.4, 0.8, 0.4);
        this.shapes.push(new Cube(gl, m, color)); // front left (relative to fox)

        m = new Matrix4();
        m.translate(-0.5, -1, 3.5);
        m.scale(0.4, 0.8, 0.4);
        this.shapes.push(new Cube(gl, m, color)); // back right (relative to fox)

        m = new Matrix4();
        m.translate(0.5, -1, 3.5);
        m.scale(0.4, 0.8, 0.4);
        this.shapes.push(new Cube(gl, m, color)); // back left (relative to fox)

        //// TAIL ////
        let length = 0.6;

        m = new Matrix4();
        m.translate(0, 0, 4.5);
        m.scale(0.3, 0.3, length);
        this.shapes.push(new Cube(gl, new Matrix4(m), color));

        m.translate(0, 0, length + 1);
        m.scale(1, 1, 0.6);
        this.shapes.push(new Cube(gl, m, [0.1,0.1,0.1]));

        //// EARS ////
        color = [0.2, 0.2, 0.2];

        m = new Matrix4();
        m.translate(0.5, 1, 0.5);
        m.scale(0.3, 0.5, 0.2);
        this.shapes.push(new Cube(gl, m, color));

        m = new Matrix4();
        m.translate(-0.5, 1, 0.5);
        m.scale(0.3, 0.5, 0.2);
        this.shapes.push(new Cube(gl, m, color));

        //// NOSE ////
        m = new Matrix4();
        m.translate(0, -0.3, 0);
        m.scale(0.25, 0.25, 0.6);
        this.shapes.push(new Cube(gl, m, color));

        //// EYES ////
        color = [1, 1, 1];

        m = new Matrix4();
        m.translate(0.4, 0.25, 0);
        m.scale(0.2, 0.2, 0.1);
        this.shapes.push(new Cube(gl, new Matrix4(m), color)); // right eye

        m.scale(0.5, 0.5, 1);
        m.translate(0, 0, -0.1)
        this.shapes.push(new Cube(gl, new Matrix4(m), [0.1,0.1,0.1]));

        m = new Matrix4();
        m.translate(-0.4, 0.25, 0);
        m.scale(0.2, 0.2, 0.1);
        this.shapes.push(new Cube(gl, new Matrix4(m), color)); // right eye

        m.scale(0.5, 0.5, 1);
        m.translate(0, 0, -0.1)
        this.shapes.push(new Cube(gl, new Matrix4(m), [0.1,0.1,0.1]));
    }
}