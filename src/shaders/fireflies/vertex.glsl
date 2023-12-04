uniform float uTime;
uniform float uX;
uniform float uY;
uniform float uZ;
attribute vec3 aRandom;

void main()
{
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.x = uX + cos(uTime * aRandom.x) * aRandom.x;
    modelPosition.y = uY + cos(uTime * aRandom.y) * aRandom.y;
    modelPosition.z = uZ + sin(uTime * aRandom.z) * aRandom.z;

    vec4 viewPosition = viewMatrix * modelPosition;
    float depth = - viewPosition.z;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;
    gl_PointSize = 100.0 / depth;
}