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
attribute vec3 a_VertexNormal;
uniform mat4 u_NormalMatrix;
varying vec3 v_Lighting;

void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
    v_Color = a_Color;
    v_TexCoord = a_TexCoord;

    // Lighting

    // Data
    vec3 ambientLight = vec3(0.3, 0.3, 0.3);
    vec3 directionalLightColor = vec3(1.0, 1.0, 1.0);
    vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

    vec4 transformedNormal = u_NormalMatrix * vec4(a_VertexNormal, 1.0);
    float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);

    v_Lighting = ambientLight + (directionalLightColor * directional);
}