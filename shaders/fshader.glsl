#ifdef GL_ES
precision mediump float;
#endif

// Color
varying vec4 v_Color;

// Texture
uniform sampler2D u_Sampler;
varying vec2 v_TexCoord;

// Lighting
//uniform vec3 u_LightPos;
varying vec3 v_Normal;
varying vec3 v_FragPos;

void main() {
    // Transparency sorting
    vec4 texel = v_Color + texture2D(u_Sampler, v_TexCoord);

    // Lighting
    vec3 lightColor = vec3(1.0, 1.0, 1.0);
    vec3 lightPos = vec3(0, 5, 10);

    // AMBIANT LIGHTING
    float ambientStrength = 0.1;
    vec3 ambient = ambientStrength * lightColor;

    // DIFFUSE LIGHTING
    vec3 normal = normalize(v_Normal);
    vec3 lightDir = normalize(lightPos - v_FragPos);

    float diff = max(dot(normal, lightDir), 0.0);
    vec3 diffuse = diff * lightColor;

    // Lighting result
    vec3 light = ambient + diffuse;

    gl_FragColor = vec4(texel.rgb * light, texel.a);
}