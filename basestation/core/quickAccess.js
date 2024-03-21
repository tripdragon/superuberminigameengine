

// // for window level commands

import {Vector3} from "modules/vector3.js";
import {Plane} from "primitives/plane.js";
import {Enty} from "modules/basicEntities.js";
import {randomInRange} from "modules/mathness.js";

// for window level commands
export class QuickAccess{
  constructor(system){
    this.system = system;
  }
  
  Vector3 = Vector3;
  
  addPlane({width=10, height=10, colorHex=0x0044a3}={}){
    const aa = new Plane({system:this.system, gl:this.system.gl, width:width,height:height, colorHex:colorHex});
    this.system.currentGame.sceneGrapth.add(aa);
    // Spin(aa);
    return aa;
  }
  
  addManyPlanes(props){
    const {speed=0.1,span=100,count=10,width=10, height=10, colorHex=0x0044a3}
    = props;
    
    let nn = [];
    // let span = 100;
    for (var i = 0; i < count; i++) {
      // let aa = addPlane({width:width,height:height, colorHex:colorHex});
      let _colorHex = colorHex;
      if(colorHex === "random") _colorHex = Math.random() * 0xffffff;
      const aa = new Plane({system:this.system, gl:this.system.gl, width:width,height:height, colorHex:_colorHex});
      this.system.currentGame.sceneGrapth.add(aa);
      aa.position.x = randomInRange(-span, span);
      aa.position.y = randomInRange(-span, span);
      // Spin(aa)
      nn.push(aa);
    }
    return nn;
  }
  
  
  spin(item){
    if (Array.isArray(item)) {
      item.map((y)=>{
        _spin(y);
      })
    }
    else {
      _spin(item);
    }
    return item;
  }
  
  fly(item){
    if (Array.isArray(item)) {
      item.map((y)=>{
        _fly(y);
      })
    }
    else {
      _fly(item);
    }
    return item;
  }
  
}


class Spin_ extends Enty {
  
  // this is still the class for now
  setup(owner){
    // debugger
    // owner.spinExtras = {};
    // owner.spinExtras.startingOffset = Math.random() * Math.PI * 2;
    owner.rotation.y += Math.random() * Math.PI * 2;
  }
  update(){
    // debugger
    // console.log(this.startingOffset);
    // this.rotation.y += 0.01 + this.spinExtras.startingOffset;
    this.rotation.y += 0.1;
  }
}

function _spin(item, speed = 1) {
  let aa = new Spin_("spin");
  item.entities.add(aa);
}






class Fly_ extends Enty {
  
  // this is still the class for now
  setup(owner){
    // debugger
    // owner.spinExtras = {};
    // owner.spinExtras.startingOffset = Math.random() * Math.PI * 2;
    // owner.rotation.y += Math.random() * Math.PI * 2;
    
  }
  update(){
    // debugger
    // console.log(this.startingOffset);
    // this.rotation.y += 0.01 + this.spinExtras.startingOffset;
    // this.rotation.y += 0.1;
    // debugger
    this.position.x += 0.8;
    // this.system.gameWidth
    // not in 2d space
    if(this.position.x > 100){
      this.position.x = -100;
    }
  }
}

function _fly(item, speed = 1) {
  let aa = new Fly_("fly");
  item.entities.add(aa);
}
