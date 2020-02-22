// Position
attribute vec4 a_Position;
uniform mat4 u_ProjectionMatrix;
uniform mat4 u_ViewMatrix;
uniform mat4 u_ModelMatrix;

// Color
attribute vec4 a_Color;
varying vec4 v_Color;

// Texture
attribute vec2 a_TexCoord;
varying vec2 v_TexCoord;

// Lighting
attribute vec3 a_Normal;
varying vec3 v_Normal;
varying vec3 v_FragPos;

void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
    v_Color = a_Color;
    v_TexCoord = a_TexCoord;

    // Lighting
    v_FragPos = vec3(u_ModelMatrix * a_Position);
    v_Normal = a_Normal;
}