/**
 * (c) 2020 Lilian Gallon, MIT License
 * File creation: 01/23/2020
 * UCSC, CSE160, Winter 2020
 * https://nero.dev
 *
 * Required:
 *  - Nothing
 *
 * Description:
 *  TODO:
 */

//// CONTROLS (used by the buttons) ////

var C_AXIS = true;
var C_FLOOR = true;
var C_FOLLOW = true;

//// OUI ////

class HtmlEvents {

    constructor (world) {
        this.world = world;
    }

    registerEvents () {
        getElement("feet-anim").onclick = e => {
            this._toggleAnimation(
                this.world.getFox().animations.get(K_FEET_ANIM),
                FEET_ANIM_S,
                FEET_ANIM_E,
                e.target
            );
        }

        getElement("tail-anim-1").onclick = e => {
            this._toggleAnimation(
                this.world.getFox().animations.get(K_TAIL_ANIM1),
                TAIL_ANIM_1_S,
                TAIL_ANIM_1_E,
                e.target,
                [getElement("tail-anim-2"), getElement("tail-anim-n")]
            );
        }

        getElement("tail-anim-2").onclick = e => {
            this._toggleAnimation(
                this.world.getFox().animations.get(K_TAIL_ANIM2),
                TAIL_ANIM_2_S,
                TAIL_ANIM_2_E,
                e.target,
                [getElement("tail-anim-1"), getElement("tail-anim-n")]
            );
        }

        getElement("tail-anim-n").onclick = e => {
            this._toggleAnimation(
                this.world.getFox().animations.get(K_TAIL_ANIM1),
                TAIL_ANIM_N_S,
                TAIL_ANIM_N_E,
                [getElement("tail-anim-1"), getElement("tail-anim-2")]
            );

            this._toggleAnimation(
                this.world.getFox().animations.get(K_TAIL_ANIM2),
                TAIL_ANIM_N_S,
                TAIL_ANIM_N_E,
                e.target,
                [getElement("tail-anim-1"), getElement("tail-anim-2")]
            );
        }

        getElement("breakdance").onclick = e => {
            this.world.getFox().breakdance();
        }

        getElement("reset-cam").onclick = e => {
            this.world.resetCamera();
        }
    }

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