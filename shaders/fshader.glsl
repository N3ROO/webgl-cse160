#ifdef GL_ES
precision mediump float;
#endif

// Color
varying vec4 v_Color;

// Texture
uniform sampler2D u_Sampler;
varying vec2 v_TexCoord;

// Lighting
uniform vec3 u_AmbientLight;
uniform vec3 u_LightColor;
uniform vec3 u_LightPosition;
varying vec3 v_ViewPosition;
varying vec3 v_Position;
varying vec3 v_Normal;

void main() {
    // Texture / coloring
    vec4 texel = v_Color + texture2D(u_Sampler, v_TexCoord);

    // Lighting
    vec3 normal = normalize(v_Normal); // Normalize normal because it's interpolated and not 1.0 (length)
    vec3 lightDirection = normalize(u_LightPosition - v_Position); // Light direction w/ length=1

    // Diffuse lighting
    float nDotL = max(dot(normalize(lightDirection), normal), 0.0); // Resulting vector between the light direction and the normal vector
    vec3 diffuse = u_LightColor * nDotL; // Calculate the color due to the refexion

    // Specular lighting
    float n = 64.0;
    vec3 V = normalize(v_ViewPosition - v_Position);
    vec3 R = reflect(- lightDirection, normal);
    vec3 specular = vec3(1.0, 0.0, 0.0) * pow(max(dot(V, R), 0.0), n);

    vec3 lighting = u_AmbientLight + diffuse + specular;

    // Result
    gl_FragColor = vec4(texel.rgb * lighting, texel.a);
    //gl_FragColor = vec4(normal*0.5+0.5, texel.a);

}