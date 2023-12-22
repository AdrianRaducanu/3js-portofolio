void main()
{
    // Light point
    float strength = distance(gl_PointCoord, vec2(0.5)) / 0.9;
    strength = 1.0 - strength;
    strength = pow(strength, 7.0);

    vec3 vColor = vec3(0.0549, 0.3216, 0.4314);
    vec3 color = mix(vec3(0.0), vColor, strength);
    gl_FragColor = vec4(color, 1.0);
}