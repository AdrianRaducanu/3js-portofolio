precision mediump float;

uniform sampler2D uTexture;
varying float vDistanceX;

void main() {
    vec2 uv = gl_PointCoord;
    uv.y = 1.0 - uv.y;
    vec4 color = texture2D(uTexture, uv);
    color.a = color.a * vDistanceX ;
    gl_FragColor = color;
}