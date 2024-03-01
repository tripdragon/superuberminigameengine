

export class BaseStation{
  
  currentGame = null;
  
  constructor({name="", canvasId=""}={}){
    this.name = name;
    if (canvasId !== "") this.canvas = document.getElementById(canvasId);
    
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
  
  
}
