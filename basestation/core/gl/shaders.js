


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
      // gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
      gl_FragColor = u_color;
    }
  `;



  /**
   * Creates and compiles a shader.
   *
   * @param {!WebGLRenderingContext} gl The WebGL Context.
   * @param {string} shaderSource The GLSL source code for the shader.
   * @param {number} shaderType The type of shader, VERTEX_SHADER or
   *     FRAGMENT_SHADER.
   * @return {!WebGLShader} The shader.
   */
  // export function compileShader(gl, shaderSource, shaderType) {
  //   // Create the shader object
  //   var shader = gl.createShader(shaderType);
  // 
  //   // Set the shader source code.
  //   gl.shaderSource(shader, shaderSource);
  // 
  //   // Compile the shader
  //   gl.compileShader(shader);
  // 
  //   // Check if it compiled
  //   var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  //   if (!success) {
  //     // Something went wrong during compilation; get the error
  //     throw ("could not compile shader:" + gl.getShaderInfoLog(shader));
  //   }
  // 
  //   return shader;
  // }


//
// Initialize a shader program, so WebGL knows how to draw our data
//
export function initShaderProgram(gl, vShader, fShader) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vShader);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fShader);

  // Create the shader program

  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // If creating the shader program failed, alert

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert(
      `Unable to initialize the shader program: ${gl.getProgramInfoLog(
        shaderProgram
      )}`
    );
    return null;
  }

  return shaderProgram;
}

//
// creates a shader of the given type, uploads the source and
// compiles it.
//
function loadShader(gl, type, source) {
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
