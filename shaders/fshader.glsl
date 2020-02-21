#ifdef GL_ES
precision mediump float;
#endif

// Color
varying vec4 v_Color;

// Texture
uniform sampler2D u_Sampler;
varying vec2 v_TexCoord;

void main() {
    // Transparency sorting
    vec4 texel = v_Color + texture2D(u_Sampler, v_TexCoord);
    if(texel.a < 0.5)
        discard;
    gl_FragColor = texel;
}