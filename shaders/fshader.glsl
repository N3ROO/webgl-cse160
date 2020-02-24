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
varying vec3 v_Position;
varying vec3 v_Normal;

// Shadow
uniform sampler2D u_ShadowMap;
varying vec4 v_PositionFromLight;

void main() {
    // Texture / coloring
    vec4 texel = v_Color + texture2D(u_Sampler, v_TexCoord);

    // Lighting
    vec3 normal = normalize(v_Normal); // Normalize normal because it's interpolated and not 1.0 (length)
    vec3 lightDirection = normalize(u_LightPosition - v_Position); // Light direction w/ length=1
    float nDotL = max(dot(normalize(lightDirection), normal), 0.0); // Resulting vector between the light direction and the normal vector
    vec3 diffuse = u_LightColor * nDotL; // Calculate the color due to the refexion

    vec3 lighting = u_AmbientLight + diffuse;

    // Shadow
    vec3 shadowCoord = (v_PositionFromLight.xyz / v_PositionFromLight.w) / 2.0 + 0.5;
    vec4 rgbaDepth = texture2D(u_ShadowMap, shadowCoord.xy);
    float depth = rgbaDepth.r;

    float visibility = (shadowCoord.z > depth + 0.005) ? 0.7 : 1.0;

    // Result
    gl_FragColor = vec4(texel.rgb * lighting /** visibility*/, texel.a);
}