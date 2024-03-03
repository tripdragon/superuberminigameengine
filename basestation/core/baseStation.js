

/*

starts a main Loop
a game will provide "stuff" for the main Loop
A game will have its own Scene grapth maybe

*/

import {Clock} from "utilites/clock.js";
import {loop as _loop} from "./loop.js";

export class BaseStation{
  
  currentGame = null;
  loopID = -1;
  gameTime = 0;
  time = null;
  
  // need enum
  runtimeState = "play"; // play pause step?
  
  constructor({name="", canvasId=""}={}){
    this.name = name;
    if (canvasId !== "") this.canvas = document.getElementById(canvasId);
    this.bootUp_CM();
  }
  

  unloadDisc(){}
  
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

    this.currentGame = new game();
    this.currentGame.start(this);
    
    // or change to a Set()
    // this.gamesCatalog[this.currentGame.name] = this.currentGame;
    
  }
  
  bootUp_CM(){
    this.time = new Clock();
    this.startLoop();
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
  
}