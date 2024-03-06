


/*
attachProgramInfo_CM({
  target:this.system,
  gl:this.gl,
  screenMode:"2d"
});
*/

// see
// https://developer.mozilla.org/en-US/docs/Web/API/WebGLProgram

// import {initShaderProgram} from "programInfo.js";
// import {vertexBasicShader, fragmentBasicShader, vScreen, fScreen, initShaderProgram} from "./shaders.js";

// this mutates system for setting up gl properties

export function buildProgramInfo({gl,shaderProgram,screenMode="2d"}={}){
// export function attachProgramInfo_CM({target,gl,shaderProgram,screenMode="3d"}={}){
  // Initialize a shader program; this is where all the lighting
  // for the vertices and so forth is established.
  
  // let shaderProgram = "";
  
  // this might not be nessesary unless some other design is added later for a loading screen
  // shaderProgram = initShaderProgram(gl, vScreen, fScreen);
  // if(screenMode === "2d"){
  // }
  // else if(screenMode === "3d") {
  //   shaderProgram = initShaderProgram(gl, vertexBasicShader, fragmentBasicShader);
  // }


  // var texcoordLocation = gl.getAttribLocation(program, "a_texCoord");

  // Collect all the info needed to use the shader program.
  // Look up which attribute our shader program is using
  // for aVertexPosition and look up uniform locations.
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertex:   gl.getAttribLocation(shaderProgram, "a_position"),
      texture:  gl.getAttribLocation(shaderProgram, "a_texCoord"),
      color:  gl.getAttribLocation(shaderProgram, "a_color")
    },
    uniformLocations: {
      // projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
      // modelViewMatrix:  gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
      color:            gl.getUniformLocation(shaderProgram, "u_color"),
      modelMatrix:      gl.getUniformLocation(shaderProgram, "u_matrix")
      // mNarfs:      gl.getUniformLocation(shaderProgram, "u_mnarfs")
    },
  };
  
      // if(screenMode === "2d"){
      //   programInfo.uniformLocations.resolution = gl.getUniformLocation(shaderProgram, "u_resolution");
      // }
      // 
      // // Pass in the canvas resolution so we can convert from
      // // pixels to clipspace in the shader
      // if(programInfo.uniformLocations.resolution){
      //   //console.log("resolution", programInfo.uniformLocations.resolution);
      //   gl.uniform2f(programInfo.uniformLocations.resolution, gl.canvas.width, gl.canvas.height);
      // }

  return programInfo;
  

}
