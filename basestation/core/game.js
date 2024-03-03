


export class Game{
  constructor({name=""}={}){
    this.name = name;
  }
  start(){
    console.log(`${this.name} start!!`);
  }
  update(){}
}
