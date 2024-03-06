



// holds all the things
// unless there are universes at some point


import {Quark} from "./quark.js";


export class World extends Quark {
// export class World extends Plane {
  
  isWorld = true;
  subType = "world";
  canCollide = false;
  
  constructor({system}) {
    // name, x, y, width, height, depth, color = {r:1.0, g:1.0, b:1.0, a:1.0}, system) {
    super(name:"world",system:system);
    this.canCollide = false;
  }
  
  draw(){
    
  }

}
