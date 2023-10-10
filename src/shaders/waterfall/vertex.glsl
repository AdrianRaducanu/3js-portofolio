uniform float uWavesAmpl;
uniform float uTime;

varying float vElevation;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    float elevation = (sin(modelPosition.x * 1.5 + uTime) * cos(modelPosition.z * 1.5 + uTime) * uWavesAmpl);
    modelPosition.y += elevation;
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;

    vElevation = elevation;
}