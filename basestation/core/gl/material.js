

import {Color} from "modules/color.js";

import {buildProgramInfo} from "gl/programInfo.js";
import {initShaderProgramFlatShader} from "gl/shaders.js";

export class Material{
  
  gl;
  color = new Color();
  // mColor = new Color();
  shaderProgram;
  programInfo;
  opacity = 1;
  
  constructor({gl,color=0xffffff}={}){
    this.gl = gl;
    
    this.shaderProgram = initShaderProgramFlatShader(gl);
    if(this.shaderProgram){
      this.programInfo = buildProgramInfo({gl:gl,shaderProgram:this.shaderProgram,screenMode:"2d"});
    }
    
    this.color.setHex(color);
    // this.mColor.setHex(color);
  }
  setHex(val){
    this.color.setHex(val);
  }
  
  
  
  
  
}
