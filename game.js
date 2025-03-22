// Get the canvas element
const canvas = document.getElementById('gameCanvas');

// Set the canvas size to fill the screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Get the WebGL rendering context
const gl = canvas.getContext('webgl');

// Check if WebGL is available
if (!gl) {
    alert('WebGL not supported. Please use a modern browser.');
}

// Set the background color of the canvas (optional)
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

// Define the vertex data for a rectangle (two triangles)
const vertices = new Float32Array([
    -0.5,  0.5, 0.0,  // Top-left corner
    -0.5, -0.5, 0.0,  // Bottom-left corner
    0.5, -0.5, 0.0,   // Bottom-right corner
    0.5,  0.5, 0.0    // Top-right corner
]);

// Define indices to create two triangles from the rectangle
const indices = new Uint16Array([0, 1, 2, 0, 2, 3]);

// Create and bind the buffer for the rectangle vertices
const vertexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

// Create and bind the index buffer for the rectangle
const indexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

// Vertex shader program (used to calculate the position of each vertex)
const vsSource = `
    attribute vec3 aPosition;
    void main() {
        gl_Position = vec4(aPosition, 1.0);
    }
`;

// Fragment shader program (used to color the rectangle)
const fsSource = `
    precision mediump float;
    void main() {
        gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);  // Red color
    }
`;

// Compile and link shaders
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

// Link the buffer to the shader
const positionAttribute = gl.getAttribLocation(shaderProgram, 'aPosition');
gl.vertexAttribPointer(positionAttribute, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(positionAttribute);

// Clear the canvas and draw the rectangle
gl.clear(gl.COLOR_BUFFER_BIT);
gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

let x = 0;  // Starting position of the rectangle

function gameLoop() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Update the rectangle's position
    x += 0.01;
    if (x > 1) x = -1;  // Loop the position

    // Update the vertex positions to move the rectangle
    const updatedVertices = new Float32Array([
        -0.5 + x,  0.5, 0.0,  // Top-left
        -0.5 + x, -0.5, 0.0,  // Bottom-left
        0.5 + x, -0.5, 0.0,   // Bottom-right
        0.5 + x,  0.5, 0.0    // Top-right
    ]);

    // Update the buffer with the new vertex positions
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, updatedVertices, gl.STATIC_DRAW);

    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

    // Request the next frame
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();

const image = new Image();
image.src = 'image.png';  // Your image file

image.onload = () => {
    // Generate the texture
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);

    // Now, you can apply this texture to your shape in the fragment shader
};