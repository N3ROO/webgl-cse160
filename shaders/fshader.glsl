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
uniform vec3 u_ViewPosition;
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
    vec3 specular = vec3(0, 0, 0);

    // The specular function is actually going to be the same for front and back faces because GLSL
    // reflect is insensitive to the sign of the normal. So we need to check it first, and we can do
    // that by checking nDotL. -> reflect(I, N) = I - 2.0 * dot(N, I) * N
    // So it prevents specular ligthing from showing on the back faces
    if (nDotL > 0.0) {
        float n = 10.0;
        vec3 V = normalize(u_ViewPosition - v_Position);
        vec3 R = reflect(- lightDirection, normal);
        specular = vec3(1.0, 1.0, 1.0) * pow(clamp(dot(V, R), 0.0, 1.0), n);
    }

    vec3 lighting = u_AmbientLight + diffuse + specular;

    // Result
    gl_FragColor = vec4(texel.rgb * lighting, texel.a);
   // gl_FragColor = vec4(normal*0.5+0.5, texel.a);

}