
// pipelines

//drawSceneScreenspace

import {Pipeline} from "./pipeline.js";
import {Matrix4} from "modules/matrix4.js";
import {degreeToRad} from "modules/mathness.js";
// import {programInfo} from "gl/programInfo.js";
// import {attachProgramInfo_CM} from "gl/programInfo.js";

// for sceneGrapth we dont assign it, cause we might live change it
// dukno
// same for camera

const cameraMatrix = new Matrix4();
const rotationWorkMatrix = new Matrix4();

export class ScreenSpace extends Pipeline{
  
  isScreenSpace = true;
  
  constructor({system,scene,gl}){
    super({system,scene,gl});
    
    // console.log("attachProgramInfo_CM can be moved from here!!");
    // attachProgramInfo_CM({
    //   target:this.system,
    //   gl:this.gl,
    //   screenMode:"2d"
    // });
  }
  drawFrame({sceneGrapth,camera}){
    // debugger
    
    // This is a mess
    redraw({
      scene:this.scene,
      gl:this.gl,
      
      // programInfo:this.programInfo,
      // programInfo: this.system.programInfo,
      // shaderProgram: this.system.shaderProgram,
      sceneGrapth:sceneGrapth,
      camera:camera
    });
  }
}

// +++++++++++++++

// export function drawSceneScreenspace({app,gl,programInfo}){
// function redraw({app,gl,programInfo,sceneGrapth,camera}){
function redraw({shaderProgram,scene,gl,programInfo,sceneGrapth,camera}){
  
  // const color = app.backgroundColor;
  const color = scene.backgroundColor;
  
  // var color = {r:0.0, g:0.0, b:0.7, a:1};
  
  gl.clearColor(color.r, color.g, color.b, color.a); // Clear to black, fully opaque
  // gl.clearColor(0, 0, 1, 1); // Clear to black, fully opaque
  
  gl.clearDepth(1.0); // Clear everything
  gl.enable(gl.DEPTH_TEST); // Enable depth testing
  gl.depthFunc(gl.LEQUAL); // Near things obscure far things
  

  // Clear the canvas before we start drawing on it.
  // Tell WebGL how to convert from clip space to pixels
  // this is wrong, it should be system.gameWidth
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  
  
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


  
  // working out camera
  {
    // const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    // cameraMatrix.perspective( degreeToRad(__dats.fov), aspect, __dats.near, __dats.far );
    //// cameraMatrix.perspective(__dats.fov, aspect, __dats.near, __dats.far );
    // cameraMatrix.translate(__dats.x,__dats.y,__dats.z);
    // rotationWorkMatrix.setRotationY( __dats.ry );
    //// rotationWorkMatrix.setRotationY( degreeToRad( __dats.ry ) );
    // cameraMatrix.multiply(rotationWorkMatrix);
    
    // ortho, seems offset though
    // cameraMatrix.makeOrthographic(0,gl.canvas.clientWidth, 0, gl.canvas.clientHeight,400,-400);
    // cameraMatrix.translate(__dats.x,__dats.y,__dats.z);
    // rotationWorkMatrix.setRotationY(__dats.ry);
    // cameraMatrix.multiply(rotationWorkMatrix);
    
    // camera.updateProjectionMatrix();
    // cameraMatrix.copy(camera.projectionMatrix)
    // camera.updateViewMatrix();
    
    
  }
  camera.position.set( __dats.x, __dats.y, __dats.z);
  camera.rotation.y = __dats.ry;
  // camera.position.set( Math.cos(__dats.theta)*__dats.radius, __dats.y, Math.sin(__dats.theta)*__dats.radius);
  
  // this version does all the things for transform, but we need lookat() to make the
  // camera rotate around the scene 
  camera.useLootAt = true;
  const viewProjectionMatrix = camera.getViewProjectionMatrix();
  
  // this version does not do camera transform, just renders
  // camera.refreshMatrixes();
  // camera.updateProjectionMatrix();
  // const viewProjectionMatrix = camera.projectionMatrix;
  

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
    // 
    // ff.position.x = Math.random()*200;
    
    // ff.position.x = __dats.x2;
    // ff.scale.x = __dats.s2;
    // ff.scale.y = __dats.s2;
    // ff.scale.z = __dats.s2;
    
    // ff.rotation.x = __dats.r2x;
    // ff.rotation.y = __dats.r2y;
    // ff.rotation.z = __dats.r2z;
    
    // ff.position.y = __dats.y;
    // ff.position.y = Math.random()*200;
    // ff.position.z = Math.random()*200;
    
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
    // debugger
    // gl.useProgram(this.shaderProgram);
    // gl.useProgram(system.shaderProgram);
    // gl.useProgram(shaderProgram);
    
    // SUBJECTIVE of this not being on system, but lets roll on this app
    if(ff.isMesh && ff.material?.shaderProgram){
      // debugger
      gl.useProgram(ff.material.shaderProgram);
    }
    // programInfo
    
    // Update and play need to be merged
    // these 3 can go into the Game callbacks instead          
                  // does logic stuff, then draws
                  // Hrrrmmmmm, yes its needed
                  ff.update();
                  
                  // This too has logics for animations
                  // THIS for now is how its computing transforms
                  // Say in Quark.js or Polygon
                  ff.play();
                  
                  // if(ff.name !== "world"){
                  //   // debugger
                  // }
                  ff.refreshMatrixes();
                  
                  
                  
    if (ff.isMesh) {
      // ff.draw({cameraMatrix:cameraMatrix});
      ff.draw({cameraMatrix:viewProjectionMatrix});
    }
    
    // ff.draw(this.programInfo.uniformLocations.colorUniformLocation, 
      // this.programInfo.uniformLocations.matrixUniformLocation, this.textureLocation);
    // 
    // ff.draw(this.colorUniformLocation, 
      // this.matrixUniformLocation, this.textureLocation);
    
    if (ff.isMesh) {
      
      const vertexCount = ff.pointsCount;
      
      // https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/drawArrays
      if(ff.material && ff.material.wireframe === false){
        // boo no width option
        // gl.lineWidth(10);
        // console.log(gl.getParameter(gl.ALIASED_LINE_WIDTH_RANGE))
        
        gl.drawArrays(gl.TRIANGLES, offset2, vertexCount);
      }
      if(ff.material && ff.material.wireframe === true){
        gl.drawArrays(gl.LINE_LOOP, offset2, vertexCount);
        // console.log("¿¥¥∑");
      }
      
    }
    
  }
}
