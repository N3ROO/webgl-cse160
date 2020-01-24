/**
 * (c) 2020 Lilian Gallon, MIT License
 * File creation: 01/13/2020
 * UCSC, CSE160, Winter 2020
 * https://nero.dev
 *
 * Required:
 * - libs/*
 * - utils.js
 *
 * Description:
 *  It initializes everything needed to run WebGL on the given
 *  canvas (CANVAS_ID). Once that everything is ready, the main()
 *  is called.
 */

// Global vars //

var VSHADER_SOURCE = null; // contains the vertex shader source code
var FSHADER_SOURCE = null; // contains the fragment shader source code
var CANVAS_ID = 'webgl'; // The canvas's id

// Loading functions //

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
            console.error(e);
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
            console.error("Unknown shader type", shader);
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

// Initialization functions //

/**
 * Called when the HTML document is ready.
 *
 * It will call postInit once done.
 */
function init() {
    let gl = getWebGLContext(getElement(CANVAS_ID));
    if (!gl) {
        console.error('Failed to get the rendering context for WebGL');
        return;
    }

    loadShaderFile(gl, 'shaders/fshader.glsl', gl.FRAGMENT_SHADER);
    loadShaderFile(gl, 'shaders/vshader.glsl', gl.VERTEX_SHADER);

    // It will automatically call init once that the shaders' files are loaded
    // -> Because file loading is asynchronous
}

/**
 * Called when:
 * - The canvas is ready
 * - The WebGL context is ready
 * - The shaders' source code is loaded
 *
 * It should call main() once everything is initialized
 *
 * @param {WebGL2RenderingContext} gl WebGL Context
 */
function postInit(gl) {
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.error('Failed to initialize shaders:');
        console.error("Vertex shader code:", VSHADER_SOURCE);
        console.error("Fragment shader code:", FSHADER_SOURCE);
        return;
    }

    main(gl);
}