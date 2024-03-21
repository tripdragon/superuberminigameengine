

export class CheapPool extends Array{
  add(item){
    this.push(item);
  }
  remove(item){
    // console.log("not ready");
    
    var index = this.indexOf(item);
    if(index > -1){
      this.splice(index,1);
    }
    
  }
}
