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
    
    gl.deleteShader(vsid);
    gl.deleteShader(fsid);

    return shaderProgram;
}
// function render() {
//     gl.clear(gl.COLOR_BUFFER_BIT);
//     gl.drawArrays(gl.TRIANGLES, 0, 3);
//     requestAnimationFrame(render);
// }

// canvas setup & webgl context
const canvas = document.getElementById('gameCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const gl = canvas.getContext('webgl');
gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0, 0, 0, 1);


//buffer
const vertices = new Float32Array([
     0.0,  0.5,   1.0, 0.0, 0.0,
    -0.5, -0.5,   0.0, 1.0, 0.0,
     0.5, -0.5,   0.0, 0.0, 1.0
]);
const VBO = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);


//shader code and program
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


//mat4 init
const transformLocation = gl.getUniformLocation(shaderProgram, 'u_transform');
let transformMatrix = mat4.create();
let angle = 0; 
let speed = 0.02; 

// mat4.translate(transformMatrix, transformMatrix, [-0.5, 0, 0]);

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    //the mat4 remembers the pos
    mat4.rotate(transformMatrix, transformMatrix, -0.05, [0, 0, 1]);
    mat4.translate(transformMatrix, transformMatrix, [0.04, 0, 0]);
    mat4.rotate(transformMatrix, transformMatrix, 2*0.05, [0, 0, 1]);
    angle += 0.05;

    gl.uniformMatrix4fv(transformLocation, false, transformMatrix);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
    requestAnimationFrame(render);
}

render();