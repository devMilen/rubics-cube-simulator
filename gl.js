createVertexBuffer(vertices, isStatic, gl) {
    const VBO = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, (isStatic) ? gl.STATIC_DRAW : gl.DYNAMIN_DRAW);
    return VBO;
}

