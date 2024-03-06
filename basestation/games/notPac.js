
import {Game} from "game";
import {ScreenSpace} from "pipelines/screenSpace.js";
// import {CheapPool} from "utilites/cheapPool.js";

import {Plane} from "primitives/plane.js";

export class NotPac extends Game{
  

  camera = {x:0,y:0,z:0}
  
  constructor(props){
    super({name:"Not Pac 444", ...props});
    // debugger
    this.scene.backgroundColor.b = 1.0;
    this.scene.backgroundColor.g = 0.4;
    // this needs super reworkn
    this.pipeline = new ScreenSpace({system:this.system,scene:this.scene,gl:this.gl});
    // this.shaderProgram = this.system.shaderProgram;
    // this.programInfo = this.system.programInfo;
    
  }
  
  // start() function
  load(){
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event
    document.addEventListener("keydown", keys);
    // shoudl not have to give its system right here
    this.sceneGrapth.add(new Plane({system:this.system, gl:this.gl, width:100,height:100}));
  }
  unload(){
    document.removeEventListener("keydown", keys);
  }
  
  beforeDraw(){
    mainGameUpdate();
  }
  drawFrame(){
    this.pipeline.drawFrame({sceneGrapth:this.sceneGrapth,camera:this.camera});
    // console.log("222222™222");
  }
}


function mainGameUpdate() {
  console.log("super not paci 222b!!");
}

function keys(ev) {
  
    console.log(ev.key);
    console.log("????¿¿");
    // if (event.key === "z") {
    // }
  
}
