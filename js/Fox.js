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


class Fox extends Animal {

    constructor(gl, matrix) {
        super(gl, matrix);

        let color = [0.7, 0.65, 0.72];
        let m = null;

        //// Body ////
        m = (new Matrix4()).scale(1, 1, 2).translate(0, 0, 1);
        this.shapes.push(new Cube(gl, m, [1, 0.5, 0]));

        //// FEET ///
        color = [1, 0.4, 0];
        this.sAngle = -20;
        this.eAngle = 20;
        this.cAngle = this.sAngle;
        this.step = 100;

        this.shapes.push(new Cube(gl, new Matrix4(), color)); // front right (relative to fox)
        this.FR_FOOT_IDX = 1;
        this.FR_FOOT_MAT = m;

        this.shapes.push(new Cube(gl, new Matrix4(), color)); // front left (relative to fox)
        this.FL_FOOT_IDX = 2;
        this.FL_FOOT_MAT = m;

        this.shapes.push(new Cube(gl, new Matrix4(), color)); // back right (relative to fox)
        this.BR_FOOT_IDX = 3;
        this.BR_FOOT_MAT = m;

        this.shapes.push(new Cube(gl, new Matrix4(), color)); // back left (relative to fox)
        this.BL_FOOT_IDX = 4;
        this.BL_FOOT_MAT = m;

        //// TAIL ////
        let length = 0.6;

        m = new Matrix4();
        m.translate(0, 0, 4.5);
        m.scale(0.3, 0.3, length);
        this.shapes.push(new Cube(gl, new Matrix4(m), color));

        m.translate(0, 0, length + 1);
        m.scale(1, 1, 0.6);
        this.shapes.push(new Cube(gl, m, [0.1,0.1,0.1]));

        //// EARS ////
        color = [0.2, 0.2, 0.2];

        m = new Matrix4();
        m.translate(0.5, 1, 0.5);
        m.scale(0.3, 0.5, 0.2);
        this.shapes.push(new Cube(gl, m, color));

        m = new Matrix4();
        m.translate(-0.5, 1, 0.5);
        m.scale(0.3, 0.5, 0.2);
        this.shapes.push(new Cube(gl, m, color));

        //// NOSE ////
        m = new Matrix4();
        m.translate(0, -0.3, 0);
        m.scale(0.25, 0.25, 0.6);
        this.shapes.push(new Cube(gl, m, color));

        //// EYES ////
        color = [1, 1, 1];

        m = new Matrix4();
        m.translate(0.4, 0.25, 0);
        m.scale(0.2, 0.2, 0.1);
        this.shapes.push(new Cube(gl, new Matrix4(m), color)); // right eye

        m.scale(0.5, 0.5, 1);
        m.translate(0, 0, -0.1)
        this.shapes.push(new Cube(gl, m, [0.1,0.1,0.1]));

        m = new Matrix4();
        m.translate(-0.4, 0.25, 0);
        m.scale(0.2, 0.2, 0.1);
        this.shapes.push(new Cube(gl, new Matrix4(m), color)); // right eye

        m.scale(0.5, 0.5, 1);
        m.translate(0, 0, -0.1)
        this.shapes.push(new Cube(gl, m, [0.1,0.1,0.1]));
    }

    update(dt) {
        if (Math.abs(this.cAngle) > Math.abs(this.eAngle)) {
            let tmp = this.sAngle;
            this.sAngle = this.eAngle;
            this.eAngle = tmp;
        }

        if (this.sAngle >= this.eAngle) {
            this.cAngle -= this.step * dt;
        } else {
            this.cAngle += this.step * dt;
        }

        this.shapes[this.FR_FOOT_IDX].setMatrix(
            (new Matrix4())
            .translate(0.5, -1.1, 0.6)
            .rotate(this.cAngle, -1, 0, 0)
            .scale(0.4, 0.5, 0.4)
        );

        this.shapes[this.FL_FOOT_IDX].setMatrix(
            (new Matrix4())
            .translate(-0.5, -1.1, 0.6)
            .rotate(-this.cAngle, -1, 0, 0)
            .scale(0.4, 0.5, 0.4)
        );

        this.shapes[this.BL_FOOT_IDX].setMatrix(
            (new Matrix4())
            .translate(0.5, -1.1, 3.4)
            .rotate(-this.cAngle, -1, 0, 0)
            .scale(0.4, 0.5, 0.4)
        );

        this.shapes[this.BR_FOOT_IDX].setMatrix(
            (new Matrix4())
            .translate(-0.5, -1.1, 3.4)
            .rotate(this.cAngle, -1, 0, 0)
            .scale(0.4, 0.5, 0.4)
        );

    /*
        this.shapes[this.BR_FOOT_IDX].getMatrix().multiply(
            (new Matrix4()).rotate(-this.cAngle*0.1, 1, 0, 0)
        );

        this.shapes[this.FL_FOOT_IDX].getMatrix().multiply(
            (new Matrix4()).rotate(this.cAngle*0.1, 1, 0, 0)
        );

        this.shapes[this.FR_FOOT_IDX].getMatrix().multiply(
            (new Matrix4()).rotate(-this.cAngle*0.1, 1, 0, 0)
        );

        this.shapes[this.BL_FOOT_IDX].getMatrix().multiply(
            (new Matrix4()).rotate(this.cAngle*0.1, 1, 0, 0)
        );

        this.shapes[this.BR_FOOT_IDX].getMatrix().multiply(
            (new Matrix4()).rotate(-this.cAngle*0.1, 1, 0, 0)
        );*/
    
    }
}