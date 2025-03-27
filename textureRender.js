// Init canvas & WebGL
const canvas = document.getElementById('gameCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const gl = canvas.getContext('webgl');
gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0, 0, 0, 1);

// Buffers
const points = new Float32Array([
    // x, y,    u, v
    -0.5,  0.5,  0.0, 1.0,  // Top-left
     0.5,  0.5,  1.0, 1.0,  // Top-right
     0.5, -0.5,  1.0, 0.0,  // Bottom-right
    -0.5, -0.5,  0.0, 0.0   // Bottom-left
]);
const order = new Uint16Array([
    0, 1, 2,  2, 3, 0
]);

const VBO = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);

const EBO = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, EBO);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, order, gl.STATIC_DRAW);

// Shader Code
const vertexShaderCode = `
    attribute vec2 a_position;
    attribute vec2 a_texCoord;
    varying vec2 v_texCoord;
    uniform mat4 u_transform;

    void main() {
        v_texCoord = a_texCoord;
        gl_Position = u_transform * vec4(a_position, 0.0, 1.0);
    }
`;

const fragmentShaderCode = `
    precision mediump float;
    varying vec2 v_texCoord;
    uniform sampler2D u_texture;

    void main() {
        gl_FragColor = texture2D(u_texture, v_texCoord);
    }
`;

function compileShader(source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    }
    return shader;
}

function createShader(vertexShader, fragmentShader) {
    const vsid = compileShader(vertexShader, gl.VERTEX_SHADER);
    const fsid = compileShader(fragmentShader, gl.FRAGMENT_SHADER);
    
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vsid);
    gl.attachShader(shaderProgram, fsid);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error("Shader link error:", gl.getProgramInfoLog(shaderProgram));
    }

    gl.deleteShader(vsid);
    gl.deleteShader(fsid);

    return shaderProgram;
}

const shaderProgram = createShader(vertexShaderCode, fragmentShaderCode);
gl.useProgram(shaderProgram);

// Attribute pointers
const positionLocation = gl.getAttribLocation(shaderProgram, 'a_position');
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 4 * Float32Array.BYTES_PER_ELEMENT, 0);

const texCoordLocation = gl.getAttribLocation(shaderProgram, 'a_texCoord');
gl.enableVertexAttribArray(texCoordLocation);
gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 4 * Float32Array.BYTES_PER_ELEMENT, 2 * Float32Array.BYTES_PER_ELEMENT);

// Set transform uniform
const transformLoc = gl.getUniformLocation(shaderProgram, 'u_transform');
const identityMatrix = new Float32Array([
    1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 1
]);
gl.uniformMatrix4fv(transformLoc, false, identityMatrix);

// Load Texture
const texture = gl.createTexture();
const image = new Image();
image.src = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAFwAXAMBIgACEQEDEQH/xAAcAAABBAMBAAAAAAAAAAAAAAAAAQMEBgIFBwj/xAA2EAABAwIFAQUGAwkAAAAAAAABAAIDBBEFBhIhMUETIjJRYQcUFnGRoVKBkhUXI0JygrHB0f/EABgBAAMBAQAAAAAAAAAAAAAAAAACBAED/8QAHxEAAgMAAgMBAQAAAAAAAAAAAAECAxETURIxQSEi/9oADAMBAAIRAxEAPwDhyEIQAIQhAAhCEAS6admnspmhzP8ACzmog5pfTu1D8JO4UFS4ZbM7ps4JGmv1DLGRSLbJFnK7U8m1j1WCcxi3SIQgwEIQgAQhCABCEIAEoNkiWyAQhN0JbJQEGgxpeQGrbUuC1UkIeIXkHyC22Usrz4rMzuvaHOHet4R1K7ZhuEihpRBR00T4WnYvg1n6of48O9dWrWeZkLcRZbxSTw0Ux/sKlxZMxyTw4fN+grpxT6JOSHZXEK2M9n+YH8YfN+lOj2dZg60Ug+YW8M+jOWvsp1koCuX7uscHip7fNL8AYq3xRtH5hDos6GVtb+lODFkIyriMj4g3lrfqsvg+sbyAuUq7F8KIcb+lPEJJsArfkbJs2NYjCJmObEXbnTwB1VxyF7Pe2rxUYnStmp2t2Y55ALul7cj0XX8DwWHC43HTGHnbut0gDyA6BEf59+zZeK9GswzBKTB6FkbWtjDW7u07qiZuz9T4Li3uYbcCMOGkX6n/AIrF7Qsd9zikghee1cC0W5HquG5nrqfFccqax8Zh16GthiILY2taGgXPOzQqK60l5S+mTnh2v40eD3aZrR5NjsmavOFU6/Ys0A9S0qnOq32vq4HmokldJfk2CZzXRAoMslVmjEXEh5bf+m3+1q6jMFU7xOH3WoNfGA7VG1zjwTfZR21MUhDXu0i+7rcBK7s+DqnfpsZcYmfyR90z+0ZXcaStZPJG0kxSki+1+VhFNd4F/wA7LlO7UU1U4zdwPlleBYXKveT8r+8vZVVsV4hu1p/mVZyNTMxHEWRSWNt7X5XTsMnlFW2OO8NJGCABuXepKg5HOzxLLcrrLHSU0VOy0UbWDyaFFxOp0te1uwaCXEmwCz/aEbpDHGdWkd51+vQLn3tWzAaGhGHQyfxZxqlsbEN8lRKaiSVxc3+HNM/Zk9/rpo6R92Xs6X8XoPIKhu8Sn1bruPzWvf4k/I5ezpOCiXR9R6piSpI6qC6o9Uy6a55XQmwlvqCeqZdN6qMZN9zsUy+XflKMiX2u6dinsd1re135WTZSuclp3hLC25bxt2FYjFVRndh3aTyF1OPGsNxaGOSixNlI+xvG/Ytvz8x5LgjZ7J4VjgPF91JOl+XlH8ZYpRkskdoqcdpsApXuNcKircblzRttwAuT5hxiXFKySoneXOceq1clY53Lj9VDlmvfdEKpbsnoOUIRyKEnfclRXHdK9900XbqtLCKctZtHSpp0ibJWJK7HAeMuwTTnpskoSmmWtKH+ZTV90hKDdH9fqjtFHJKS5S+Iymx10iac9I4psowxyZkXLFIhaLp//9k=';
image.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
};

// Set texture uniform
const textureLoc = gl.getUniformLocation(shaderProgram, 'u_texture');
gl.uniform1i(textureLoc, 0);

// Render Function
function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.drawElements(gl.TRIANGLES, order.length, gl.UNSIGNED_SHORT, 0);
    requestAnimationFrame(render);
}

render();
