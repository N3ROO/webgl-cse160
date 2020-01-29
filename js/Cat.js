/**
 * (c) 2020 Lilian Gallon, MIT License
 * File creation: 01/28/2020
 * UCSC, CSE160, Winter 2020
 * https://nero.dev
 *
 * Required:
 * - libs/
 * - Shape.js
 * - Cube.js
 *
 * Description:
 *  This class creates a beautiful cubic cat!
 */


class Cat extends Shape {

    constructor(gl, matrix) {
        super(gl, matrix);

        this.shapes = [];

        let color = [0.7, 0.65, 0.72];

        //// Body ////
        this.shapes.push(new Cube(gl, new Matrix4(), color));

        //// Feet ////
        let m = new Matrix4();
        m.scale(0.2, 0.2, 0.2);

        // Front right: index 1
        m.translate(4, -6, -4);
        this.shapes.push(new Cube(gl, new Matrix4(m), color));

        // Front left: index 2
        m.translate(-8, 0, 0);
        this.shapes.push(new Cube(gl, new Matrix4(m), color));

        // Back left: index 3
        m.translate(0, 0, 8);
        this.shapes.push(new Cube(gl, new Matrix4(m), color));

        // Back right: index 4
        m.translate(8, 0, 0);
        this.shapes.push(new Cube(gl, m, color));

        //// TAIL ////
/*
        // Tail part1: index 5
        m = new Matrix4();
        m.scale(0.2, 0.2, 0.4);
        m.translate(0, -2, 3);
        this.shapes.push(new Cube(gl, m, color));

        // Tail part2: index 6
        m = new Matrix4();
        m.rotate(10, 0, 1, 0);
        m.scale(0.2, 0.2, 0.4);
        m.translate(-1.5, -2, 4.8);
        this.shapes.push(new Cube(gl, new Matrix4(m), color));

        // Tail part2: index 7
        m = new Matrix4();
        m.rotate(-10, 0, 1, 0);
        m.scale(0.2, 0.2, 0.4);
        m.translate(2.5, -2, 6.8);
        //m.translate(1.5, -2, 6.8);
        this.shapes.push(new Cube(gl, m));*/


    }

    build() { }

    draw() {
        for (let shape of this.shapes) {
            shape.build();
            shape.draw();
        }
    }
}