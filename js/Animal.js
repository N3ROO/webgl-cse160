class Animal extends Shape {
    constructor(gl, matrix) {
        super(gl, matrix);
        this.shapes = [];
    }

    build() { }

    draw() {
        for (let shape of this.shapes) {
            shape.build();
            shape.draw();
        }
    }
}