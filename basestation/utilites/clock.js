// MOSTLY based on THREEjs Clock class

export class Clock {

  start(){
    this.millisecondsSinceStarted = 0;
    this.sinceStarted = 0;
    this.m_millisecondsSinceStarted= 0;
    this.sincePaused = 0;
    this.constantRuntime = 0;
    this._delta = 0;
    this.mTime = 0;
    this.now = 0;
    this.update();
  }
  
  update(){
    // const newNow = Date.now();
    const newNow = _now();
    this._delta = (newNow - this.mTime) / 1000;
    // console.log(this._delta);
    this.mTime = newNow;
    // this.now += this._delta;
    this.now = newNow;
    this.sinceStarted += this._delta;
  }
  
  // this MIGHT make things out of sync
  get delta(){
    // this.update();
    return this._delta;
  }
  

  
};


function _now() {
  return ( typeof performance === 'undefined' ? Date : performance ).now(); // see #10732
}
