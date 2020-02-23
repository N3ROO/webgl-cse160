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
var C_FOLLOW_FOX = true;

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
        this.world.getCamera().addOnCamMovingListener(cam => {
            let c = cam.getInfo();
            getElement('camera').innerHTML = (
                'x: ' + c.x.toFixed(2) + '<br>y: ' + c.y.toFixed(2) + '<br>z: ' + c.z.toFixed(2) + '<br>' +
                'pitch: ' + c.pitch.toFixed(2) + '<br>yaw: ' + c.yaw.toFixed(2) + '<br>roll: ' + c.roll.toFixed(2));
        });

        getElement('night').onclick = e => {
            if (e.target.checked) {
                this.world.changeTime(false);
                this.world.updateAmbientColor(0.2, 0.2, 0.2);
            } else {
                this.world.changeTime(true);
                this.world.updateAmbientColor(0.9, 0.9, 0.9);
            }
        };

        getElement('light-pos').onclick = e => {
            this.world.updateLightPosition();
        }

        function updateLightColor () {
            let r = getElement('light-red').value;
            let g = getElement('light-green').value;
            let b = getElement('light-blue').value;
            this.world.updateLightColor(r, g, b);
        }

        updateLightColor = updateLightColor.bind(this);

        getElement('light-red').oninput = e => updateLightColor();
        getElement('light-green').oninput = e => updateLightColor();
        getElement('light-blue').oninput = e => updateLightColor();
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