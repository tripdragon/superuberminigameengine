



export const loop = function(){
  
  if(this.runtimeState === "play"){
    this.loopID = requestAnimationFrame( this.loop.bind(this) );
  }
  
  this.time.update();
  
  console.log(this.time.now);

}
