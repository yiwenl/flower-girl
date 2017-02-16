precision highp float;

varying vec2 vUV;

uniform sampler2D texture;
uniform vec3 uOutlineColor;

void main(void) {
    vec4 color = vec4(uOutlineColor, 1.0);

    vec4 colorNoise = texture2D(texture, vUV);
    color.rgb *= (colorNoise.rgb);

    gl_FragColor = color;
}