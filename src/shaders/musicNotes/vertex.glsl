uniform float uTime;
uniform float uX;
uniform float uY;
uniform float uZ;
attribute vec3 aRandom;

varying float vDistanceX;

void main()
{
    float maxX = uX + 2.0;

    float speedX = uTime / 2.0;

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Calculate animated position with looping and constrains on X
    // Direction on Z and Y will be depedent on X position
    float xMovement = mod(uX + speedX * aRandom.x, maxX - uX);
    float yExpansion = uY + xMovement * aRandom.y;
    float zExpansion = uZ + xMovement * aRandom.z;

    modelPosition.xyz = vec3(xMovement, yExpansion, zExpansion);

    vec4 viewPosition = viewMatrix * modelPosition;
    float depth = -viewPosition.z;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;
    gl_PointSize = 100.0 / depth;

    vDistanceX = modelPosition.x - 0.4;

    //TODO not working very well, problems when trying to relocate this
}