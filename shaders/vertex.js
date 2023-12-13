/*
    Transform -> position, scale, rotation
    modelMatrix -> position, scale, rotation of model
    viewMatrix -> position, scale, rotation of camera
    projectionMatrix -> projects object onto screen (spect ration & perspective)

    attributes -> vertex specific data (only vertex can access)
    uniforms -> global data (fragment & vertex can access)
    varyings -> vertex to fragment
    // MVP 
*/

const vertexShader = ` 
uniform float uTime;
varying vec3 vPosition;
void main() {
    vPosition = position;
    vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
    vec4 projectedPosition = projectionMatrix * modelViewPosition;
    gl_Position = projectedPosition;

}
`;

export default vertexShader;
