
import {Quark} from "./quark.js";
import {Vector3} from "modules/vector3.js";
import {Matrix4} from "modules/matrix4.js";
import {degreeToRad} from "modules/mathness.js";

const workMatrix = new Matrix4();

class Camera extends Quark{
  isCamera = true;
  target = new Vector3();
  projectionMatrix = new Matrix4();
  viewMatrix = new Matrix4();
  viewProjectionMatrix = new Matrix4();
  lookat = new Vector3();
  useLootAt = false;
  
  // call this if you dont need the camera transform
  // otherwise call getViewProjectionMatrix()
  updateProjectionMatrix(){}
  
  // produces the inverse view matrix
  updateViewMatrix(){
    this.refreshMatrixes(); // from quark
    if(this.useLootAt === false){
      this.viewMatrix.copy(this.worldMatrix).invert();
    }
    else {
      // workMatrix.copy(this.worldMatrix);
      // workMatrix.lookAt(this.position, this.lookat, this.up);
      this.worldMatrix.lookAt(this.position, this.lookat, this.up);
      this.viewMatrix.copy(this.worldMatrix).invert();
    }
  }
  // used to get the projection * view matrix for 3d camera transforms
  getViewProjectionMatrix(){
    this.updateProjectionMatrix();// each subclass will call its instead
    this.updateViewMatrix();
    return this.viewProjectionMatrix.multiplyMatrices(this.projectionMatrix, this.viewMatrix);
  }
}

export class PerspectiveCamera extends Camera{
  isPerspectiveCamera = true;
  fov = 35; // degrees since thats the standard
  near = 0.01;
  far = 1000;
  aspect = 1;
  constructor(fov,aspect,near,far){
    super();
    this.set(fov,aspect,near,far);
  }
  set(fov,aspect,near,far){
    this.fov = fov;
    this.near = near;
    this.far = far;
    this.aspect = aspect;
  }
  updateProjectionMatrix(){
    // const aspect = this.gl.canvas.clientWidth / this.gl.canvas.clientHeight;
    this.projectionMatrix.perspective( degreeToRad(this.fov), this.aspect, this.near, this.far );
  }
  
}


export class OrthographicCamera extends Camera{
  isOrthographicCamera = true;
  top = 0;
  left = 0;
  bottom = 1;
  right = 1;
  near = 0;
  far = 1000;
  constructor(left,right,top,bottom,near,far){
    super();
    this.set(left,right,top,bottom,near,far);
  }
  set(left,right,top,bottom,near,far){
    this.top = top;
    this.left = left;
    this.bottom = bottom;
    this.right = right;
    this.near = near;
    this.far = far;
  }
  updateProjectionMatrix(){
    // ortho, seems offset though
    // this.projectionMatrix.orthographic(0,gl.canvas.clientWidth, 0, gl.canvas.clientHeight,400,-400);
    this.projectionMatrix.orthographic(this.left,this.right, this.top, this.bottom,this.near,this.far);
  }
}
