
void main()
{
    float strength = step(0.35, distance(gl_PointCoord, vec2(0.5)) + 0.25);

    gl_FragColor = vec4(vec3(1.0 - strength), 1.0);
}