class Animal extends Shape {
    constructor(gl, matrix) {
        super(gl, matrix);
        this.shapes = [];
    }

    build() { }

    update(dt) { }

    draw() {
        for (let shape of this.shapes) {
            shape.build();
            shape.draw();
        }
    }
}