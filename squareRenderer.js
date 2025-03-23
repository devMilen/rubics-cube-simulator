const canvas = document.getElementById('gameCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const gl = canvas.getContext('webgl');

const vertices = new Float32Array ([
    -0.5,  0.5,         1.0, 0.0, 0.0, 
     0.5,  0.5,         0.0, 1.0, 0.0, 
     0.5, -0.5,         0.0, 0.0, 1.0, 
    -0.5, -0.5,         1.0, 1.0, 0.0  
]);

const indices = new Uint16Array([
    0, 1, 2,  
    0, 2, 3   
]);

const VBO = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const IBO = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, IBO);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

const vertexShader = `
attribute vec2 a_position;
attribute vec3 color;
varying vec3 fragColor;

void main() {
    fragColor = color;
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision mediump float;
varying vec3 fragColor;

void main() {
    gl_FragColor = vec4(fragColor, 1.0);
}
`;

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

const shaderProgram = createShader(vertexShader, fragmentShader);
gl.useProgram(shaderProgram);

function setAttribute(shaderProgram, atrtribName, perVertex, type, normalize, stride, offset) {
    const positionLocation = gl.getAttribLocation(shaderProgram, atrtribName);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, perVertex, type, normalize, stride, offset);
}

setAttribute(shaderProgram, 'a_position', 2, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 0);
setAttribute(shaderProgram, 'color', 3, gl.FLOAT, false, 5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);


gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0); 
