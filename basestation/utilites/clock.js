// MOSTLY based on THREEjs Clock class

export class Clock {
  millisecondsSinceStarted = 0;
  sinceStarted = 0;
  m_millisecondsSinceStarted= 0;
  sincePaused = 0;
  constantRuntime = 0;
  delta = 0;
  mTime = 0;
  now = 0;
  
  
  update(){
    this.now = Date.now();
    this.delta = this.now - this.mTime;
  }
  
};
