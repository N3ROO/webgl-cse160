/**
 * File created by Lilian Gallon, 01/13/2020.
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

// Utility functions //

/**
 * Function inspired from "WebGL Programming Guide: Interactive 3D Graphics
 * Programming with WebGL", 1st ed. written by Kouichi Matsudi and Rodger Lea
 * and published by WOW!.
 *
 * It loads a shader's source code. It must be called two times with the
 * vertex shader source code and the fragment shader source code.
 *
 * TODO: better error handling
 *
 * @param {WebGL2RenderingContext} gl WebGL context
 * @param {String} path shader path (../../../filename.extension)
 * @param {Shader} shader kind of shader (gl.VERTEX_SHADER or gl.FRAGMENT_SHADER)
 */
function loadShaderFile(gl, path, shader) {
    let request = new XMLHttpRequest();

    request.onreadystatechange = () => {
        // 4 -> response received, 200 -> success
        if (request.readyState === 4 && request.status === 200) {
            onLoadShader(gl, request.responseText, shader);
        }
    }

    // Open path using the GET HTTP protocol and using ajax
    request.open('GET', path, true);
    request.send();
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

// Init //

/**
 * Called when the HTML document is ready.
 *
 * It will call postInit once done.
 */
function init() {
    let canvas = document.getElementById(CANVAS_ID);
    if (!canvas) {
        console.log('Could not find canvas with id "' + CANVAS_ID + '"');
        return;
    }

    let gl = getWebGLContext(canvas);
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
    // Sample code

    let a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return;
    }
    gl.vertexAttrib3f(a_Position, 0.0, 0.0, 0.0);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.POINTS, 0, 1);
}