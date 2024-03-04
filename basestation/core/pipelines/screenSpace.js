
// pipelines

//drawSceneScreenspace

import {Pipeline} from "./pipeline.js";
// import {programInfo} from "gl/programInfo.js";
import {attachProgramInfo_CM} from "gl/programInfo.js";

// for sceneGrapth we dont assign it, cause we might live change it
// dukno
// same for camera
export class ScreenSpace extends Pipeline{
  
  isScreenSpace = true;
  
  constructor({system,scene,gl}){
    super({system,scene,gl});
    attachProgramInfo_CM({
      system:this.system,
      gl:this.gl,
      screenMode:"2d"
    });
  }
  drawFrame({sceneGrapth,camera}){
    redraw({
      scene:this.scene,
      gl:this.gl,
      programInfo:this.programInfo,
      sceneGrapth:sceneGrapth,
      camera:camera
    });
  }
}

// +++++++++++++++

// export function drawSceneScreenspace({app,gl,programInfo}){
// function redraw({app,gl,programInfo,sceneGrapth,camera}){
function redraw({scene,gl,programInfo,sceneGrapth,camera}){

  // this needs to replace app for scene
  // const color = app.backgroundColor;
  const color = scene.backgroundColor;
  
  // var color = {r:0.0, g:0.0, b:0.7, a:1};
  // console.log("color",color);
  
  gl.clearColor(color.r, color.g, color.b, color.a); // Clear to black, fully opaque
  // gl.clearColor(0, 0, 1, 1); // Clear to black, fully opaque
  
  gl.clearDepth(1.0); // Clear everything
  gl.enable(gl.DEPTH_TEST); // Enable depth testing
  gl.depthFunc(gl.LEQUAL); // Near things obscure far things
  

  // Clear the canvas before we start drawing on it.
  // Tell WebGL how to convert from clip space to pixels
  
  // FOR NOW, this is a simple camera for offset entire scene
  // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  // gl.viewport(app.cameraDefault.x, app.cameraDefault.y, gl.canvas.width, gl.canvas.height);
  gl.viewport(camera.x, camera.y, gl.canvas.width, gl.canvas.height);
  
  
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);



  //  save for later using a camera
        
        // Create a perspective matrix, a special matrix that is
        // used to simulate the distortion of perspective in a camera.
        // Our field of view is 45 degrees, with a width/height
        // ratio that matches the display size of the canvas
        // and we only want to see objects between 0.1 units
        // and 100 units away from the camera.

        // const fieldOfView = (45 * Math.PI) / 180; // in radians
        // const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        // const zNear = 0.1;
        // const zFar = 400.0;
        // const projectionMatrix = mat4.create();

        // note: glmatrix.js always has the first argument
        // as the destination to receive the result.
        // mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

        // Set the drawing position to the "identity" point, which is
        // the center of the scene.
        // const modelViewMatrix = mat4.create();
        // 
        // // Now move the drawing position a bit to where we want to
        // // start drawing the square.
        // mat4.translate(
        //   modelViewMatrix, // destination matrix
        //   modelViewMatrix, // matrix to translate
        //   //[-20.0, 20.0, -76.0]
        //   // [positionCheap.x, positionCheap.y, positionCheap.z]
        //   [0,0,positionCheap.z]
        //   // [0,0,0]
        // ); // amount to translate
        // 
        // 
        // // Set the shader uniforms
        // gl.uniformMatrix4fv(
        //   programInfo.uniformLocations.projectionMatrix,
        //   false,
        //   projectionMatrix
        // );
        // gl.uniformMatrix4fv(
        //   programInfo.uniformLocations.modelViewMatrix,
        //   false,
        //   modelViewMatrix
        // );
        


  // NOW the objects are from the scene grapth!!!
  // tyme for plus button!!!
  const offset2 = 0;
  // const vertexCount = 6;// 3 for tri, 6 for 2 tris making a square
  
  const primitiveType = gl.TRIANGLES;
  // var primitiveType = gl.LINES;
  
  
  
  for (var i = 0; i < sceneGrapth.objects.length; i++) {
    const ff = sceneGrapth.objects[i];
    if(ff.visible === false){
      continue; // skip this render
    }
    ff.gl = gl;
    
    // here we could interject dirty flags
    // so check things like .isSelectable = true
    // then add back into the scenegrapth
    
    
    // if(ff.programInfo === null){
    //   // gl.useProgram(this.programInfo.program);
    // }
    // else {
    //   // Tell WebGL to use our program when drawing
    //   // gl.useProgram(ff.programInfo.program);
    // }
    
    // console.log(this.shaderProgram);
    // gl.useProgram(this.programInfo.program);
    
    gl.useProgram(this.shaderProgram);
    
    // if(ff.name !== "world"){
    //   // debugger
    // }
    // new!
    ff.refreshMatrixes();
    
    // Update and play need to be merged
    
    // does logic stuff, then draws
    // Hrrrmmmmm, yes its needed
    ff.update();
    
    // This too has logics for animations
    // THIS for now is how its computing transforms
    // Say in Quark.js or Polygon
    ff.play();
    
    
    ff.draw();
    
    // ff.draw(this.programInfo.uniformLocations.colorUniformLocation, 
      // this.programInfo.uniformLocations.matrixUniformLocation, this.textureLocation);
    // 
    // ff.draw(this.colorUniformLocation, 
      // this.matrixUniformLocation, this.textureLocation);
    
    const vertexCount = ff.pointsCount;
    
    // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawArrays
    if(ff.subType === "wirefornow" || ff.renderType === "wires"){
      // boo no width option
      // gl.lineWidth(10);
      // console.log(gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE))
      // gl.drawArrays(gl.LINES, offset2, vertexCount);
      // gl.drawArrays(gl.LINE_STRIP, offset2, vertexCount);
      gl.drawArrays(gl.LINE_LOOP, offset2, vertexCount);
    }
    else {
      // gl.drawArrays(primitiveType, offset2, vertexCount);
      gl.drawArrays(gl.TRIANGLES, offset2, vertexCount);
    }
    
  }
}
