

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
  layers = {
    main: [],
    colliders : [], // if it collides you can then deicde if it was just a trigger
    platforms : [], // plane objects
    // triggers : []
  }
  
  // need to add compare istype etc
  add(thingy){
    // debugger
    // need to compare if is already added
    if(thingy.isQuark){
      
      this.objects.push(thingy);
      
      if(!thingy.system){
      }
      thingy.system = this.system;
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
  
}
