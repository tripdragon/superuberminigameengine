

// This effectively builds an emission textured shader program



// https://webglfundamentals.org/webgl/lessons/webgl-boilerplate.html

const vShaderB = `
attribute vec4 a_position;
attribute vec4 a_color;
attribute vec2 a_texCoord;

// not yet
precision mediump float;
uniform vec4 u_color;

uniform mat4 u_matrix;

// not yet
//uniform mat4 uModelViewMatrix;
// not yet
uniform mat4 uProjectionMatrix;

varying vec4 v_color;
varying vec2 v_texCoord;

void main() {
  gl_Position = u_matrix * a_position;
  v_color = a_color;
}
`;

const fShaderB = `
precision mediump float;
varying vec4 v_color;

// // not yet
// precision mediump float;
// uniform vec4 u_color;

void main() {
   gl_FragColor = v_color;
}
`;
























// this ones flipped -y, y 0 starts at top
// its annoying

export const vScreen = `
    
    attribute vec4 aVertexPosition;
    
    // not yet
    //uniform mat4 uModelViewMatrix;
    
    // not yet
    uniform mat4 uProjectionMatrix;
    
    uniform vec2 u_resolution;
    
    uniform mat4 u_matrix;
    
    
    attribute vec2 a_texCoord;

    varying vec2 v_texCoord;
    
    
    
    void main() {
      
      // convert the position from pixels to 0.0 to 1.0
      
      
      // old
      // vec2 zeroToOne = aVertexPosition.xy / u_resolution;
      
      vec2 zeroToOne = (u_matrix * aVertexPosition).xy / u_resolution;
        // convert from 0->1 to 0->2
      vec2 zeroToTwo = zeroToOne * 2.0;
        // convert from 0->2 to -1->+1 (clip space)
      vec2 clipSpace = zeroToTwo - 1.0;
      
      // not yet
      // gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;

        // need to flip y to up      
      // gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1); // upside down world!!!
      
        // original
      gl_Position = vec4(clipSpace * vec2(1, 1), 0, 1);
      
      // no
      // gl_Position = u_matrix * aVertexPosition;
      
      // Pass the texcoord to the fragment shader.
      
      gl_Position = u_matrix * aVertexPosition;
      v_texCoord = a_texCoord;
      
    }
  `;
  
// frag
export const fScreen = `
    precision mediump float;
    uniform vec4 u_color;
    
    // Passed in from the vertex shader.
    varying vec2 v_texCoord;
     
    // The texture.
    uniform sampler2D u_texture;

    void main() {
      // gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
      // gl_FragColor = u_color;
      gl_FragColor = texture2D(u_texture, v_texCoord);
    }
  `;



// https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Tutorial/Adding_2D_content_to_a_WebGL_context


// these are ClipSpace as basic no frills
// Vertex shader program
export const vertexBasicShader = `
    attribute vec4 aVertexPosition;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    }
  `;
// frag
export const fragmentBasicShader = `
    precision mediump float;
    uniform vec4 u_color;
    void main() {
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
      // gl_FragColor = u_color;
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
    alert(
      `Unable to initialize the shader program: ${gl.getProgramInfoLog(
        program
      )}`
    );
    return null;
  }

  return program;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
// function loadShader(gl, type, source) {
function buildShader(gl, type, source) {
  const shader = gl.createShader(type);

  // Send the source to the shader object

  gl.shaderSource(shader, source);

  // Compile the shader program

  gl.compileShader(shader);

  // See if it compiled successfully

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(
      `An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`
    );
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}
