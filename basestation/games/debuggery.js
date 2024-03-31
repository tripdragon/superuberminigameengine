
import {Game} from "game";
import {CheapPool} from "utilites/cheapPool.js";
import {ScreenSpace} from "pipelines/screenSpace.js";
// import {CheapPool} from "utilites/cheapPool.js";

import {Plane} from "primitives/plane.js";
import {Color} from "modules/color.js";
import {random3InRange, randomInRange} from "modules/mathness.js";

import {Box3} from "modules/box3.js";
import {Vector3} from "modules/vector3.js";
import {clamp, clampZeroOne, mapLinear} from "modules/mathness.js";

const boxA = new Box3();
const boxB = new Box3();



export class Debuggery extends Game{
  

  // camera = {x:0,y:0,z:0}
  
  groupA = new CheapPool();
  groupDebug = new CheapPool();
  
  constructor(props){
    super({name:"Not Pac 444", ...props});
    // this.scene.backgroundColor.b = 1.0;
    this.scene.backgroundColor.setHex(0xffffff);
    // this needs super reworkn
    this.pipeline = new ScreenSpace({system:this.system,scene:this.scene,gl:this.gl});
    
  }
  
  // start() function
  load(){

    const aa = new Plane({system:this.system, gl:this.gl, width:100,height:100, colorHex:0xfff99ff});
    
    this.sceneGrapth.add(aa);
    // this.groupA.add(aa);
    
    aa.loadImage("./sprites/NFT_NFT_NFT_could_this_becat2.png");
    aa.position.set(-20, 20, -20)
    aa.scale.setScalar(0.1)
    // bb.custom.colorC = new Color().setHex(0xff5c64);
    
    this.system.quickAccess.spin(aa, 0.01);



    const bb = new Plane({system:this.system, gl:this.gl, width:100,height:100, colorHex:0xfff99ff});
    
    this.sceneGrapth.add(bb);
    // this.groupA.add(bb);
    
    bb.loadImage("./sprites/NFT_cash_oranges_bird.png");
    bb.position.set(20, -20, -20)
    bb.scale.setScalar(0.1)
    // bb.custom.colorC = new Color().setHex(0xff5c64);
    
    this.system.quickAccess.spin(bb, 0.01);


    
    
  }


  
}
