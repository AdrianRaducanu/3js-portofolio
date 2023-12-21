uniform float uTime;
attribute vec3 aRandom;

void main()
{

    float speedY = uTime / 2.0;
    float windFactor = aRandom.x * 1.5;

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float minY = modelPosition.y - 30.0;

    // Using a single mod to handle wrapping around and continuous motion
    float yMovement = mod(modelPosition.y - uTime * 20.0 + minY, 30.0);
    float xMovement = modelPosition.x - yMovement;

    vec4 viewPosition = viewMatrix * vec4(xMovement, yMovement, modelPosition.z, 1.0);
    float depth = - viewPosition.z;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    gl_Position = projectedPosition;
    gl_PointSize = 100.0 / depth;
}