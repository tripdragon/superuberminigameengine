

/*

starts a main Loop
a game will provide "stuff" for the main Loop
A game will have its own Scene grapth maybe

*/

import {Clock} from "utilites/clock.js";
import {loop as _loop} from "./loop.js";
// import {programInfo} from "./programInfo.js";
// import { World } from "primitives/World.js";

import {Matrix4} from "modules/matrix4.js";

export class BaseStation{
  
  currentGame = null; // shoudl become an array, and this be a get()
  loopID = -1;
  gameTime = 0;
  time = null;
  
  canvas = null;
  gl = null;
  
  // these are here as a basic default shader to get stuff on screen, otherwise
  // each object will have its own for custom shaders
  // might toss this
  // shaderProgram = null; // these are assigned from the loaded game
  // programInfo = null; // these are assigned from the loaded game
  
  // need enum
  runtimeState = "play"; // play pause step?

  // figuring out where to put the projection Matrix and then
  // in the model where to put its com[putation]
  
  projectionMatrix = null;
  
  constructor({name="", canvasId=""}={}){
    this.name = name; 
    if (canvasId !== "") this.canvas = document.getElementById(canvasId);
    if(this.canvas) this.gl = this.canvas.getContext("webgl2");
    // Only continue if WebGL is available and working
    if (this.gl === null) {
      alert(
        "Unable to initialize WebGL. Your browser or machine may not support it guesses."
      );
      return;
    }
    this.bootUp_CM();
  }
  

  unloadDisc(){
    if(this.currentGame){
      this.currentGame.unload();
      this.currentGame = null;
    }
  }
  
  // type of Game
  // this needs to recontruct system construct functions
  // @game : Game reference, in the function we will make an instance
  insertDisc({game}={}){
    if(!game){
      throw new Error('Game is missing!!!');
    }
    if(this.currentGame !== null){
      this.currentGame.unload();
    }
    this.unloadDisc();
    
    // game here is the arguments game reference
    this.currentGame = new game({system:this,gl:this.gl});
    this.currentGame.start(this);
    
    // or change to a Set()
    // this.gamesCatalog[this.currentGame.name] = this.currentGame;
    
  }
  
  bootUp_CM(){
    this.time = new Clock();
    this.startLoop();

    
    this.projectionMatrix = new Matrix4();
    const left = 0;
    const right = this.gameWidth;
    const bottom = this.gameHeight;
    const top = 0;
    const near = 400;
    const far = -400;
    this.projectionMatrix.makeOrthographic(left, right, bottom, top, near, far);
    
  }
  
  
  loop = _loop;
  loopID = 0;
  stopLoop(){
    cancelAnimationFrame(this.loopID);
  }
  startLoop(){
    this.loop.call(this);
  }
  pause(){
    this.runtimeState = "pause";
  }
  
  
  
  // console.warn("this needs to be adjusted");
  // see https://webglfundamentals.org/webgl/lessons/webgl-anti-patterns.html
  // window.innerWidth
  // window.innerHeight roughly...
  get gameWidth(){
    return this.gl.canvas.width;
  }
  get gameHeight(){
    return this.gl.canvas.height;
  }
  
}
