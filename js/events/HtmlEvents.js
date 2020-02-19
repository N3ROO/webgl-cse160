/**
 * (c) 2020 Lilian Gallon, MIT License
 * File creation: 01/23/2020 - 02/14/2020
 * UCSC, CSE160, Winter 2020
 * https://nero.dev
 *
 * Required:
 *  - Nothing
 *
 * Description:
 *  It handles all the interactions with the HTML. This
 * class has the access to the World instance.
 */

// Controls (used by the HTML buttons)

var C_AXIS = true;

class HtmlEvents {

    /**
     * You should call registerEvents() to finish the initialization.
     *
     * @param {World} world world instance (not started yet)
     */
    constructor (world) {
        this.world = world;
    }

    /**
     * It registers all the events.
     */
    registerEvents () {

    }

    /**
     * @param {Animation} animation the targetted animation
     * @param {string} startMsg the starting message of the animation
     * @param {string} endMsg the ending message of the animation
     * @param {HTML Button} target the button that triggers the animation
     * @param {[HTML Button]} concurrents the buttons that should be disabled
     */
    _toggleAnimation(animation, startMsg, endMsg, target, concurrents = []) {
        if (animation.isFinished()) {
            target.innerHTML = endMsg;
            animation.start();
            for (let concurrent of concurrents) concurrent.disabled = true;
        } else {
            target.innerHTML = startMsg;
            animation.stop();
            for (let concurrent of concurrents) concurrent.disabled = false;
        }
    }
}