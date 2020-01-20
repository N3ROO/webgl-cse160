/**
 * File created by Lilian Gallon, 01/13/2020.
 * https://nero.dev
 * CSE160 / CSE160L
 *
 *
 * Here is how this file is designed:
 *
 * 1. Global vars:
 *      It contains all the global variables. We need to use
 *      global variables when we *really* need to.
 *
 * 2. Utility functions
 *      Here goes all the functions that we will use multiple
 *      times. These functions should not change for every case
 *      use. In fact, they are meant to work for any use.
 *
 * 3. Initialization
 *      Here goes the functions:
 *      -   init()
 *      -   postInit()
 *      They are self-documented.
 *
 * 4. Code
 *      Here goes the code to draw stuff.
 *
 *
 * Project architecture:
 *
 * - libs/ : Contains all the external libraries (cuon-utils, webgl-utils|debug)
 * - shaders/ : Contains the shaders' source code
 * - index.html : HTML code
 * - graphics.js : this
 */

// Global vars //

var VSHADER_SOURCE = null; // contains the vertex shader source code
var FSHADER_SOURCE = null; // contains the fragment shader source code
var CANVAS_ID = 'webgl'; // The canvas's id

// Controls
var C_CLEAR_BUTTON = 'clear';
var C_DRAWING_MODE = 0;
var C_RED = 0.5;
var C_GREEN = 0.0;
var C_BLUE = 1.0;
var C_SIZE = 40.0;
var C_SEGS = 10;
var C_DELAY = 100;

// Translation
var C_TX = 0.0;
var C_TY = 0.0;
var C_STEP = 0.01;

// Magic numbers (used by C_DRAWING_MODE)
var M_SQUARE = 0;
var M_TRIANGLE = 1;
var M_CIRCLE = 2;

// Utility functions //

/**
 * Function inspired from "WebGL Programming Guide: Interactive 3D Graphics
 * Programming with WebGL", 1st ed. written by Kouichi Matsudi and Rodger Lea
 * and published by WOW!.
 *
 * It loads a shader's source code. It must be called two times with the
 * vertex shader source code and the fragment shader source code.
 *
 * @param {WebGL2RenderingContext} gl WebGL context
 * @param {String} path shader path (../../../filename.extension)
 * @param {Shader} shader kind of shader (gl.VERTEX_SHADER or gl.FRAGMENT_SHADER)
 */
function loadShaderFile(gl, path, shader) {
    // ES7 async code
    (async() => {
        try {
            let response = await fetch(path);
            let code = await response.text();
            onLoadShader(gl, code, shader);
        } catch (e) {
            console.log(e);
        }
    })();
}

/**
 * Function inspired from "WebGL Programming Guide: Interactive 3D Graphics
 * Programming with WebGL", 1st ed. written by Kouichi Matsudi and Rodger Lea
 * and published by WOW!.
 *
 * It puts the shader's source code in the right variable. Then, if both of the
 * shaders' codes are loaded, it calls postInit().
 *
 * ERRORS:
 * - If the shader type is unknown, a message will be sent to the console displaying
 *      the wrong shader.
 * - If one of the shader's code is null, the code may stop here. In this case, there
 *      should be an other error message coming from an other function.
 *
 * @param {WebGL2RenderingContext} gl WebGL context
 * @param {String} code the shader's code
 * @param {Shader} type kind of shader (gl.VERTEX_SHADER or gl.FRAGMENT_SHADER)
 */
function onLoadShader(gl, code, shader) {
    switch (shader) {
        case gl.VERTEX_SHADER:
            VSHADER_SOURCE = code;
            break;
        case gl.FRAGMENT_SHADER:
            FSHADER_SOURCE = code;
            break;
        default:
            console.log("Unknown shader type");
            console.log(shader);
            break;
    }

    if(shadersLoaded()) {
        postInit(gl);
    }
}

/**
 * Returns true if the shaders' source codes were loaded.
 * Sources:
 * - VSHADER_SOURCE,
 * - FSHADER_SOURCE
 */
function shadersLoaded() {
    return VSHADER_SOURCE !== null && FSHADER_SOURCE !== null;
}

/**
 * It returns the canvas.
 *
 * ERROR:
 * It does not return anything if the canvas could not be found.
 */
function getCanvas() {
    let canvas = document.getElementById(CANVAS_ID);
    if (!canvas) {
        console.log('Could not find canvas with id "' + CANVAS_ID + '"');
        return;
    }

    return canvas;
}

/**
 * From coordinates on the canvas, it returns the coordinates on the
 * WebGL world.
 * @param {Float} x x canvas coordinate
 * @param {Float} y y canvas coordinate
 * @param {Array} r bounding rect of cursor
 *
 * @returns A 2D array containing [x, y], the coordinates in the WebGL world
 */
function canvasToWebglCoords(x, y, r) {
    let c = getCanvas();

    return [
        ((x - r.left) - c.height/2) / (c.height/2) - C_TX,
        (c.width/2 - (y - r.top)) / (c.width/2) - C_TY
    ];
}

/**
 * It clears the screen to black.
 * @param {WebGL2RenderingContext} gl WebGL context
 */
function clear(gl) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
}

// Init //

/**
 * Called when the HTML document is ready.
 *
 * It will call postInit once done.
 */
function init() {
    let gl = getWebGLContext(getCanvas());
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    loadShaderFile(gl, 'shaders/fshader.glsl', gl.FRAGMENT_SHADER);
    loadShaderFile(gl, 'shaders/vshader.glsl', gl.VERTEX_SHADER);

    // It will automatically call postInit once that the shaders' files are loaded
    // -> Because file loading is asynchronous
}

/**
 * Called when:
 * - The canvas is ready
 * - The WebGL context is ready
 * - The shaders' source code is loaded
 *
 * It should call start() once everything is initialized
 *
 * @param {WebGL2RenderingContext} gl WebGL Context
 */
function postInit(gl) {
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialize shaders:');
        console.log("Vertex shader code:", VSHADER_SOURCE);
        console.log("Fragment shader code:", FSHADER_SOURCE);
        return;
    }

    start(gl);
}

// Code //

/**
 * Called once everything has been initialized.
 *
 * @param {WebGL2RenderingContext} gl WebGL Context
 */
function start(gl) {

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
    document.getElementById(C_CLEAR_BUTTON).onclick = e => {
        clear(gl);
        shapes = [];
    }

    // This function returns true if the delay has been reached. It is used to know
    // if we will draw the shape on the screen when the mouse is moving. It prevent
    // creating a *huge* amount of shapes
    let lastTime = Date.now();
    function delayReached() {
        return Date.now() - lastTime >= C_DELAY;
    }

    // This function creates a shape on the specified coordinates (canvas coordinates)
    function createShape(x, y, r) {
        // Convert canvas coordinates to WebGL coordinates
        let coords = canvasToWebglCoords(x, y, r);

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

        // Drawing
        for (let shape of shapes) {
            // Used to clarify everything
            let x = shape[1][0]
            let y = shape[1][1];
            let size = shape[2];
            let r = shape[3][0];
            let g = shape[3][1];
            let b = shape[3][2];
            let a = 1.0;
            let segs = shape[4];

            // Let's say that we want a size of 40 *PIXELS*!
            // We know the canvas' dimensions. The WebGL dimensions
            // are 2 in both axis. Because it starts in the middle and
            // it goes from -1 to 1.
            // - So the size X (width) will be size * 2 / canvas' width
            // - And the size Y (height) will be size * 2 / canvas' height
            // Here are the computations:
            let sizeX = size * 2 / getCanvas().width;
            let sizeY = size * 2 / getCanvas().height;

            // This is an optimization. We won't draw the shapes that are outside
            // the canvas
            if ( (x + sizeX/2 + C_TX < - 1.0) || // out left
                 (x - sizeX/2 + C_TX > + 1.0) || // out right
                 (y + sizeY/2 + C_TY < - 1.0) || // out bottom
                 (y - sizeY/2 + C_TY > + 1.0)    // out top
                ) {
                continue;
            }

            let vertices = null;

            switch (shape[0]) {
                case M_SQUARE:
                    vertices = new Float32Array([
                        x - sizeX/2, y - sizeY/2, // Bottom-left corner
                        x - sizeX/2, y + sizeY/2, // Top-left corner
                        x + sizeX/2, y + sizeY/2, // Top-right corner
                        x + sizeX/2, y - sizeY/2  // Bottom-right corner
                    ])

                    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW); // We put the data inside of the buffer
                    gl.enableVertexAttribArray(a_Position); // We send the data to the variable
                    gl.uniform4f(u_FragColor, r, g, b, a);  // Color
                    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);   // Draw
                    shapesDrawn ++;
                    break;

                case M_TRIANGLE:
                    vertices = new Float32Array([
                        x - sizeX/2.0, y - sizeY/2.0, // bottom left corner
                        x, y + sizeY/2.0,             // top corner
                        x + sizeX/2.0, y - sizeY/2.0  // bottom right corner
                    ]);

                    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW); // We put the data inside of the buffer
                    gl.enableVertexAttribArray(a_Position); // We send the data to the variable
                    gl.uniform4f(u_FragColor, r, g, b, a);  // Color
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

                    // First free index of thhe array "vertices"
                    let index = 2;

                    // Basic trigonometry
                    for (let seg = 0; seg <= segs; seg ++) {
                        vertices[index] = x + sizeX/2 * Math.cos(seg * 2*Math.PI / segs);
                        index++;
                        vertices[index] = y + sizeY/2 * - Math.sin(seg * 2*Math.PI / segs);
                        index ++;
                    }

                    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW); // We put the data inside of the buffer
                    gl.enableVertexAttribArray(a_Position); // We send the data to the variable
                    gl.uniform4f(u_FragColor, r, g, b, a);  // Color
                    gl.drawArrays(gl.TRIANGLE_FAN, 0, n/2); // Draw
                    shapesDrawn ++;
                    break;

                default:
                    console.log("Unknown drawing mode: ", shape[0]);
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

    function updateStatistics(shapesDrawn, timeElapsed) {
        document.getElementById('stats').innerText =
            shapesDrawn + " shape(s) drawn in " + timeElapsed + " ms.";

        let color = "grey";
        if (timeElapsed <= 50) color = "green";
        else if (timeElapsed > 50 && timeElapsed < 80) color = "orange";
        else color = "red";

        document.getElementById('stats').style.color = color;
    }

    // Called whenever the mouse is released
    getCanvas().onmouseup = e => {
        mouseDown = false;
    }

    // Called whenever the mouse is pressed
    getCanvas().onmousedown = e => {
        // If the user just clicked, we want to reset the delay and to create a shape
        if (mouseDown === false) {
            createShape(e.clientX, e.clientY, e.target.getBoundingClientRect());
            updateScreen();
            lastTime = Date.now();
        }
        mouseDown = true;
    }

    // Called whenever the mouse is moving over the canvas
    getCanvas().onmousemove = e => {
        // We need to make sure that the delay is reached and that the mouse is pressed
        // to add a new shape on the screen
        if (mouseDown && delayReached()) {
            createShape(e.clientX, e.clientY, e.target.getBoundingClientRect());
            updateScreen();
            lastTime = Date.now();
        }
    }

    // Called whenever a key is down while the canvas is focused
    getCanvas().onkeydown = e => {
        if (e.keyCode === 65) translate(-C_STEP, 0); // left: a
        if (e.keyCode === 87) translate(0, +C_STEP); // up: w
        if (e.keyCode === 68) translate(+C_STEP, 0); // right: d
        if (e.keyCode === 83) translate(0, -C_STEP); // down: s
    }

    // Buttons to translate
    document.getElementById('translate-up').onclick    = e => { translate(0, + C_STEP); }
    document.getElementById('translate-down').onclick  = e => { translate(0, - C_STEP); }
    document.getElementById('translate-right').onclick = e => { translate(+ C_STEP, 0); }
    document.getElementById('translate-left').onclick  = e => { translate(- C_STEP, 0); }
}

// Controls

function updateColors() {
    let r = document.getElementById('red');
    let g = document.getElementById('green');
    let b = document.getElementById('blue');
    let p = document.getElementById('color-preview');

    C_RED = r.value;
    C_GREEN = g.value;
    C_BLUE = b.value;

    p.style.background = "rgb(" + C_RED*255 + "," + C_GREEN*255 + "," + C_BLUE*255 + ")"
}