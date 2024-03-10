
import {Quark} from "./quark.js";
import {Vector3} from "modules/vector3.js";

class Camera extends Quark{
  isCamera = true;
  target = new Vector3();
}

export class PerspectiveCamera extends Camera{
  isPerspectiveCamera = true;
  fov = 35; // degrees since thats the standard
  near = 0.01;
  far = 1000;
  constructor(fov,near,far){
    this.set(fov,near,far);
  }
  set(fov,near,far){
    this.fov = fov;
    this.near = near;
    this.far = far;
  }
}


export class OrthographicCamera extends Camera{
  isOrthographicCamera = true;
  top = 0;
  left = 0;
  bottom = 1;
  right = 1;
  constructor(left,right,top,bottom){
    this.set(left,right,top,bottom);
  }
  set(left,right,top,bottom){
    this.top = top;
    this.left = left;
    this.bottom = bottom;
    this.right = right;
  }
}
