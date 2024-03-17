

class CacheLayers{
  main = [];
  colliders = []; // if it collides you can then deicde if it was just a trigger
  platforms = []; // plane objects
}

export class SceneGrapth{

  
  system = null;
  
  constructor(system){
    this.system = system;
  }
  
  lv = 1;
  
  // this should be a "Group class"
  objects = [];
  actors = [];
  
  // 
  // layers = {
  //   main: [],
  //   colliders : [], // if it collides you can then deicde if it was just a trigger
  //   platforms : [], // plane objects
  //   // triggers : []
  // }
  layers = new CacheLayers();
  
  // need to add compare istype etc
  add(thingy){
    // debugger
    // need to compare if is already added
    if(thingy.isQuark){
      
      this.objects.push(thingy);
      
      if(!thingy.system){
      }
      thingy.system = this.system;
      thingy.sceneGrapth = this;
      
      // debugger
      
      if(thingy.canCollide){
        this.layers.colliders.push(thingy);
      }
      
      if( thingy.canCollide && thingy.subType === "platform"){
        this.layers.platforms.push(thingy);
      }
      
    }
  }
  
  remove(thingy){
    if(thingy.isQuark){
      
      var index = this.objects.indexOf(thingy);
      if (index > -1) {
        this.objects.splice(index,1);
      }
      // colliders
      index = this.layers.colliders.indexOf(thingy);
      if (index > -1) {
        this.layers.colliders.splice(index,1);
      }
      
    }
  }
  
  // this removes all objects in scene and resets
  reset(){
    // need to dup the array cause the objects themselves mutate the scenegrapth
    // could fix that
    const _objects = this.objects.slice();
    for (var i = 0; i < _objects.length; i++) {
      _objects[i].delete();
    }
    this.objects.length = 0;
    this.actors.length = 0;
    this.layers = new CacheLayers();
  }
  
}
