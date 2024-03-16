

// import {Quark} from "./quark.js";
import {Mesh} from "./mesh.js";

import {Vector3} from "modules/vector3.js";
import {Matrix4} from "modules/matrix4.js";

import {buildProgramInfo} from "gl/programInfo.js";
import {initShaderProgramFlatShader} from "gl/shaders.js";

import {random3InRange, randomInRange, inverseLerp} from "modules/mathness.js";

export class Plane extends Mesh {
    
    isPlane = true;
    
    // buffer array
    // reset in constructor
    // __ positions = new Float64Array(18); // 3*3*2 //positions = [];
    pointsCount = 6; // two tris
    
    // points
    // local space
    // counter clockwise
    // +0   +3
    // +1   +2
    // the points of the geometry not the buffer positions
    // buffer has 6 points has 4 length
    // HOWEVER this could be transformed to a BufferArray and access as [index+n(1,2,3)]
    // which is annoying, but faster?¿
    points = [new Vector3(-1,1,0),new Vector3(-1,-1,0),new Vector3(1,-1,0),new Vector3(1,1,0)];
    // these dont mutate
    basepoints = [new Vector3(-1,1,0),new Vector3(-1,-1,0),new Vector3(1,-1,0),new Vector3(1,1,0)];
    
    // shaderProgram = null;
    // programInfo = null;
    
    
    constructor({name="plane",...props}={}){
      super({name:name,...props});
      
      const {
        width = 1,
        height = 1,
        // color,
      } = props;
      
      this.positions = new Float64Array(18); // 3*3*2 //positions = [];

      // this.recomputeSides();
      // plane has no origin persay
      // its geometry is offset to handle this by default
      // thus we have to calculate and prebake positions
      // this.centerPositions();
      this.setSize(width,height);
      // this.computeBoundingBoxes();
      
      // if(color){
      //   this.material?.setHex(color);
      // }
      
      //// this.computeBoundingBoxPadding();
      //// this.startTexture();
      //// this.initGLStuff();
      
      // this.position.z = 10
      // debugger
      this.glInit();
      
      // _m.baseStation.currentGame.sceneGrapth.objects[0].boundingBox2D
      // in mesh, with boundingBox2D being on quark
      this.computeBoundingBox();
      
    }
    
    setSize(width,height){
      const ww = width / 2;
      const hh = height / 2;
      const points = this.points;
      const bb = this.basepoints;
      
      points[0].x = bb[0].x * ww; points[0].y = bb[0].y * hh; points[0].z = 0;
      points[1].x = bb[1].x * ww; points[1].y = bb[1].y * hh; points[1].z = 0;
      points[2].x = bb[2].x * ww; points[2].y = bb[2].y * hh; points[2].z = 0;
      points[3].x = bb[3].x * ww; points[3].y = bb[3].y * hh; points[3].z = 0;

      this.updatePositions();
      
    }

    // updates the buffer positions from the 4 points logics
    updatePositions(){
      var positions = this.positions;
      var points = this.points;
      // gurgle
      
      positions[0] = points[0].x; positions[1] = points[0].y; positions[2] = 0;
      positions[3] = points[1].x; positions[4] = points[1].y; positions[5] = 0;
      positions[6] = points[2].x; positions[7] = points[2].y; positions[8] = 0;
      // tri 2
      positions[9] = points[2].x; positions[10] = points[2].y; positions[11] = 0;
      positions[12] = points[3].x; positions[13] = points[3].y; positions[14] = 0;
      positions[15] = points[0].x; positions[16] = points[0].y; positions[17] = 0;
      
    }

    // use ecs system
    // 
    // update(){
    // 
    // }


}
