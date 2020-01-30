/**
 * (c) 2020 Lilian Gallon, MIT License
 * File creation: 01/23/2020
 * UCSC, CSE160, Winter 2020
 * https://nero.dev
 *
 * Required:
 *  Nothing.
 *
 * Description:
 *  It simplifies an animation by computing its rotation angle.
 */

class Animation {
    /**
     * @param {Float} startAngle starting angle,
     * @param {Float} endAngle ending angle,
     * @param {Float} anglePerSec speed in angle per seconds
     * @param {Boolean} loop true means that the animation will do a "come and go" once finished. It will
     *      go from end to start, then start to end, and so on.
     */
    constructor(startAngle, endAngle, anglePerSec, loop) {
        this.actualStartAngle = startAngle;
        this.actualEndAngle = endAngle;
        this.anglePerSec = anglePerSec;

        this.loop = loop;
        this.paused = true;
        this.finished = true;

        this.startAngle = this.actualStartAngle;
        this.endAngle = this.actualEndAngle;
        this.currentAngle = this.startAngle;
    }

    /**
     * It starts the animation.
     */
    start() {
        this.paused = false;
        this.finished = false;
    }

    /**
     * It pauses the animation. Use resume() to resume.
     */
    pause() {
        this.paused = true;
    }

    /**
     * It resumes the animation from its last state.
     */
    resume() {
        this.paused = false;
    }

    /**
     * It stops the animation
     */
    stop() {
        this.finished = true;
        this.paused = true;
        this.startAngle = this.actualStartAngle;
        this.endAngle = this.actualEndAngle;
        this.currentAngle = this.actualEndAngle;
    }

    /**
     * It computes the new angle. Use getRotationAngle to get the computed rotation.
     * @param {Float} dt miliseconds since last update.
     */
    tick(dt) {
        if (this.paused) return;

        // Change direction once one of the limit has been reached
        if (Math.abs(this.currentAngle) > Math.abs(this.endAngle)) {
            if (this.loop) {
                let tmp = this.startAngle;
                this.startAngle = this.endAngle;
                this.endAngle = tmp;
            } else {
                this.stop();
            }
        }

        // Update rotation according to the direction
        if (this.startAngle >= this.endAngle) {
            this.currentAngle -= this.anglePerSec * dt;
        } else {
            this.currentAngle += this.anglePerSec * dt;
        }
    }

    /**
     * Returns true if the animation is finished. If loop is true,
     * it won't be false unless you manually call stop().
     */
    isFinished() {
        return this.finished;
    }

    /**
     * Returns true if the animation is paused. It will also returns
     * true if the animation is finished.
     */
    isPaused() {
        return this.paused;
    }

    /**
     * Returns the latest rotation.
     */
    getRotationAngle() {
        return this.currentAngle;
    }
}