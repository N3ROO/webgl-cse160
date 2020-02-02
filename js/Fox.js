/**
 * (c) 2020 Lilian Gallon, MIT License
 * File creation: 01/28/2020
 * UCSC, CSE160, Winter 2020
 * https://nero.dev
 *
 * Required:
 * - libs/
 * - Animal.js
 *
 * Description:
 *  This class creates a beautiful cubic cat!
 */

// Left, right, back and front are relative to the fox

var K_BODY       = "K_BODY";
var K_FR_FOOT    = "K_FR_FOOT";
var K_FL_FOOT    = "K_FL_FOOT";
var K_BR_FOOT    = "K_BR_FOOT";
var K_BL_FOOT    = "K_BL_FOOT";
var K_TAIL_1     = "K_TAIL_1";
var K_TAIL_2     = "K_TAIL_2";
var K_R_EAR      = "K_R_EAR";
var K_L_EAR      = "K_L_EAR";
var K_NOSE       = "K_NOSE";
var K_R_EYE      = "K_R_EYE";
var K_R_EYE_BALL = "K_R_EYE_BALL";
var K_L_EYE      = "K_L_EYE";
var K_L_EYE_BALL = "K_L_EYE_BALL";

var K_FEET_ANIM  = "K_FEET_ANIM";
var K_TAIL_ANIM1 = "K_TAIL_ANIM1";
var K_TAIL_ANIM2 = "K_TAIL_ANIM2";

class Fox extends Animal {

    constructor(gl, matrix) {
        super(gl, new Matrix4().translate(0, 1.6, 0).multiply(matrix));
        this.matrixUpdated = true;

        // Feet animation
        this.animations = new Map();
        this.animations.set(K_FEET_ANIM,  new Animation(-20, 20, 100, true));
        this.animations.set(K_TAIL_ANIM1, new Animation(-40, 40, 200, true));
        this.animations.set(K_TAIL_ANIM2, new Animation(-20, 20, 300, true));

        // Shapes
        this.shapes = new Map();
        this.shapes.set(K_BODY, new Cube(gl, new Matrix4(), [1, 0.5, 0]));
        this.shapes.set(K_FR_FOOT   , new Cube(gl, new Matrix4(), [1.0, 0.4, 0.0]));
        this.shapes.set(K_FL_FOOT   , new Cube(gl, new Matrix4(), [1.0, 0.4, 0.0]));
        this.shapes.set(K_BR_FOOT   , new Cube(gl, new Matrix4(), [1.0, 0.4, 0.0]));
        this.shapes.set(K_BL_FOOT   , new Cube(gl, new Matrix4(), [1.0, 0.4, 0.0]));
        this.shapes.set(K_TAIL_1    , new Cube(gl, new Matrix4(), [1.0, 0.4, 0.0]));
        this.shapes.set(K_TAIL_2    , new Cube(gl, new Matrix4(), [0.1, 0.1, 0.1]));
        this.shapes.set(K_R_EAR     , new Cube(gl, new Matrix4(), [0.2, 0.2, 0.2]));
        this.shapes.set(K_L_EAR     , new Cube(gl, new Matrix4(), [0.2, 0.2, 0.2]));
        this.shapes.set(K_NOSE      , new Cube(gl, new Matrix4(), [0.2, 0.2, 0.2]));
        this.shapes.set(K_R_EYE     , new Cube(gl, new Matrix4(), [1.0, 1.0, 1.0]));
        this.shapes.set(K_R_EYE_BALL, new Cube(gl, new Matrix4(), [0.1, 0.1, 0.1]));
        this.shapes.set(K_L_EYE     , new Cube(gl, new Matrix4(), [1.0, 1.0, 1.0]));
        this.shapes.set(K_L_EYE_BALL, new Cube(gl, new Matrix4(), [0.1, 0.1, 0.1]));
    }

    update(dt) {
        if (this.matrixUpdated) {
            this._updateStaticParts();
            this._updateFeet(dt);
            this._updateTail(dt);
        } else if (!this.animations.get(K_FEET_ANIM).isPaused()) {
            this._updateFeet(dt);
        } else if (!this.animations.get(K_TAIL_ANIM1).isPaused() || (!this.animations.get(K_TAIL_ANIM2).isPaused())) {
            this._updateTail(dt);
        }

        this.matrixUpdated = false;
    }

    //// UTILITY ////

    requestUpdate() {
        this.matrixUpdated = true;
    }

    setMatrix(matrix) {
        this.matrix = matrix;
        this.matrixUpdated = true;
    }

    moveToDefaultPosition() {
        this.setMatrix((new Matrix4()).translate(0, 1.6, 0));
    }

    //// ANIMATION HANDLERS METHODS ////

    move () {
        this.animations.forEach((animation, k) => {
            if (animation.isFinished()) {
                animation.start();
            }
        });

        this.setMatrix(this.matrix.translate(0, 0, -0.03));
    }

    stopMoving () {
        this.animations.forEach((animation, k) => {
            animation.stop();
        });

        this.moveToDefaultPosition();
    }

    happy () {

    }

    //// PRIVATE METHODS ////

    _updateStaticParts() {
        this.shapes.get(K_BODY).setMatrix(
            this._getMMatrixCopy()
            .scale(1, 1, 2)
            .translate(0, 0, 1)
        )

        this.shapes.get(K_R_EAR).setMatrix(
            this._getMMatrixCopy()
            .translate(0.5, 1, 0.5)
            .scale(0.3, 0.5, 0.2)
        )

        this.shapes.get(K_L_EAR).setMatrix(
            this._getMMatrixCopy()
            .translate(-0.5, 1, 0.5)
            .scale(0.3, 0.5, 0.2)
        )

        this.shapes.get(K_NOSE).setMatrix(
            this._getMMatrixCopy()
            .translate(0, -0.3, 0)
            .scale(0.25, 0.25, 0.6)
        )

        this.shapes.get(K_R_EYE).setMatrix(
            this._getMMatrixCopy()
            .translate(0.4, 0.25, 0)
            .scale(0.2, 0.2, 0.1)
        )

        this.shapes.get(K_R_EYE_BALL).setMatrix(
            (new Matrix4(this.shapes.get(K_R_EYE).getMatrix()))
            .scale(0.5, 0.5, 1)
            .translate(0, 0, -0.1)
        )

        this.shapes.get(K_L_EYE).setMatrix(
            this._getMMatrixCopy()
            .translate(-0.4, 0.25, 0)
            .scale(0.2, 0.2, 0.1)
        )

        this.shapes.get(K_L_EYE_BALL).setMatrix(
            (new Matrix4(this.shapes.get(K_L_EYE).getMatrix()))
            .scale(0.5, 0.5, 1)
            .translate(0, 0, -0.1)
        )
    }

    _updateTail(dt) {
        let anims = [
            this.animations.get(K_TAIL_ANIM1),
            this.animations.get(K_TAIL_ANIM2)
        ];

        let rotations = [];
        for (let anim of anims) {
            anim.tick(dt);
            rotations.push(anim.isFinished() ? 0 : anim.getProgress());
        }

        this.shapes.get(K_TAIL_1).setMatrix(
            this._getMMatrixCopy()
            .translate(0, 0, 4.5)
            .rotate(rotations[0], 0, 1, 0)
            .scale(0.3, 0.3, 0.6) // 0.6 -> length
        )

        this.shapes.get(K_TAIL_2).setMatrix(
            (new Matrix4(this.shapes.get(K_TAIL_1).getMatrix()))
            .scale(10/3, 10/3, 10/6)
            .translate(0, 0, 0.8)
            .rotate(rotations[1], 0, 1, 0)
            .scale(0.3, 0.3, 0.2)
        )
    }

    _updateFeet(dt) {
        let anim = this.animations.get(K_FEET_ANIM);

        anim.tick(dt);
        let alpha = anim.isFinished() ? 0 : anim.getProgress();

        this.shapes.get(K_FR_FOOT).setMatrix(
            this._getMMatrixCopy()
            .translate(0.5, -1.1, 0.6)
            .rotate(alpha, -1, 0, 0)
            .scale(0.4, 0.5, 0.4)
        );

        this.shapes.get(K_FL_FOOT).setMatrix(
            this._getMMatrixCopy()
            .translate(-0.5, -1.1, 0.6)
            .rotate(-alpha, -1, 0, 0)
            .scale(0.4, 0.5, 0.4)
        );

        this.shapes.get(K_BL_FOOT).setMatrix(
            this._getMMatrixCopy()
            .translate(0.5, -1.1, 3.4)
            .rotate(-alpha, -1, 0, 0)
            .scale(0.4, 0.5, 0.4)
        );

        this.shapes.get(K_BR_FOOT).setMatrix(
            this._getMMatrixCopy()
            .translate(-0.5, -1.1, 3.4)
            .rotate(alpha, -1, 0, 0)
            .scale(0.4, 0.5, 0.4)
        );
    }

    _getMMatrixCopy() {
        return new Matrix4(this.matrix);
    }
}