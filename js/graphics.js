/**
 * (c) 2020 Lilian Gallon, MIT License
 * File creation: 01/23/2020
 * UCSC, CSE160, Winter 2020
 * https://nero.dev
 *
 * Required:
 * - libs/
 * - init.js
 * - utils.js
 * - input.js
 *
 * Description:
 *  It contains the code to create, and draw things on the screen.
 */

 /**
 * Called once everything has been initialized.
 *
 * @param {WebGL2RenderingContext} gl WebGL Context
 */
function main(gl) {

    // We clear the screen while there is no events
    clear(gl);

    // We need to access to these varaibles to update the shape's properties
    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    let u_Translation = gl.getUniformLocation(gl.program, 'u_Translation');
    let u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');

    // We will store all the shapes in this container to render them
    let shapes = [];

    // This is used to know the state of the mouse
    let mouseDown = false;

    // We don't want to put gl and shapes as global variables. So we create a
    // listener on the clear button since we have access to theses variables here
    getElement(C_CLEAR_BUTTON).onclick = e => {
        clear(gl);
        shapes = [];
    }

    // This var will be used when calling dealayReached(). It is used to know
    // if we will draw the shape on the screen when the mouse is moving. It
    // prevent creating a *huge* amount of shapes.
    let lastTime = Date.now();

    // This function creates a shape on the specified coordinates (canvas coordinates)
    function createShape(x, y, r) {
        // Convert canvas coordinates to WebGL coordinates
        let coords = canvasToWebglCoords(x, y, r, C_TX, C_TY);

        // Building the shape
        let shape = [
            C_DRAWING_MODE,             // Shape type (0: square, 1: triangle, 2: circle)
            coords,                     // Shape's coordinates
            C_SIZE,                     // Shape's size
            [C_RED, C_GREEN, C_BLUE],   // Shape's color
            C_SEGS                      // Shape's number of segments (used for circles)
        ];

        shapes.push(shape);
    }

    // This function renders all the shapes on the screen
    function updateScreen() {
        // Used for statistics
        let shapesDrawn = 0;
        let startingTime = Date.now();

        // Clearing
        clear(gl);

        // Setting up a buffer to send data to the GPU
        let buffer = gl.createBuffer();
        if (!buffer) {
            console.log("Failed to create a buffer object")
            return;
        }
        // We say that this buffer is an array
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        // We connect this buffer with the variable a_Position
        gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

        // The array is related linked to a_Position
        gl.enableVertexAttribArray(a_Position);

        // We set the color here because it costs a lot of time to do it everytime
        // We will update it only if the shape has a different color than the last one
        gl.uniform4f(u_FragColor, C_RED, C_GREEN, C_BLUE, 1.0);
        let lastRed = C_RED;
        let lastGreen = C_GREEN;
        let lastBlue = C_BLUE;

        // Drawing
        for (let shape of shapes) {
            // Used to clarify everything
            let x    = shape[1][0]
            let y    = shape[1][1];
            let size = shape[2];
            let r    = shape[3][0];
            let g    = shape[3][1];
            let b    = shape[3][2];
            let a    = 1.0;
            let segs = shape[4];

            // Let's say that we want a size of 40 *PIXELS*!
            // We know the canvas' dimensions. The WebGL dimensions
            // are 2 in both axis. Because it starts in the middle and
            // it goes from -1 to 1.
            // - So the size X (width) will be size * 2 / canvas' width
            // - And the size Y (height) will be size * 2 / canvas' height
            // Here are the computations:
            let sizeX = size * 2 / getElement(CANVAS_ID).width;
            let sizeY = size * 2 / getElement(CANVAS_ID).height;

            // This is an optimization. We won't draw the shapes that are outside
            // the canvas
            if (outsideOfScreen(x, y, sizeX, sizeY, C_TX, C_TY)){
                continue;
            }

            // We update the color only if needed, because it costs a lot of time
            if (r !== lastRed || g !== lastGreen || b !== lastBlue) {
                gl.uniform4f(u_FragColor, r, g, b, 1.0);  // Color
                lastRed = r;
                lastBlue = b;
                lastGreen = g;
            }

            let vertices = null;

            switch (shape[0]) {
                case M_SQUARE:
                    vertices = new Float32Array([
                        x - sizeX/2.0, y - sizeY/2.0, // Bottom-left corner
                        x - sizeX/2.0, y + sizeY/2.0, // Top-left corner
                        x + sizeX/2.0, y + sizeY/2.0, // Top-right corner
                        x + sizeX/2.0, y - sizeY/2.0  // Bottom-right corner
                    ])

                    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW); // We put the data inside of the buffer
                    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);   // Draw
                    shapesDrawn ++;
                    break;

                case M_TRIANGLE:
                    vertices = new Float32Array([
                        x - sizeX/2.0, y - sizeY/2.0, // bottom left corner
                        x            , y + sizeY/2.0, // top corner
                        x + sizeX/2.0, y - sizeY/2.0  // bottom right corner
                    ]);

                    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW); // We put the data inside of the buffer
                    gl.drawArrays(gl.TRIANGLES, 0, 3); // Draw 3 triangles
                    shapesDrawn ++;
                    break;

                case M_CIRCLE:
                    // We want C_SEGS segments, so C_SEGS triangles. We will conenct triangles with
                    // TRIANGLE_FAN. We multiply by 2 because a point is defined by two coordinates (x, y).
                    // "+4" Comes from the fact that we need to include:
                    // - The center of the circle (x, y),
                    // - The end of the circle (a point that already exists).
                    let n = segs * 2 + 4;
                    vertices = new Float32Array(n);

                    // Center of the circle
                    vertices[0] = x;
                    vertices[1] = y;

                    // First free index of the array "vertices"
                    let index = 2;

                    // Basic trigonometry
                    for (let seg = 0; seg <= segs; seg ++) {
                        vertices[index] = x + sizeX/2.0 * Math.cos(seg * 2.0*Math.PI / segs);
                        index++;
                        vertices[index] = y + sizeY/2.0 * - Math.sin(seg * 2.0*Math.PI / segs);
                        index ++;
                    }

                    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW); // We put the data inside of the buffer
                    gl.drawArrays(gl.TRIANGLE_FAN, 0, n/2); // Draw
                    shapesDrawn ++;
                    break;

                default:
                    console.error("Unknown drawing mode: ", shape[0]);
            }
        }

        // We destroy the buffer since we won't use it anymore
        gl.deleteBuffer(buffer);

        // Update statistics
        updateStatistics(shapesDrawn, Date.now() - startingTime);
    }

    // It translates the shapes with the given deltas
    function translate(dx, dy) {
        C_TX += dx;
        C_TY += dy;
        gl.uniform4f(u_Translation, C_TX, C_TY, 0.0, 0.0);
        updateScreen();
    }

    // Called whenever the mouse is released
    getElement(CANVAS_ID).onmouseup = e => {
        mouseDown = false;
    }

    // Called whenever the mouse is pressed
    getElement(CANVAS_ID).onmousedown = e => {
        // If the user just clicked, we want to reset the delay and to create a shape
        if (mouseDown === false) {
            createShape(e.clientX, e.clientY, e.target.getBoundingClientRect());
            updateScreen();
            lastTime = Date.now();
        }
        mouseDown = true;
    }

    // Called whenever the mouse is moving over the canvas
    getElement(CANVAS_ID).onmousemove = e => {
        // We need to make sure that the delay is reached and that the mouse is pressed
        // to add a new shape on the screen
        if (mouseDown && delayReached(lastTime, C_DELAY)) {
            createShape(e.clientX, e.clientY, e.target.getBoundingClientRect());
            updateScreen();
            lastTime = Date.now();
        }
    }

    // Called whenever a key is down while the canvas is focused
    getElement(CANVAS_ID).onkeydown = e => {
        if (e.keyCode === 65) translate(- C_STEP, 0       ); // left: a
        if (e.keyCode === 87) translate(0       , + C_STEP); // up: w
        if (e.keyCode === 68) translate(+ C_STEP, 0       ); // right: d
        if (e.keyCode === 83) translate(0       , - C_STEP); // down: s
    }

    // Buttons to translate
    getElement('translate-up').onclick    = e => { translate(0, + C_STEP); }
    getElement('translate-down').onclick  = e => { translate(0, - C_STEP); }
    getElement('translate-right').onclick = e => { translate(+ C_STEP, 0); }
    getElement('translate-left').onclick  = e => { translate(- C_STEP, 0); }
}