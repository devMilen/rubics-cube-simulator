function compileShader(source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
}
function createShader(vertexShader, fragmentShader) {
    const vsid = compileShader(vertexShader, gl.VERTEX_SHADER);
    const fsid = compileShader(fragmentShader, gl.FRAGMENT_SHADER);
    
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vsid);
    gl.attachShader(shaderProgram, fsid);
    gl.linkProgram(shaderProgram);
    
    return shaderProgram;
}
function setAttribute(shaderProgram, atrtribName, perVertex, type, normalize, stride, offset) {
    const positionLocation = gl.getAttribLocation(shaderProgram, atrtribName);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, perVertex, type, normalize, stride, offset);
}
function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    requestAnimationFrame(render);
}

const canvas = document.getElementById('gameCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const gl = canvas.getContext('webgl');

//vertex buffer
const vertices = new Float32Array([
     0.0,  0.5,   1.0, 0.0, 0.0,
    -0.5, -0.5,   0.0, 1.0, 0.0,
     0.5, -0.5,   0.0, 0.0, 1.0
]);
const VBO = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

//shader code & program
const vertexShader = `
attribute vec2 a_position;
attribute vec3 color;
varying vec3 fragColor;

void main() {
    fragColor = color;
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const fragmentShader = 
`precision mediump float;
varying vec3 fragColor;

void main() {
    gl_FragColor = vec4(fragColor, 1.0);
}
`;

const shaderProgram = createShader(vertexShader, fragmentShader);
gl.useProgram(shaderProgram);

//attrib pointers & shader attributes
const positionLocation = gl.getAttribLocation(shaderProgram, 'a_position');
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0);

const positionLocation2 = gl.getAttribLocation(shaderProgram, 'color');
gl.enableVertexAttribArray(positionLocation2);
gl.vertexAttribPointer(positionLocation2,3, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);

//unbind
gl.bindBuffer(gl.ARRAY_BUFFER, null);
gl.disableVertexAttribArray(positionLocation);
gl.useProgram(null);

//bind
gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
gl.enableVertexAttribArray(positionLocation);
gl.useProgram(shaderProgram);

render();