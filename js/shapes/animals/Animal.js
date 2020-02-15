/**
 * (c) 2020 Lilian Gallon, MIT License
 * File creation: 01/28/2020
 * UCSC, CSE160, Winter 2020
 * https://nero.dev
 *
 * Required:
 * - Nothing
 *
 * Description:
 *  Parent class for animals.
 */

class Animal extends Shape {

    constructor (gl, matrix) {
        super(gl, matrix);
        this.shapes = [];
    }

    build () { }

    update (dt) { }

    draw () {
        this.shapes.forEach((shape, k) => {
            shape.build();
            shape.draw();
        });
    }
}