

// This effectively builds an emission textured shader program



// https://webglfundamentals.org/webgl/lessons/webgl-boilerplate.html

const vShaderB = `#version 300 es
in vec4 a_position;
in vec4 a_color;

in vec2 a_texCoord;

// not yet
precision mediump float;
uniform vec4 u_color;

uniform mat4 u_matrix;


// not yet
// uniform mat4 uModelViewMatrix;
// not yet
// uniform mat4 uProjectionMatrix;

out vec4 v_color;
out vec2 v_texCoord;

void main() {
  gl_Position = u_matrix * a_position;
  v_color = a_color;
}
`;

const fShaderB = `#version 300 es
precision mediump float;
in vec4 v_color;

// // not yet
// precision mediump float;
// uniform vec4 u_color;

out vec4 magicColor;
void main() {
    magicColor = v_color;
}
`;




// https://webglfundamentals.org/webgl/lessons/webgl-boilerplate.html

//
// Initialize a shader program, so WebGL knows how to draw our data
//

// this one pulls the default shaders
export function initShaderProgramFlatShader(gl) {
  const vertexShader = buildShader(gl, gl.VERTEX_SHADER, vShaderB);
  const fragmentShader = buildShader(gl, gl.FRAGMENT_SHADER, fShaderB);
  return buildProgram(gl, vertexShader, fragmentShader);
}

export function initShaderProgram(gl, vShader, fShader) {
  const vertexShader = buildShader(gl, gl.VERTEX_SHADER, vShader);
  const fragmentShader = buildShader(gl, gl.FRAGMENT_SHADER, fShader);

  return buildProgram(gl, vertexShader, fragmentShader);
}

export function buildProgram(gl, vertexShader, fragmentShader) {

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.log(`Unable to initialize the shader program: ${gl.getProgramInfoLog(
      program
    )}`);
    return null;
  }

  return program;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function buildShader(gl, type, source) {
  const shader = gl.createShader(type);

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    // alert(
    //   `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`
    // );
    console.log(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`);
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
