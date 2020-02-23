#ifdef GL_ES
precision mediump float;
#endif

// Color
varying vec4 v_Color;

// Texture
uniform sampler2D u_Sampler;
varying vec2 v_TexCoord;

// Lighting
varying highp vec3 v_Lighting;

void main() {
    vec4 texel = v_Color + texture2D(u_Sampler, v_TexCoord);
    gl_FragColor = vec4(texel.rgb * v_Lighting, texel.a);
}