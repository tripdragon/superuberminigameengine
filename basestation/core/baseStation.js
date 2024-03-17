

/*

starts a main Loop
a game will provide "stuff" for the main Loop
A game will have its own Scene grapth maybe

*/

import {Clock} from "utilites/clock.js";
import {loop as _loop} from "./loop.js";
import {PerspectiveCamera,OrthographicCamera} from "primitives/camera.js";
// import {programInfo} from "./programInfo.js";
// import { World } from "primitives/World.js";

// import {Matrix4} from "modules/matrix4.js";

// for quickAccess {}
// import {Vector3} from "modules/vector3.js";
// import {Plane} from "primitives/plane.js";
// import {Plane} from "primitives/plane.js";
import {QuickAccess} from "./quickAccess.js";


export class BaseStation{
  
  currentGame = null; // shoudl become an array, and this be a get()
  loopID = -1;
  gameTime = 0;
  time = null;
  
  canvas = null;
  gl = null;
  
  // placeholder cameras to just render stuff, otherwise change in per game file
  currentCamera = null;
  perspectiveCamera;
  orthographicCamera = null;
  
  // these are here as a basic default shader to get stuff on screen, otherwise
  // each object will have its own for custom shaders
  // might toss this
  // shaderProgram = null; // these are assigned from the loaded game
  // programInfo = null; // these are assigned from the loaded game
  
  // need enum
  runtimeState = "play"; // play pause step?

  // figuring out where to put the projection Matrix and then
  // in the model where to put its com[putation]
  
  // projectionMatrix = null;
  
  // // for window level commands
  quickAccess = null;

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
    this.quickAccess = new QuickAccess(this);
  }
  

  unloadDisc(){
    if(this.currentGame){
      this.currentGame.unload();
      // we need to draw once again before this can clear the view
      // so need to change the loop
      // this.currentGame = null;
      this.clearScreen();
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
    this.currentGame = new game({system:this, gl:this.gl});
    this.currentGame.start(this);
    
    // or change to a Set()
    // this.gamesCatalog[this.currentGame.name] = this.currentGame;
    
  }
  
  bootUp_CM(){
    this.time = new Clock();
    this.startLoop();
    
    this.perspectiveCamera = new PerspectiveCamera(35,this.gameWidth/this.gameHeight,0.01,1000);
    this.orthographicCamera = new OrthographicCamera(0,this.gl.canvas.clientWidth, 0, this.gl.canvas.clientHeight,400,-400);
    this.swapCamera('p');

  }
  
  // we do this so its simply this.system.camera.projectionMatrix
  get camera(){
    return this.currentCamera;
  }
  // o , p, ortho, perspective
  swapCamera(type){
    if (type === "p") {
      this.currentCamera = this.perspectiveCamera;
    }
    else if(type === "o"){
      this.currentCamera = this.orthographicCamera;
    }
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
    return this.gl.canvas.clientWidth;
  }
  get gameHeight(){
    return this.gl.canvas.clientHeight;
  }
  
  clearScreen(){
    const gl = this.gl;
    gl.clearColor(0,0,1,0);
    gl.clearDepth(1.0); // Clear everything
    gl.disable(gl.DEPTH_TEST); // Enable depth testing
    // gl.viewport(0, 0, this.gameWidth, this.gameHeight);
    gl.viewport(0, 0, this.gameWidth, this.gameHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  }
  
  
  

  
}
