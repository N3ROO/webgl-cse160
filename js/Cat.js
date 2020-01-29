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

    constructor() {
        this.shapes = [];
    }

    build() {
        for (let shape of this.shapes) {
            shape.build();
        }
    }

    draw() {
        for (let shape of this.shapes) {
            shape.draw();
        }
    }
}