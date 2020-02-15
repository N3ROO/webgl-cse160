/**
 * (c) 2020 Lilian Gallon, MIT License
 * File creation: 02/14/2020
 * UCSC, CSE160, Winter 2020
 * https://nero.dev
 *
 * Required:
 *  - Nothing
 *
 * Description:
 *  Utility class for keyboard events
 */


class Keyboard {

    constructor () {
        this.keys = new Map();
        this.jUp = false;
        this.jDown = false;
    }

    registerEvents (canvasId) {
        getElement(canvasId).onkeydown = e => {
            this.keys.set(e.keyCode, true);

            this.jUp = false;
            this.jDown = true;

            e.preventDefault();
        }

        getElement(canvasId).onkeyup = e => {
            this.keys.set(e.keyCode, false);

            this.jUp = true;
            this.jDown = false;

            e.preventDefault();
        }
    }

    isDown (keyCode) {
        return this.keys.get(keyCode) == undefined ? false : this.keys.get(keyCode);
    }

    justUp () {
        if (this.jUp) {
            this.jUp = false
            return true;
        } else {
            return false;
        }
    }

    justDown () {
        if (this.jDown) {
            this.jDown = false
            return true;
        } else {
            return false;
        }
    }
}

// Mappings

Keyboard.K_LEFT = 37;
Keyboard.K_UP = 38;
Keyboard.K_RIGHT = 39;
Keyboard.K_DOWN = 40;

Keyboard.K_W = 87;
Keyboard.K_A = 65;
Keyboard.K_S = 83;
Keyboard.K_D = 68;

Keyboard.K_SHIFT = 16;
Keyboard.K_SPACE = 32;