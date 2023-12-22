#define PI 3.1415926535897932384626433832795

varying float vTime;

void main()
{
    float lineWidth = 0.15;

    vec2 center = vec2(gl_PointCoord.x - 0.5, gl_PointCoord.y - 0.5);

    float angle = atan(center.y, center.x) + vTime;

    float circleToMask = step(0.55, distance(gl_PointCoord, vec2(0.5)) + 0.35);
    float circleInside = step(0.55, distance(gl_PointCoord, vec2(0.5)) + 0.45);

    float snowFlake = 1.0 - step(lineWidth, mod(angle, PI / 4.0)) * circleInside;

    float snowFlakeWithMask = step(snowFlake, circleToMask);

    gl_FragColor = vec4(vec3(1.0 - snowFlakeWithMask), 1.0);
}