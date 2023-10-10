uniform vec3 uWaterColor;


void main()
{
    gl_FragColor = vec4(uWaterColor, 1.0);
}