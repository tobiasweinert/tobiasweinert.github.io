const fragmentShader = `
uniform float uTime;
varying vec3 vPosition;
void main() {
    gl_FragColor = vec4(vPosition, 1.0);
}
`;
export default fragmentShader;
