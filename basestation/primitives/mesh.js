

import {Quark} from "./quark.js";
import {Material} from "gl/material.js";

import {Vector3} from "modules/vector3.js";
import {Matrix4} from "modules/matrix4.js";
import {Color} from "modules/color.js";
import {Box3} from "modules/box3.js";
import {requestCORSIfNotSameOrigin} from "utilites/imageLoad.js";

// import {buildProgramInfo} from "gl/programInfo.js";
// import {initShaderProgramFlatShader} from "gl/shaders.js";


// we DONT seperate geometry from object like in threejs
// cause eh, less abstraction for now

export class Mesh extends Quark{
  isMesh = true;
  
  positions = new Float64Array(0); // plane resets this
  // colors = new Float64Array(0)
  
  // materials = new CheapPool();
  // material = new Material();
  material;
  // colorHex;
  colorGLNeedsUpdate = false;
  
  // programInfo = null;
  loadedTexture = false;
  hasSetupdataBuffer = false;
  // positionsBufferLocal = null;
  textureCoordBuffer = null;
  cachedImageURL = null;
  
  hasLoadedImage = false;
  hasStartedLoadingImage = false;
  image = null;
  shouldLoadImage = false;
  
  hasGLInit = false;
  
  positionsBuffer = null;
  colorsBuffer = null;
  
  // vertex array object
  vao = null;
  
  constructor(props){
    // debugger
    super({...props});
    const {
      colorHex = 0xffffff
    } = props;

    this.material = new Material({gl:this.gl,color:colorHex});
  }
  

  
  computeBoundingBox() {
    this.boundingBox = new Box3().setFromObject(this);
    // this.boundingBox = bounding.getSize(new Vector3()).multiplyScalar(0.5);
  }
  
  getVerticeFromBuffer(index,vec){
    vec.set(this.positions[index],this.positions[index+1], this.positions[index+2]);
  }
  // getColorFromBuffer(index,col){
  //   col.set(this.colorsBuffer[index], this.colorsBuffer[index+1], this.colorsBuffer[index+2]);
  // }

  
  delete(){
    super.delete();
    this.gl.deleteBuffer(this.positionsBuffer);
    this.gl.deleteBuffer(this.colorsBuffer);
    this.gl.deleteBuffer(this.textureCoordBuffer);
    // for (var i = 0; i < this.friends.length; i++) {
    //   this.friends[i]
    // 
    // }
  }
  
  clearGLBuffers(){
    this.traverse(function(x){
      x.delete();
    })
  }
  
  traverse( callback ) {
		callback( this );
		const ff = this.friends;
		for ( let i = 0, l = ff.length; i < l; i ++ ) {
			ff[ i ].traverse( callback );
		}
	}

  // 
  // 
  // #drawing routines
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
      
      gl.vertexAttribPointer(this.material.programInfo.attribLocations.vertex, numComponents, type, normalize, stride, offset);

      
      // this should only be applied once since its reading
      // UNLESS you change the vertices
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.positions), gl.STATIC_DRAW);
    }

    // { // temp color display
    //   this.colorsBuffer = gl.createBuffer();
    //   gl.bindBuffer(gl.ARRAY_BUFFER, this.colorsBuffer);
    //   const cc = [];
    //   const len = 3*2*3; // 3 points * t tris * rgb slots
    //   for (var i = 0; i < len; i++) {
    //     // cc[i] = 255;
    //     cc[i] = 1;
    //   }
    //   // gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(cc), gl.STATIC_DRAW);
    //   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(new Array(len).fill(0.01)), gl.STATIC_DRAW);
    // }
    
    { // basic vertex coloring
      this.colorsBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.colorsBuffer);
      
      // same count as positions
      this.colors = new Float64Array(this.positions.length);
      
      this.assignColors(this.material.color);
      this.colorGLNeedsUpdate = true;
  
      // gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(cc), gl.STATIC_DRAW);
      // gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(cc), gl.STATIC_DRAW);
      // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(new Array(len).fill(0.01)), gl.STATIC_DRAW);
      // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(new Array(3*2*3).fill(Math.random())), gl.STATIC_DRAW);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);
      
    }


    { // building initial texture
      
      // Fill the texture with a 1x1 blue pixel.
      
      // this might should be a local const
      this.texture = gl.createTexture();
      
      this.textureCoordBuffer = gl.createBuffer();
      
      gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
      const textureCoordinates = [ 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1 ];
      
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW );

      
      gl.enableVertexAttribArray(this.material.programInfo.attribLocations.texture);
            
            
      // Tell the attribute how to get data out of texcoordBuffer (ARRAY_BUFFER)
      const size = 2;          // 2 components per iteration
      const type = gl.FLOAT;   // the data is 32bit floating point values
      const normalize = true;  // convert from 0-255 to 0.0-1.0
      const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next texcoord
      const offset = 0;        // start at the beginning of the buffer
      gl.vertexAttribPointer(this.material.programInfo.attribLocations.texture, size, type, normalize, stride, offset);
      
      gl.bindTexture(gl.TEXTURE_2D, this.texture);
      
      // Fill the texture with a 1x1 blue pixel.
      // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));
                  

      // 
      // gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, 1, 1, 0, this.gl.RGBA, this.gl.UNSIGNED_BYTE,
      //   // new Uint8Array([this.color.r*255, this.color.g*255, this.color.b*255, 255]));
      //   new Uint8Array([1*255, 1*255, 1*255, 255]));
    }
    



  }
  
  setColorHex(val){
    this.material.color.setHex(val);
    this.assignColors(this.material.color);
    this.colorGLNeedsUpdate = true;
  }
  
  setColorRGB(cc){
    this.material.color.copy(cc);
    this.assignColors(this.material.color);
    this.colorGLNeedsUpdate = true;
  }
  
  assignColors(color){
    const size = 3; // count of vertices in a tri
    // const len = this.positions.length/3 * 3; // 3 points * t tris, derive tris count from positions length / 3
    // uhhh /3 * 3 just cross each out
    const len = this.colors.length; // 3 points * t tris, derive tris count from positions length / 3
    for (var i = 0; i < len; i++) {
      this.colors[i*size] = color.r;
      this.colors[i*size+1] = color.g;
      this.colors[i*size+2] = color.b;
      // cc[i*3] = Math.random();
      // cc[i*3+1] = Math.random();
      // cc[i*3+2] = Math.random();
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
    
    // setup vertex pos
    // this replaces the positions buffer stuff
    gl.bindVertexArray(this.vao);
    
    
    { // do the same for color when things work
      
      if ( this.colorGLNeedsUpdate ) {
        this.colorGLNeedsUpdate = false;
        
        // 
        // this.setColorHex(0x000000)
        
        gl.enableVertexAttribArray(this.material.programInfo.attribLocations.color);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorsBuffer);
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
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);
        
      }
      
    }
    
    // {
    //   // >>>>
    // 
    //   gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
    //   const textureCoordinates = [ 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 0, 1 ];
    // 
    //   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW );
    // 
    // 
    //   gl.enableVertexAttribArray(this.material.programInfo.attribLocations.texture);
    // 
    // 
    //   // Tell the attribute how to get data out of texcoordBuffer (ARRAY_BUFFER)
    //   const size = 2;          // 2 components per iteration
    //   const type = gl.FLOAT;   // the data is 32bit floating point values
    //   const normalize = true;  // convert from 0-255 to 0.0-1.0
    //   const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next texcoord
    //   const offset = 0;        // start at the beginning of the buffer
    //   gl.vertexAttribPointer(this.material.programInfo.attribLocations.texture, size, type, normalize, stride, offset);
    // 
    //   gl.bindTexture(gl.TEXTURE_2D, this.texture);
    // 
    //   // Fill the texture with a 1x1 blue pixel.
    //   // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
    //   gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([255, 255, 255, 255]));
    // 
    // 
    // }
    
    // computing matrix for drawing
    this.gl.uniformMatrix4fv(this.material.programInfo.uniformLocations.modelMatrix, false, this.workMatrix.multiplyMatrices( cameraMatrix, this.worldMatrix).elements);

  }
  


  loadImage(src){
    const _texture = this.texture;
    // Asynchronously load an image
    var image = new Image();
    const gl = this.gl;
    // image.src = "http://localhost:8001/sprites/NFT_gradprix_uponcat.png";
    requestCORSIfNotSameOrigin(image,src);
    image.src = src;
    image.addEventListener('load', function() {
      // Now that the image has loaded make copy it to the texture.
      gl.bindTexture(gl.TEXTURE_2D, _texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,gl.UNSIGNED_BYTE, image);
      gl.generateMipmap(gl.TEXTURE_2D);
    });
  }

  
}
