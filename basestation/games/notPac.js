
import {Game} from "game";
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



export class NotPac extends Game{
  

  // camera = {x:0,y:0,z:0}
  
  constructor(props){
    super({name:"Not Pac 444", ...props});
    // this.scene.backgroundColor.b = 1.0;
    this.scene.backgroundColor.setHex(0xffffff);
    // this needs super reworkn
    this.pipeline = new ScreenSpace({system:this.system,scene:this.scene,gl:this.gl});
    
  }
  
  // start() function
  load(){
    // https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event
    document.addEventListener("keydown", keys);
    // shoudl not have to give its system right here
    const aa = new Plane({system:this.system, gl:this.gl, width:100,height:100, colorHex:0xe4ff5c});
    aa.rotation.y = 0.2;
    // this.sceneGrapth.add(aa);
    
    const bb = new Plane({system:this.system, gl:this.gl, width:100,height:100, colorHex:0x0044a3});
    bb.rotation.y = -0.2;
    // this.sceneGrapth.add(bb);
    
    for (var i = 0; i < 122; i++) {
      
      const bb = new Plane({system:this.system, gl:this.gl, width:100,height:100, colorHex:0xffffff*Math.random()});
      // bb.rotation.y = -0.2;
      bb.scale.setScalar(randomInRange(0.05,0.1))
      // bb.position.fromArray(random3InRange(-200,200));
      let yy = this.system.gameWidth/8;
      console.log(yy);
      bb.position.x = randomInRange(-yy,yy);
      bb.position.y = randomInRange(-yy,yy);
      bb.position.z = randomInRange(-yy,yy);
      
      this.sceneGrapth.add(bb);
      
      bb.custom.mColor = bb.material.color.clone();
      bb.custom.isFlipped = false;
      bb.custom.crossfadeAlpha = 0;
      bb.custom.colorA = new Color().setHex(0x6f5cff);
      bb.custom.colorB = new Color().setHex(0xffef5c);
      bb.custom.colorC = new Color().setHex(0xff5c64);
      
      bb.custom.basePos = null;
      bb.custom.p0 = new Vector3();
      bb.custom.p1 = new Vector3();
      bb.custom.startingSpeedScalar = 0;
      bb.custom.startingAlpha = 0;
      bb.custom.yy = -1;
    }
    
  }
  unload(){
    document.removeEventListener("keydown", keys);
  }
  
  
  // basePos = null;

  workV = new Vector3();
  
  
  
  beforeDraw(){
    
    const wobjects = this.sceneGrapth.objects;
    
    // first part moves the objects, this could go into an ecs thingy
    // console.log("nn", this.system.time.now);
    for (var i = 0; i < wobjects.length; i++) {
      
      let gg = wobjects[i];
      
      let yy = gg.custom.yy;
      
      if(yy === -1){
        yy = this.system.gameWidth/8;
      }
      
      if(gg.custom.basePos === null){
        gg.custom.basePos = gg.position.clone();
        let basePos = gg.custom.basePos;
        const _s = 0.5;
        gg.custom.p0.copy(basePos).multiplyScalar(1.1).negate();
        gg.custom.p1.copy(basePos).multiplyScalar(1.1);
        gg.custom.startingSpeedScalar = randomInRange(0,0.5);
        // inverseLerp
        
      }
      
      // console.log("¿");
      
      // bb.scale.setScalar(randomInRange(0.05,0.1))
      // bb.position.fromArray(random3InRange(-200,200));
      // console.log(yy);
      // this.position.x += randomInRange(-yy,yy)
      // this.position.y = randomInRange(-yy,yy);
      // this.position.z = randomInRange(-yy,yy);
      
      // this.position.x = this.workV.lerpVectors(this.p0,this.p1, Math.abs(Math.cos(this.position.x))).x;
      let _s = gg.custom.startingSpeedScalar;
      let p0 = gg.custom.p0;
      let p1 = gg.custom.p1;
      // this.position.copy( this.workV.lerpVectors(this.p0,this.p1, Math.cos(this.system.time.now*0.001+_s)) );
      gg.position.x = this.workV.lerpVectors(p0,p1, Math.cos(this.system.time.now*0.001+_s)*__dats.speed ).x;
      gg.position.y = this.workV.lerpVectors(p0,p1, Math.cos(this.system.time.now*0.002+_s)*__dats.speed ).y;
      gg.position.z = this.workV.lerpVectors(p0,p1, Math.cos(this.system.time.now*0.003+_s)*__dats.speed ).z;
      
    }
    
    
    // second part, we are doing a Baaaaaasic floor collision test to change the colors
    // mainGameUpdate();
    // this is the slowest form of collision detection
    
    
    // console.log(this.system.time.delta);
    
    for (var i = 0; i < wobjects.length; i++) {
      // _m.baseStation.currentGame.sceneGrapth.objects[0].boundingBox.max
      // console.log("¿¿???", i);
      // refreshMatrixes
      // wobjects[i].setColorHex(0x6c5cff)
      // wobjects[i].setColorHex(Math.random()*0xffffff)
      
      let gg = wobjects[i];
      let pp = 1;
      let span = 100;
      if (gg.position.y < 0) {
        // wobjects[i].setColorHex(0x6c5cff);
        // wobjects[i].custom.isFlipped = true;
        // pp = 1;
        
        let alpha = mapLinear(gg.position.y, 0,-span, 0,1)
        // console.log("alpha", gg.custom.crossfadeAlpha, alpha);
        gg.material.color.lerpColors(gg.custom.colorA, gg.custom.colorB, alpha);
        gg.setColorRGB(gg.material.color);
        
      }
      else if (gg.position.y > 0) {
        // let alpha = clampZeroOne(gg.custom.crossfadeAlpha += this.system.time.delta * 0.2);
        // gg.material.color.lerpColors(gg.custom.colorA, gg.custom.colorB, alpha);
        // gg.setColorRGB(gg.material.color);
        // // wobjects[i].custom.isFlipped = false;
        // pp = -1;
        let alpha = mapLinear(gg.position.y, 0,span, 0,1)
        // console.log("alpha", gg.custom.crossfadeAlpha, alpha);
        gg.material.color.lerpColors(gg.custom.colorA, gg.custom.colorC, alpha);
        gg.setColorRGB(gg.material.color);
      }
      
      
      // let alpha = clampZeroOne(gg.custom.crossfadeAlpha += this.system.time.delta * 4000 * pp);
      // // console.log("alpha", gg.custom.crossfadeAlpha, alpha);
      // gg.material.color.lerpColors(gg.custom.colorA, gg.custom.colorB, alpha);
      // gg.setColorRGB(gg.material.color);
      
    }
    
  }

  drawFrame(){
    
    // Can move this logic into each object as an ecs
    
    const wobjects = this.sceneGrapth.objects;
    
    super.drawFrame();
    
  }
  
  
}

// 
// function mainGameUpdate() {
//   // console.log("super not paci 222b!!");
// }

function keys(ev) {
  
    console.log(ev.key);
    console.log("????¿¿");
    // if (event.key === "z") {
    // }
  
}
