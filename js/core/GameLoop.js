/**
 * (c) 2020 Lilian Gallon, MIT License
 * File creation: 02/14/2020
 * UCSC, CSE160, Winter 2020
 * https://nero.dev
 *
 * Required:
 * - libs/
 * - init.js
 *
 * Description:
 *  
 */


class GameLoop {

    constructor(updateFunc, renderFunc) {
        this.fpsmeter = new FPSMeter({
            decimals: 0,
            graph: true,
            theme: 'transparent',
             left: '10px',
             top: '10px' 
        });

        this.last = this._timestamp();
        this.dt = 0;
        this.STEP = 1/60; // Number of updates per seconds

        this.uFunc = updateFunc;
        this.rFunc = renderFunc;
    }

    start () {
        requestAnimationFrame(this._tick.bind(this));
    }

    _tick () {
        this.fpsmeter.tickStart();

        let now = this._timestamp();
        this.dt = this.dt + Math.min(1, (now - this.last) / 1000);

        while (this.dt > this.STEP) {
            this.dt = this.dt - this.STEP;
            this.uFunc(this.STEP);
        }

        this.rFunc(this.dt);

        this.fpsmeter.tick();

        this.last = now;
        requestAnimationFrame(this._tick.bind(this));
    }

    /**
     * Returns the timestamp in ms.
     */
    _timestamp() {
        return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
    }

}