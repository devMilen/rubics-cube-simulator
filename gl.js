function createVertexBuffer(vertices, isStatic, gl) {
    const VBO = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, isStatic ? gl.STATIC_DRAW : gl.DYNAMIC_DRAW);
    return VBO;
}

function createIndexBuffer(indices, isStatic, gl) {
    const IBO = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, IBO);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), isStatic ? gl.STATIC_DRAW : gl.DYNAMIC_DRAW);
    return IBO;
}

function assignAttribPointer(shaderProgram, attribName, count, type, stride, beginOffset, gl) {
    const loc = gl.getAttribLocation(shaderProgram, attribName);
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, count, type, false, stride, beginOffset);
}

function compileShader(source, type, gl) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
}

function createShader(vertexShader, fragmentShader, gl) {
    const vsid = compileShader(vertexShader, gl.VERTEX_SHADER, gl);
    const fsid = compileShader(fragmentShader, gl.FRAGMENT_SHADER, gl);
    
    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vsid);
    gl.attachShader(shaderProgram, fsid);
    gl.linkProgram(shaderProgram);
    
    gl.deleteShader(vsid);
    gl.deleteShader(fsid);

    return shaderProgram;
}

function bind(VBO, EBO, shaderProgram, gl) {
    gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, IBO);
    gl.enableVertexAttribArray(positionLocation);
    gl.useProgram(shaderProgram);
}

function bind(VBO, EBO, shaderProgram, attribLocation, gl) {
    gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, IBO);
    gl.enableVertexAttribArray(attribLocation);
    gl.useProgram(shaderProgram);
}