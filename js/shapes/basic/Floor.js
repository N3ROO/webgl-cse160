/**
 * (c) 2020 Lilian Gallon, MIT License
 * File creation: 02/20/2020
 * UCSC, CSE160, Winter 2020
 * https://nero.dev
 *
 * Required:
 * - Cube.js
 *
 * Description:
 *  This class is used to create a repeating floor.
 */


class Floor extends Cube {

    constructor(gl, matrix, texture, textureName, repeat) {
        super(gl, matrix, null, texture, textureName);

        for (let i = 0; i < this.textureCoords.length; i++) {
            this.textureCoords[i] *= repeat;
        }
    }
}