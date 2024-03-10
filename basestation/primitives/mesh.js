

import {Quark} from "./quark.js";
import {Material} from "gl/material.js";

import {Vector3} from "modules/vector3.js";
import {Matrix4} from "modules/matrix4.js";
import {Color} from "modules/color.js";

// import {buildProgramInfo} from "gl/programInfo.js";
// import {initShaderProgramFlatShader} from "gl/shaders.js";


// we DONT seperate geometry from object like in threejs
// cause eh, less abstraction for now

export class Mesh extends Quark{
  isMesh = true;
  
  // materials = new CheapPool();
  // material = new Material();
  material;
  colorHex;
  
  // programInfo = null;
  loadedTexture = false;
  hasSetupdataBuffer = false;
  positionsBufferLocal = null;
  textureCoordBuffer = null;
  cachedImageURL = null;
  
  hasLoadedImage = false;
  hasStartedLoadingImage = false;
  image = null;
  shouldLoadImage = false;
  
  hasGLInit = false;
  
  positionsBuffer = null;
  
  // vertex array object
  vao = null;
  
  constructor(props){
    // debugger
    super({...props});
    const {
      colorHex = 0xffffff
    } = props;
    this.colorHex = colorHex;
  }
  
  
  


  // +++++++++++
  // GL copy over
  
  // 
  // 
  // #drawing routines, should be moved into function
  // 
  // 
  // 
  // 

  glInit(){
    if(this.hasGLInit){
      return;
    }
    this.hasGLInit = true;
    
    const gl = this.gl;
    
    this.matrixTemp = new Matrix4();
    
    // this.buildProgramInfo();
    // attachProgramInfo_CM({
    //   target:this,
    //   gl:this.gl,
    //   screenMode:"2d"
    // });
    // debugger
    this.material = new Material({gl:gl,color:this.colorHex});
    
                      // this.shaderProgram = initShaderProgramFlatShader(gl);
                      // if(this.shaderProgram){
                      //   this.programInfo = buildProgramInfo({gl:gl,shaderProgram:this.shaderProgram,screenMode:"2d"});
                      // }
    
    
    //
    // building position buffers
    //
    // console.log("initGLStuff 222");
    
    this.positionsBuffer = gl.createBuffer();
    
    // gl.bindBuffer(gl.ARRAY_BUFFER, this.system.POSITIONS_BUFFER);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionsBuffer);
    
    // Create a vertex array object (attribute state)
    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);
    gl.enableVertexAttribArray(this.material.programInfo.attribLocations.vertex);

    
    { // Building geometry

      const numComponents = 3; // pull out 3 values per iteration for xyz
      const type = gl.FLOAT; // the data in the buffer is 32bit floats
      const normalize = false; // don't normalize
      const stride = 0; // how many bytes to get from one set of values to the next
      // 0 = use type and numComponents above
      const offset = 0; // how many bytes inside the buffer to start from
      // gl.vertexAttribPointer(
      //   this.programInfo.attribLocations.vertex,
      //   numComponents,
      //   type,
      //   normalize,
      //   stride,
      //   offset
      // );
      // // this brewaks if commented out
      // gl.enableVertexAttribArray(this.programInfo.attribLocations.vertex);
      // 
      
      gl.vertexAttribPointer(this.material.programInfo.attribLocations.vertex, numComponents, type, normalize, stride, offset);

      
      // this should only be applied once since its reading
      // UNLESS you change the vertices
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);
    }

    // { // temp color display
    //   this.colorBuffer = gl.createBuffer();
    //   gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    //   const cc = [];
    //   const len = 3*2*3; // 3 points * t tris * rgb slots
    //   for (var i = 0; i < len; i++) {
    //     // cc[i] = 255;
    //     cc[i] = 1;
    //   }
    //   // gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(cc), gl.STATIC_DRAW);
    //   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(new Array(len).fill(0.01)), gl.STATIC_DRAW);
    // }
    
    { // temp color display
      this.colorBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
      const cl = this.material.color;
      // console.log(cl);
      const cc = [];
      // debugger
      // const len = 3*2; // 3 points * t tris
      const len = this.positions.length/3 * 3; // 3 points * t tris, derive tris count from positions length / 3
      for (var i = 0; i < len; i++) {
        cc[i*3] = cl.r;
        cc[i*3+1] = cl.g;
        cc[i*3+2] = cl.b;
        // cc[i*3] = Math.random();
        // cc[i*3+1] = Math.random();
        // cc[i*3+2] = Math.random();
      }
      // step for each rgb [012,345,678...]
      // for (var i = 0; i < 3*2; i++) {
      //   console.log(i*3, i*3+1, i*3+2 );
      // }
      // gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(cc), gl.STATIC_DRAW);
      // gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(cc), gl.STATIC_DRAW);
      // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(new Array(len).fill(0.01)), gl.STATIC_DRAW);
      // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(new Array(3*2*3).fill(Math.random())), gl.STATIC_DRAW);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(cc), gl.STATIC_DRAW);
      
    }


    { // building initial texture
      
      // Fill the texture with a 1x1 blue pixel.
      this.texture = gl.createTexture();
      
      this.textureCoordBuffer = gl.createBuffer();
      
      gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
      const textureCoordinates = [ 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1 ];
      
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW );


      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      
      gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE,
        // new Uint8Array([this.color.r*255, this.color.g*255, this.color.b*255, 255]));
        new Uint8Array([1*255, 1*255, 1*255, 255]));
    }



  }
  
  
  
      // 
      // Draw
      // 
      // draw(color, matrixLocation, textureLocation){
      // annoyannnsnhwyer63Once = false;
      
      // temp working
      draw({cameraMatrix}){
        const gl = this.gl;
        // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        
        //
        // setup vertex pos
        // 
        

        // {
        //   gl.enableVertexAttribArray(this.programInfo.attribLocations.vertex);
        //   gl.bindBuffer(gl.ARRAY_BUFFER, this.positionsBuffer);
        // 
        //   const numComponents = 3;
        //   const type = gl.FLOAT; // the data in the buffer is 32bit floats
        //   const normalize = false;
        //   const stride = 0;
        //   const offset = 0;
        // 
        //   gl.vertexAttribPointer(
        //     this.programInfo.attribLocations.vertex,
        //     numComponents,
        //     type,
        //     normalize,
        //     stride,
        //     offset
        //   );
        // }
        
        // this replaces the positions buffer stuff
        gl.bindVertexArray(this.vao);
        
        // do the same for color when things work
        
        {
          gl.enableVertexAttribArray(this.material.programInfo.attribLocations.color);
          gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
          const numComponents = 3;
          const type = gl.FLOAT; // the data in the buffer is 32bit floats
          // const type = gl.UNSIGNED_BYTE;  // the data is 8bit unsigned values
          // const normalize = true;
          const normalize = false;
          const stride = 0;
          const offset = 0;
          
          gl.vertexAttribPointer(
            this.material.programInfo.attribLocations.color,
            numComponents,
            type,
            normalize,
            stride,
            offset
          );
        }


        // Set the matrix.
        //   var matrixLocation = gl.getUniformLocation(program, "u_matrix");
        // Set the matrix.
        // gl.uniformMatrix4fv(matrixLocation, false, matrix);
        
        // this.matrixTemp.yRotate(this.workMatrix, __dats.ry);
        // this.matrixTemp.setTranslation( this.position.x, this.position.y, this.position.z );
        
        // this.localMatrix.setRotationY(__dats.x2);

  // debugger
        this.gl.uniformMatrix4fv(this.material.programInfo.uniformLocations.modelMatrix, false, this.workMatrix.multiplyMatrices( cameraMatrix, this.worldMatrix).elements);
              
              // this.programInfo.uniformLocations.modelMatrix.yRotate(this.matrixTemp, __dats.ry);

        // Draw the geometry.
        // var primitiveType = gl.TRIANGLES;
        // var offset = 0;
        // var count = 16 * 6;
        // gl.drawArrays(primitiveType, offset, count);
        // 
        // this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.modelMatrix, false, this.workMatrix.multiplyMatrices( this.system.projectionMatrix, this.worldMatrix).elements);

      }
      
  
  
}
