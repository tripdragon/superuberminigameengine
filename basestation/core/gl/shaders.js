

// This effectively builds an emission textured shader program



// https://webglfundamentals.org/webgl/lessons/webgl-boilerplate.html

const vShaderB = `#version 300 es
in vec4 a_position;
// in vec4 a_color;
in vec3 a_color;

in vec2 a_texCoord;


// we seem to not be using this at all
// precision mediump float;
// uniform vec4 u_color;

uniform mat4 u_matrix;


out vec4 v_color;
out vec2 v_texCoord;

void main() {
  gl_Position = u_matrix * a_position;
  v_color = vec4(a_color.r,a_color.g,a_color.b, 1);
  v_texCoord = a_texCoord;
}
`;


// -------


const fShaderB = `#version 300 es
precision mediump float;
in vec4 v_color;


in vec2 v_texCoord;

// this is local, you dont reference it outside of shader
uniform sampler2D u_texture;


out vec4 magicColor;

void main() {
    vec4 image = texture(u_texture, v_texCoord);
    
    // magicColor = v_color;
    // magicColor = texture(u_texture, v_texCoord);
    
    magicColor = vec4(v_color.rgb * image.rgb, 1);
    
    
    
    
    // magicColor = vec4(v_color.rgb * image.rgb, 1);
    // magicColor = vec4(vec3(1,1,1).rgb, 1);
    // magicColor = vec4(0,1,0,1);
    // magicColor = vec4(v_color.r,v_color.g,v_color.g, 1);
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
