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
 *  Utility class for mouse events
 */


class Mouse {

    constructor () {
        // Press pos
        this.px = null;
        this.py = null;
        // Release pos
        this.rx = null;
        this.ry = null;

        // Moving pos
        this.mx = null;
        this.my = null;
        // Last moving pos
        this.lx = null;
        this.ly = null;

        this.bb = null;
        this.down = false;
    }

    registerEvents (canvasId) {
        getElement(canvasId).onmousedown = e => {
            this.down = true;

            this.px = e.clientX;
            this.py = e.clientY;

            this.bb = e.target.getBoundingClientRect();
        }

        getElement(canvasId).onmouseup = e => {
            this.down = false;

            this.rx = e.clientX;
            this.ry = e.clientY;

            this.bb = e.target.getBoundingClientRect();
        }

        getElement(canvasId).onmousemove = e => {
            this.lx = this.mx;
            this.ly = this.my;

            this.mx = e.clientX;
            this.my = e.clientY;

            this.bb = e.target.getBoundingClientRect();
        }
    }

    getPressPos () {
        return [this.px, this.py];
    }

    getReleasePos () {
        return [this.rx, this.ry];
    }

    getMovingPos () {
        return [this.mx, this.my];
    }

    getDeltaPos () {
        return [this.mx - this.lx, this.my - this.ly];
    }

    getBoundingBox () {
        return this.bb;
    }

    isDown () {
        return this.down;
    }
}