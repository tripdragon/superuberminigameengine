


// most from threejs vector2

export class Vector2{
  
  x = 0; y = 0;
  
  constructor(x = 0, y = 0){
    this.x = x; this.y = y;
  }
  
  set(x,y){
    this.x = x;
    this.y = y;
    return this;
  }
  
  min( v ) {
		this.x = Math.min( this.x, v.x );
		this.y = Math.min( this.y, v.y );
		return this;
	}

	max( v ) {
		this.x = Math.max( this.x, v.x );
		this.y = Math.max( this.y, v.y );
		return this;
	}
  
}
