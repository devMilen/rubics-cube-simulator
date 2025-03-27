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
attribute vec3 a_position;
attribute vec3 color;
uniform mat4 mat;
varying vec3 fragColor;

void main() {
    fragColor = color;
    gl_Position = mat * vec4(a_position, 1.0);
}
`;

const fragmentShader = `
precision mediump float;
varying vec3 fragColor;

void main() {
    gl_FragColor = vec4(fragColor, 1.0);
}
`;

const vertices = new Float32Array([
       //Top
     -0.5,0.5,-0.5,    1.0, 0.0, 0.0,
      0.5,0.5,-0.5,    1.0, 0.0, 0.0,
     -0.5,0.5, 0.5,    1.0, 0.0, 0.0,
      0.5,0.5, 0.5,    1.0, 0.0, 0.0,

      //Bottom 
     -0.5,-0.5,-0.5,   1.0, 1.0, 1.0,
      0.5,-0.5,-0.5,   1.0, 1.0, 1.0,
     -0.5,-0.5, 0.5,   1.0, 1.0, 1.0,
      0.5,-0.5, 0.5,   1.0, 1.0, 1.0,

      //Front
     -0.5, 0.5,0.5,    0.0, 1.0, 0.0,
      0.5, 0.5,0.5,    0.0, 1.0, 0.0,
     -0.5,-0.5,0.5,    0.0, 1.0, 0.0,
      0.5,-0.5,0.5,    0.0, 1.0, 0.0,

      //Back
     -0.5, 0.5,-0.5,   1.0, 1.0, 0.0,
      0.5, 0.5,-0.5,   1.0, 1.0, 0.0,
     -0.5,-0.5,-0.5,   1.0, 1.0, 0.0,
      0.5,-0.5,-0.5,   1.0, 1.0, 0.0,

      //Left
     -0.5, 0.5, 0.5,   0.0, 1.0, 1.0,
     -0.5, 0.5,-0.5,   0.0, 1.0, 1.0,
     -0.5,-0.5, 0.5,   0.0, 1.0, 1.0,
     -0.5,-0.5,-0.5,   0.0, 1.0, 1.0,

      //Right
      0.5, 0.5, 0.5,   1.0, 0.0, 1.0,
      0.5, 0.5,-0.5,   1.0, 0.0, 1.0,
      0.5,-0.5, 0.5,   1.0, 0.0, 1.0,
      0.5,-0.5,-0.5,   1.0, 0.0, 1.0,

]);

const indices = new Uint16Array([
        0, 1, 2, 2, 3, 1,

        4, 5, 6, 6, 7, 5,

        8, 9, 10, 10, 11, 9,

        12, 13, 14, 14, 15, 13,

        16, 17, 18, 18, 19, 17,

        20, 21, 22, 22, 23, 21
]);


const VBO = createVertexBuffer(vertices, true, gl);
const IBO = createIndexBuffer(indices, true, gl);

const shaderProgram = createShader(vertexShader, fragmentShader, gl);
gl.useProgram(shaderProgram);

assignAttribPointer(shaderProgram, 'a_position', 3, gl.FLOAT, 6 * Float32Array.BYTES_PER_ELEMENT, 0, gl);
assignAttribPointer(shaderProgram, 'color', 3, gl.FLOAT, 6 * Float32Array.BYTES_PER_ELEMENT, 3 * Float32Array.BYTES_PER_ELEMENT, gl);

const matLoc = gl.getUniformLocation(shaderProgram, 'mat');
let mat = mat4.create();
mat4.ortho(mat, -1, 1, -1, 1, -1, 1);
let angle = 1;

let angleX = 0; // Initial rotation angle around the X axis
let angleY = 0; // Initial rotation angle around the Y axis
let angleZ = 0; // Initial rotation angle around the Z axis

gl.enable(gl.DEPTH_TEST);

function update() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    mat4.identity(mat);
    mat4.rotateX(mat, mat, angleX); // Rotate around the X axis
    mat4.rotateY(mat, mat, angleY); // Rotate around the Y axis
    mat4.rotateZ(mat, mat, angleZ); // Rotate around the Z axis

    // Increment rotation angles for next frame
    angleX += 0.01; // Adjust rotation speed for X-axis
    angleY += 0.02; // Adjust rotation speed for Y-axis
    angleZ += 0.015; // Adjust rotation speed for Z-axis

    gl.uniformMatrix4fv(matLoc, false, mat);

    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0); 
    requestAnimationFrame(update);
}


update();

