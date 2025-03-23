const canvas = document.getElementById('gameCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const gl = canvas.getContext('webgl');

if (!gl) {
    alert('WebGL not supported. Please use a modern browser.');
}

gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

const vertices = new Float32Array([
    -50,  50, 0.0,  
    -50, -50, 0.0, 
    50 , -50, 0.0,  
    50 ,  50, 0.0   
]);
const indices = new Uint16Array([0, 1, 2, 0, 2, 3]);

const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

const vsSource = `
    attribute vec3 aPosition;
    uniform mat4 mat;
    void main() {
        gl_Position = vec4(aPosition, 1.0) * mat;
    }
`;

const fsSource = `
    precision mediump float;
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);  // Red color
    }
`;

const vs = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vs, vsSource);
gl.compileShader(vs);

const fs = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fs, fsSource);
gl.compileShader(fs);

const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vs);
gl.attachShader(shaderProgram, fs);
gl.linkProgram(shaderProgram);
gl.useProgram(shaderProgram);

const positionAttribute = gl.getAttribLocation(shaderProgram, 'aPosition');
gl.vertexAttribPointer(positionAttribute, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(positionAttribute);

gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

function gameLoop() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    const updatedVertices = new Float32Array([
        -50,  50, 0.0,  
        -50, -50, 0.0, 
        50 , -50, 0.0,  
        50 ,  50, 0.0   
    ]);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, updatedVertices, gl.STATIC_DRAW);

    const mat4 = glMatrix.mat4; 
    console.log("glMatrix:", glMatrix);
    console.log("mat4:", glMatrix.mat4);
    let mat = mat4.create();
    console.log("mat4:", glMatrix.mat4);

    mat4.ortho(mat, 0, window.innerWidth, window.innerHeight, 0, -1, 1);
    const matLocation = gl.getUniformLocation(shaderProgram, "mat");
    gl.uniformMatrix4fv(matLocation, false, mat);

    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

    requestAnimationFrame(gameLoop);
}

gameLoop();