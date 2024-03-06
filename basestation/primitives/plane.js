

import {Quark} from "./quark.js";

import {Vector3} from "modules/vector3.js";
import {Matrix4} from "modules/matrix4.js";

import {buildProgramInfo} from "gl/programInfo.js";
import {initShaderProgramFlatShader} from "gl/shaders.js";

export class Plane extends Quark {
    
    isPlane = true;
    isMesh = true;
    
    // buffer array
    positions = new Float64Array(18); // 3*3*2 //positions = [];
    pointsCount = 6; // two tris
    
    // points
    // local space
    // counter clockwise
    // +0   +3
    // +1   +2
    // the points of the geometry not the buffer positions
    // buffer has 6 points has 4 length
    // HOWEVER this could be transformed to a BufferArray and access as [index+n(1,2,3)]
    // which is annoying, but faster?¿
    points = [new Vector3(-1,1,0),new Vector3(-1,-1,0),new Vector3(1,-1,0),new Vector3(1,1,0)];
    // these dont mutate
    basepoints = [new Vector3(-1,1,0),new Vector3(-1,-1,0),new Vector3(1,-1,0),new Vector3(1,1,0)];
    
    shaderProgram = null;
    programInfo = null;
    
    
    constructor({name="plane",...props}={}){
      super({name:name,...props});
      
      const {
        width = 1,
        height = 1,
      } = props;
      
      // this.recomputeSides();
      // plane has no origin persay
      // its geometry is offset to handle this by default
      // thus we have to calculate and prebake positions
      // this.centerPositions();
      this.setSize(width,height);
      // this.computeBoundingBoxes();
      
      //// this.computeBoundingBoxPadding();
      //// this.startTexture();
      //// this.initGLStuff();
      
      // this.position.z = 10
      
      this.glInit();
      
    }
    
    setSize(width,height){
      const ww = width / 2;
      const hh = height / 2;
      const points = this.points;
      const bb = this.basepoints;
      
      points[0].x = bb[0].x * ww; points[0].y = bb[0].y * hh; points[0].z = 0;
      points[1].x = bb[1].x * ww; points[1].y = bb[1].y * hh; points[1].z = 0;
      points[2].x = bb[2].x * ww; points[2].y = bb[2].y * hh; points[2].z = 0;
      points[3].x = bb[3].x * ww; points[3].y = bb[3].y * hh; points[3].z = 0;

      this.updatePositions();
      
    }

    // updates the buffer positions from the 4 points logics
    updatePositions(){
      var positions = this.positions;
      var points = this.points;
      // gurgle
      
      positions[0] = points[0].x; positions[1] = points[0].y; positions[2] = 0;
      positions[3] = points[1].x; positions[4] = points[1].y; positions[5] = 0;
      positions[6] = points[2].x; positions[7] = points[2].y; positions[8] = 0;
      // tri 2
      positions[9] = points[2].x; positions[10] = points[2].y; positions[11] = 0;
      positions[12] = points[3].x; positions[13] = points[3].y; positions[14] = 0;
      positions[15] = points[0].x; positions[16] = points[0].y; positions[17] = 0;
      
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
    
    programInfo = null;
    loadedTexture = false;
    // hasInitGL = false;
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
    
    glInit(){
      if(this.hasGLInit){
        return;
      }
      this.hasGLInit = true;
      
      this.matrixTemp = new Matrix4();
      
      // this.buildProgramInfo();
      // attachProgramInfo_CM({
      //   target:this,
      //   gl:this.gl,
      //   screenMode:"2d"
      // });
      this.shaderProgram = initShaderProgramFlatShader(this.gl);
      if(this.shaderProgram){
        this.programInfo = buildProgramInfo({gl:this.gl,shaderProgram:this.shaderProgram,screenMode:"2d"});
      }
      
      
      //
      // building position buffers
      //
      // console.log("initGLStuff 222");
      
      this.positionsBuffer = this.gl.createBuffer();
      
      // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.system.POSITIONS_BUFFER);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionsBuffer);
      
      { // Building geometry

        const numComponents = 3; // pull out 3 values per iteration for xyz
        const type = this.gl.FLOAT; // the data in the buffer is 32bit floats
        const normalize = false; // don't normalize
        const stride = 0; // how many bytes to get from one set of values to the next
        // 0 = use type and numComponents above
        const offset = 0; // how many bytes inside the buffer to start from
        this.gl.vertexAttribPointer(
          this.programInfo.attribLocations.vertex,
          numComponents,
          type,
          normalize,
          stride,
          offset
        );
        // this brewaks if commented out
        this.gl.enableVertexAttribArray(this.programInfo.attribLocations.vertex);
        
        // this should only be applied once since its reading
        // UNLESS you change the vertices
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.positions), this.gl.STATIC_DRAW);
      }

      { // temp color display
        this.colorBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        const cc = [];
        const len = 3*2*3; // 3 points * t tris * rgb slots
        for (var i = 0; i < len; i++) {
          cc[i] = 255;
        }
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Uint8Array(cc), this.gl.STATIC_DRAW);
      }


      { // building initial texture
        
        // Fill the texture with a 1x1 blue pixel.
        this.texture = this.gl.createTexture();
        
        this.textureCoordBuffer = this.gl.createBuffer();
        
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureCoordBuffer);
        const textureCoordinates = [ 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1 ];
        
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), this.gl.STATIC_DRAW );


        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE,
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
        draw(){
          const gl = this.gl;
          // gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
          
          //
          // setup vertex pos
          // 

          {
            gl.enableVertexAttribArray(this.programInfo.attribLocations.vertex);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.positionsBuffer);

            const numComponents = 3;
            const type = gl.FLOAT; // the data in the buffer is 32bit floats
            const normalize = false;
            const stride = 0;
            const offset = 0;
            
            gl.vertexAttribPointer(
              this.programInfo.attribLocations.vertex,
              numComponents,
              type,
              normalize,
              stride,
              offset
            );
          }
          
          {
            gl.enableVertexAttribArray(this.programInfo.attribLocations.color);
            gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
            const numComponents = 3;
            // const type = gl.FLOAT; // the data in the buffer is 32bit floats
            const type = gl.UNSIGNED_BYTE;  // the data is 8bit unsigned values
            const normalize = true;
            const stride = 0;
            const offset = 0;
            
            gl.vertexAttribPointer(
              this.programInfo.attribLocations.color,
              numComponents,
              type,
              normalize,
              stride,
              offset
            );
          }



          // Compute the matrices
          // fake camera for now
          this.matrixTemp.projection(gl.canvas.clientWidth, gl.canvas.clientHeight, 400);
          // matrix = m4.translate(matrix, translation[0], translation[1], translation[2]);
          // matrix = m4.xRotate(matrix, rotation[0]);
          // matrix = m4.yRotate(matrix, rotation[1]);
          // matrix = m4.zRotate(matrix, rotation[2]);
          // matrix = m4.scale(matrix, scale[0], scale[1], scale[2]);

          // Set the matrix.
          //   var matrixLocation = gl.getUniformLocation(program, "u_matrix");
          // Set the matrix.
          // gl.uniformMatrix4fv(matrixLocation, false, matrix);
          
          
          // we dont have a proper camera yet
          // gl.uniformMatrix4fv(this.programInfo.uniformLocations.modelMatrix, false, this.matrixTemp.elements);
          
          // this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.modelMatrix, false, this.workMatrix.multiplyMatrices( this.system.projectionMatrix, this.worldMatrix).elements);
          this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.modelMatrix, false, this.workMatrix.multiplyMatrices( this.matrixTemp, this.worldMatrix).elements);
                

          // Draw the geometry.
          // var primitiveType = gl.TRIANGLES;
          // var offset = 0;
          // var count = 16 * 6;
          // gl.drawArrays(primitiveType, offset, count);
          // 
          // this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.modelMatrix, false, this.workMatrix.multiplyMatrices( this.system.projectionMatrix, this.worldMatrix).elements);

        }
        
        ___draw(){
          
          if(this.hasGLInit === false){
            // this.glInit();
            
            // if( !this.system.annoyannnsnhwyer63Once ){
            //   this.system.annoyannnsnhwyer63Once = true;
            //   console.warn("WE NEED TO FIGURE OUT WHY this is needed");
            //   console.log("see #annnsnhwyer63");
            //   console.log("to handle the square tool to work");
            //   console.log("techaniicllcllcy this is quite expenssive to constatly run");
            //   console.log("so we just need a width !+= mWidth etc");
            // }
          }
          
          
          
          //
          // setup vertex pos
          // 

          {
            this.gl.enableVertexAttribArray(this.programInfo.attribLocations.vertex);
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionsBuffer);
            
            
            const numComponents = 3;
            const type = this.gl.FLOAT; // the data in the buffer is 32bit floats
            const normalize = false; // don't normalize
            const stride = 0; // how many bytes to get from one set of values to the next
            // 0 = use type and numComponents above
            const offset = 0; // how many bytes inside the buffer to start from
            // this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionsBuffer);
            
            this.gl.vertexAttribPointer(
              this.programInfo.attribLocations.vertex,
              numComponents,
              type,
              normalize,
              stride,
              offset
            );
            
            
          }

          
          // Set the shader uniforms
                // this.gl.uniform4f(this.programInfo.uniformLocations.color, this.color.r, this.color.g, this.color.b, 1);

          this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.modelMatrix, false, this.workMatrix.multiplyMatrices( this.system.projectionMatrix, this.worldMatrix).elements);
                
          
          this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionsBufferLocal);
          
          {
            const numComponents = 3; // pull out 3 values per iteration for xyz
            const type = this.gl.FLOAT; // the data in the buffer is 32bit floats
            const normalize = false; // don't normalize
            const stride = 0; // how many bytes to get from one set of values to the next
            // 0 = use type and numComponents above
            const offset = 0; // how many bytes inside the buffer to start from
            this.gl.vertexAttribPointer(
              this.programInfo.attribLocations.vertex,
              numComponents,
              type,
              normalize,
              stride,
              offset
            );
            // this brewaks if commented out
            this.gl.enableVertexAttribArray(this.programInfo.attribLocations.vertex);
          }

          // this should only be applied once since its reading
          // UNLESS you change the vertices
          // the order is weird here for now
          if(this.hasSetupdataBuffer === false){
            this.hasSetupdataBuffer = true;
          }
          
          // console.warn("WE NEED TO FIGURE OUT WHY this is needed");
          // console.log("to handle the square tool to work");
          // console.log("techaniicllcllcy this is quite expenssive to constatly run");
          // console.log("so we just need a width !+= mWidth etc");
          // #annnsnhwyer63
          this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.positions), this.gl.STATIC_DRAW);
          
          
                // if(this.shouldLoadImage === true && this.hasStartedLoadingImage === false){
                //   console.log("hasStartedLoadingImage 2222");
                //   this._loadImage(this.cachedImageURL);
                // }
          
          
          //
          // set up texcoords
          //
          {
            const num = 2; // every coordinate composed of 2 values
            const type = this.gl.FLOAT; // the data in the buffer is 32-bit float
            const normalize = false; // don't normalize
            const stride = 0; // how many bytes to get from one set to the next
            const offset = 0; // how many bytes inside the buffer to start from
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.textureCoordBuffer);
            this.gl.vertexAttribPointer(
              this.programInfo.attribLocations.textureCoord,
              num,
              type,
              normalize,
              stride,
              offset
            );
            this.gl.enableVertexAttribArray(this.programInfo.attribLocations.textureCoord);
          }
          
          
          // sdkjnfgldfg
          // this.gl.uniform4f(this.programInfo.uniformLocations.color, this.color.r, this.color.g, this.color.b, 1);
          this.gl.uniform4f(this.programInfo.uniformLocations.color, 1, 1, 1, 1);
          
          // MAYBE handle the projection here
          // its building but not moving
          
          this.gl.uniformMatrix4fv(this.programInfo.uniformLocations.modelMatrix, false, this.workMatrix.multiplyMatrices( this.system.projectionMatrix, this.worldMatrix).elements);

          
          
    

          // Tell WebGL we want to affect texture unit 0
          this.gl.activeTexture(this.gl.TEXTURE0);
        
          // Bind the texture to texture unit 0
          this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        
          // Tell the shader we bound the texture to texture unit 0
          this.gl.uniform1i(this.programInfo.uniformLocations.uTexture, 0);
        

          // this should only be applied once since its reading
          // UNLESS you change the vertices
          // the order is weird here for now
          if(this.hasSetupdataBuffer === false){
            this.hasSetupdataBuffer = true;
            this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(this.positions), this.gl.STATIC_DRAW);
          }
            
          
          
          // return
          // a lot was snipped out, se original file project
          
        
        }
        

}
