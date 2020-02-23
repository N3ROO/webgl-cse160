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
attribute vec4 a_Normal;
uniform vec3 u_AmbientLight;
uniform vec3 u_LightColor;
uniform vec3 u_LightPosition;
uniform mat4 u_NormalMatrix;
varying vec3 v_Lighting;


void main() {
    gl_Position = u_ProjectionMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
    v_Color = a_Color;
    v_TexCoord = a_TexCoord;

    // Lighting

    vec3 normal = normalize(vec3(u_NormalMatrix * a_Normal)); // Length = 1
    vec4 vertexPosition = u_ModelMatrix * a_Position; // World coordinate of the vertex
    vec3 lightDirection = normalize(u_LightPosition - vec3(vertexPosition)); // Light direction w/ length=1
    float nDotL = max(dot(normalize(lightDirection), normal), 0.0); // Resulting vector between the light direction and the normal vector
    vec3 diffuse = u_LightColor * nDotL; // Calculate the color due to the refexion

    // Send the lighint effect to the fragment shader
    v_Lighting = u_AmbientLight + diffuse;
}