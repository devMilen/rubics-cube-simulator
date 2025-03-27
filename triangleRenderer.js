// canvas setup & webgl context
const canvas = document.getElementById('gameCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const gl = canvas.getContext('webgl');
gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0, 0, 0, 1);

const vertexShader = `
attribute vec2 a_position;
attribute vec3 color;
uniform mat4 u_transform;
varying vec3 fragColor;

void main() {
    fragColor = color;
    gl_Position = u_transform * vec4(a_position, 0.0, 1.0);
}
`;

const fragmentShader = 
`precision mediump float;
varying vec3 fragColor;

void main() {
    gl_FragColor = vec4(fragColor, 1.0);
}
`;

const vertices = new Float32Array([
     150, 150,   1.0, 0.0, 0.0,
     200, 400,   0.0, 1.0, 0.0,
     400, 200,   0.0, 0.0, 1.0
]);
const VBO = createVertexBuffer(vertices, true, gl);

const shaderProgram = createShader(vertexShader, fragmentShader, gl);
gl.useProgram(shaderProgram);

assignAttribPointer(shaderProgram, 'a_position', 2, gl.FLOAT, 5 * Float32Array.BYTES_PER_ELEMENT, 0, gl);
assignAttribPointer(shaderProgram, 'color', 3, gl.FLOAT, 5 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT, gl);



const transformLocation = gl.getUniformLocation(shaderProgram, 'u_transform');
let mat = mat4.create();
mat4.ortho(mat, 0, window.innerWidth, window.innerHeight, 0, -1, 1);
mat4.translate(mat, mat, [200, 200, 0.0]);
mat4.scale(mat, mat, [5.0, 5.0, 1.0]);    

function update() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.uniformMatrix4fv(transformLocation, false, mat);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
    requestAnimationFrame(update);
}

update();