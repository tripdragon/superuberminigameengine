
import {Game} from "game";
import {ScreenSpace} from "pipelines/screenSpace.js";
// import {CheapPool} from "utilites/cheapPool.js";

export class NotPac extends Game{
  
  // sceneGrapth = new CheapPool();
  sceneGrapth = {
    objects: []
  }
  camera = {x:0,y:0,z:0}
  
  constructor(props){
    super({name:"Not Pac 444", ...props});
    this.pipeline = new ScreenSpace({system:this.system,scene:this.scene,gl:this.gl});
  }
  
  load(){
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event
    document.addEventListener("keydown", keys);
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
