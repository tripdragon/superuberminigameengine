
import {Vector3} from "modules/vector3.js";
import {Matrix4} from "modules/matrix4.js";
import {CheapPool} from "utilites/cheapPool.js";


// need to multiply spoed matrixes not localMatrix



export class Quark {
  
  isQuark = true;
  isMesh = false;
  system = null;
  name = "";
  gl = null; // systems gl canvas element
  // shaderProgram = null;
  // programInfo = null;
  visible = true;
  
  needsUpdateMatrixLocal = false;
  
  up = new Vector3(0,1,0);
  down = new Vector3(0,-1,0);
  left = new Vector3(-1,0,0);
  right = new Vector3(1,0,0);
  forward = new Vector3(0,1,0);
  backwards = new Vector3(0,-1,0);
  
  
  position = new Vector3(0,0,0);
  mPosition = new Vector3(Infinity, Infinity, Infinity); // not sure of this yet
  
  rotation = new Vector3(); // should be Euler() but we dont have that yet
  mRotation = new Vector3();
  
  scale = new Vector3(1,1,1);
  mScale = new Vector3(1,1,1);
  
  localMatrix = new Matrix4();
  worldMatrix = new Matrix4();
  
  workRotationM = new Matrix4();
  workPositionM = new Matrix4();
  workScaleM = new Matrix4();

  // localMatrix_changed = false; // dirty flag ?
  worldMatrix_changed = false; // dirty flag ?
  workMatrix = new Matrix4();
  rotationWorkMatrix = new Matrix4();

  constructor({name="",...props}={}){
    this.name = name;
    const {
      system = null,
      gl = null
    } = props;
    this.system = system;
    // debugger
    this.gl = gl;
  }
  
  
  update(){}
  
  play(){}
  
  // over write this in subclass
  draw(){}
  // draws to the buffer
  // draw(colorUniformLocation, matrixLocation){
  //   // mesh objects have color
  //   // this.gl.uniform4f(colorUniformLocation, this.color.r, this.color.g, this.color.b, 1);      
  //   // if(colorUniformLocation)
  //   this.gl.uniformMatrix4fv(matrixLocation, false, this.worldMatrix.elements);
  // }








  
  refreshMatrixes(){
    
    
    if(!this.mRotation.equals(this.rotation)){
      this.mRotation.copy(this.rotation);
      // this.workRotationM.setRotationFromEuler(0,0,0);
      this.workRotationM.setRotationFromEuler(this.rotation);
      this.needsUpdateMatrixLocal = true;
    }
    
    if(!this.mScale.equals(this.scale)){
      this.mScale.copy(this.scale);
      this.workScaleM.setScale(this.scale.x,this.scale.y,this.scale.z);
      this.needsUpdateMatrixLocal = true;
    }
    
    if(!this.mPosition.equals(this.position)){
        this.mPosition.copy(this.position);
        // console.log("refreshMatrixes");
        
        // for later 		this.matrix.compose( this.position, this.quaternion, this.scale );
        // this.localMatrix.setTranslation(this.position.x,this.position.y,this.position.z);
        
        // this.localMatrix.setTranslation(this.position.x,this.position.y,this.position.z);
        this.workPositionM.setTranslation(this.position.x,this.position.y,this.position.z);
        
        // this.localMatrix.setRotation(this.rotation.x,this.rotation.y,this.rotation.z);
        // this.localMatrix.setRotation(this.rotation.x,this.rotation.y,this.rotation.z);
        // this.updateWorldMatrix();
        
        this.needsUpdateMatrixLocal = true;
        
        // console.log(this.localMatrix.elements);
        
        // if(this.parent){
        //   this.worldMatrix.multiplyMatrices(this.parent.worldMatrix, this.localMatrix);
        // }
        // else {
        //   this.worldMatrix.copy(this.localMatrix);
        // }
    }
    
    if(this.needsUpdateMatrixLocal){
      this.localMatrix.identity()
      .multiply(this.workPositionM)
      .multiply(this.workRotationM)
      .multiply(this.workScaleM);
      
      this.updateWorldMatrix();
      this.needsUpdateMatrixLocal = false;
    }
    
    
    // does not work to cache a matrix update yet
    // if(!this.mPosition.equals(this.position)){
    // 
    //   this.mPosition.copy(this.position);
    //   console.log("refreshMatrixes");
    // 
    //   // this.localMatrix.setTranslation(this.position.x,this.position.y,this.position.z);
    //   // 
    //   //         // debugger
    //   //         // this.localMatrix.translate(this.position.x,this.position.y,this.position.z);
    //   // 
    //   // 
    //   // this.updateWorldMatrix();
    //   // 
    // }
    
    
    // this performs the matrix updates for now
    // this one applys the position translation
    // this.u_matrix.setTranslation(0,0,0);
    
    // this is most likely not the right way to do this, but its working for now
    // this.u_matrix.identity().multiply(this.system.projectionMatrix);
    // this.localMatrix.identity().multiply(this.system.projectionMatrix);
    // this.localMatrix.setTranslation(this.position.x,this.position.y,this.position.z);

        // 
        // this.localMatrix.copy(this.system.projectionMatrix);
        // this.localMatrix.translate(this.position.x,this.position.y,this.position.z);

        // debugger
    // 
    // this.localMatrix.setTranslation(this.position.x,this.position.y,this.position.z);
    // 
    //         // debugger
    //         // this.localMatrix.translate(this.position.x,this.position.y,this.position.z);
    // 
    // 
    // // this.updateWorldMatrix();
    // 
    // if(this.parent){
    //   this.worldMatrix.multiplyMatrices(this.parent.worldMatrix, this.localMatrix);
    // }
    // else {
    //   this.worldMatrix.copy(this.localMatrix);
    // }
    
    // 
  }
  
  
  // APPPP.world.updateWorldMatrix()
  // if you call it with a matrix then it will change its world position
  // otherwise will stay the same
  // it then does the same for all down chain
  updateWorldMatrix(parentWorldMatrix){
    
    if(parentWorldMatrix){
      this.worldMatrix.multiplyMatrices(parentWorldMatrix, this.localMatrix);
    }
    else if(this.parent){
      this.worldMatrix.multiplyMatrices(this.parent.worldMatrix, this.localMatrix);
    }
    else {
      this.worldMatrix.copy(this.localMatrix);
    }
    
    // recussion updates chain
    // now process all the friends
    
    var worldMatrix = this.worldMatrix;
    
    if(this.friends.length > 0){
      this.friends.forEach(function(item) {
        item.updateWorldMatrix(worldMatrix);
      });
    }
  }





  // nesting objects, carry over stuff from other app

  // when updating
  // need to update matrix stuff
  _parent = null; // T : Quark
  
  // Not sure of this get set yet
  get parent(){
    return this._parent;
  }
  set parent(friend){
    if(friend instanceof Quark){
      friend.add(this);
    }
    else if(this.friend === null){
      friend.remove(this);
    }
  }
  
  friends = new CheapPool();
  
  add(friend, isNew){
      // if typeOf is needed
      if(friend.isQuark){
        var index = this.friends.indexOf(friend);
        if(index > -1){
          console.log("already have friend");
        }
        else {
          if(friend._parent !== null){
            friend._parent.remove(friend);
          }
          this.friends.push(friend);
          friend._parent = this;
          // debugger
        }
      }
      else {
        console.warn("not instanceof Quark");
      }
      // this SHOULD be automatic later on
      // if(isNew){
      // 
      // }
  }
  remove(friend, shouldDelete){
    // console.warn("need to check if this REEAAAALLLY clears the buffers and such");
    if(friend.isQuark){
      var index = this.friends.indexOf(friend);
      if(index > -1){
        this.friends.splice(index,1);
        friend._parent = null;
        
        if(shouldDelete){
          this.delete();
        }
      }
    }
    else {
      console.warn("not instanceof Quark");
    }
  }
  delete(){
    if(this.parent){
      this.parent.remove(this);
    }
    
    this.system.sceneGrapth.remove(this);
    
    console.warn("need to check if this REEAAAALLLY clears the buffers and such");
  }
  
  
    
}
