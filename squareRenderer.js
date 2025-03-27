function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0); 
    requestAnimationFrame(render);
}

//canvas setup & context
const canvas = document.getElementById('gameCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const gl = canvas.getContext('webgl');
gl.clearColor(0, 0, 0, 1);


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

const VBO = createVertexBuffer(vertices, true, gl);
const IBO = createIndexBuffer(indices, true, gl);

const shaderProgram = createShader(vertexShader, fragmentShader, gl);
gl.useProgram(shaderProgram);

assignAttribPointer(shaderProgram, 'a_position', 2, gl.FLOAT, 5 * Float32Array.BYTES_PER_ELEMENT, 0, gl);
assignAttribPointer(shaderProgram, 'color', 3, gl.FLOAT, 5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT, gl);

render();