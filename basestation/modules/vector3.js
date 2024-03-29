
// most from threejs vector3

export class Vector3{
  
  x = 0; y = 0; z = 0;
  
  constructor(x = 0, y = 0, z = 0){
    this.x = x; this.y = y; this.z = z;
  }
  // 
  // copy(vector){
  // 
  // }
  
  print(){
    console.log("v", this.x, this.y, this.z);
  }
  
  toString(){
    return `x: ${this.x}, y: ${this.y}, z: ${this.z}`;
  }
  
  set(x,y,z){
    this.x = x; this.y = y; this.z = z;
  }
  
  setScalar(val){
    this.x = this.y = this.z = val;
  }
  
  
  clear(){
    this.x = 0; this.y = 0; this.z = 0;
  }
  
  add(v){
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }
  
  sub(v){
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
  }
  
  addScalar(val){
    this.x += val;
    this.y += val;
    this.z += val;
    return this;
  }
  
  multiplyScalar(val){
    this.x *= val;
    this.y *= val;
    this.z *= val;
    return this;
  }
  
  divideScalar(val){
    this.x /= val;
    this.y /= val;
    this.z /= val;
    return this;
  }
  
  equals( v ) {

		return ( ( v.x === this.x ) && ( v.y === this.y ) && ( v.z === this.z ) );

	}
  
  
	lengthSq() {
    return this.magnitudeSq();
  }
  
	magnitudeSq() {

		return this.x * this.x + this.y * this.y + this.z * this.z;

	}

	length() {
    return this.magnitude();
  }
  
	magnitude() {

		return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );

	}
  
  normalize() {

    return this.divideScalar( this.magnitude() || 1 );

  }
  
  equals( v ) {

    return ( ( v.x === this.x ) && ( v.y === this.y ) && ( v.z === this.z ) );

  }
  
  
	lerp( v, alpha ) {

		this.x += ( v.x - this.x ) * alpha;
		this.y += ( v.y - this.y ) * alpha;
		this.z += ( v.z - this.z ) * alpha;

		return this;

	}

	lerpVectors( v1, v2, alpha ) {

		this.x = v1.x + ( v2.x - v1.x ) * alpha;
		this.y = v1.y + ( v2.y - v1.y ) * alpha;
		this.z = v1.z + ( v2.z - v1.z ) * alpha;

		return this;

	}
  
  // https://discussions.unity.com/t/inverselerp-for-vector3/177038
  // 
  // const ab = {x:0,y:0,z:0};
  // const av = {x:0,y:0,z:0};
  // const rr = {x:0,y:0,z:0};
  // inverseLerp(a, b, v)
  // {
  //     // Vector3 AB = b - a;
  //     ab.x = b.x - a.x;
  //     ab.y = b.y - a.y;
  //     ab.z = b.z - a.z;
  // 
  // 
  //     // Vector3 AV = value - a;
  //     av.x = v.x - a.x;
  //     av.y = v.y - a.y;
  //     av.z = v.z - a.z;
  // 
  //     const d0 = this.dotVectors(av,ab);
  //     const d1 = this.dotVectors(ab,av);
  // 
  //     return Vector3.Dot(AV, AB) / Vector3.Dot(AB, AB);
  // }
  
  dot( v ) {
		return this.x * v.x + this.y * v.y + this.z * v.z;
	}
  
  dotVectors( v0, v1 ) {
		return v0.x * v1.x + v0.y * v1.y + v0.z * v1.z;
	}
  
  subVectors( a, b ) {
		this.x = a.x - b.x;
		this.y = a.y - b.y;
		this.z = a.z - b.z;
		return this;
	}

  crossVectors( a, b ) {
		const ax = a.x, ay = a.y, az = a.z;
		const bx = b.x, by = b.y, bz = b.z;
		this.x = ay * bz - az * by;
		this.y = az * bx - ax * bz;
		this.z = ax * by - ay * bx;
		return this;
	}
  
  negate() {

		this.x = - this.x;
		this.y = - this.y;
		this.z = - this.z;

		return this;

	}
  
  copy(v){
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
  }
  
  clone(){
    return new this.constructor().copy(this);
  }
  
  
  
  applyMatrix4( m ) {

		const x = this.x, y = this.y, z = this.z;
		const e = m.elements;

		const w = 1 / ( e[ 3 ] * x + e[ 7 ] * y + e[ 11 ] * z + e[ 15 ] );

		this.x = ( e[ 0 ] * x + e[ 4 ] * y + e[ 8 ] * z + e[ 12 ] ) * w;
		this.y = ( e[ 1 ] * x + e[ 5 ] * y + e[ 9 ] * z + e[ 13 ] ) * w;
		this.z = ( e[ 2 ] * x + e[ 6 ] * y + e[ 10 ] * z + e[ 14 ] ) * w;

		return this;

	}
  
  
	toArray( array = [], offset = 0 ) {

		array[ offset ] = this.x;
		array[ offset + 1 ] = this.y;
		array[ offset + 2 ] = this.z;

		return array;

	}
  
  fromArray(val){
    this.x = val[0];
    this.y = val[1];
    this.z = val[2];
    return this;
  }
  
  
  
	distanceTo( v ) {

		return Math.sqrt( this.distanceToSquared( v ) );

	}

	distanceToSquared( v ) {

		const dx = this.x - v.x, dy = this.y - v.y, dz = this.z - v.z;

		return dx * dx + dy * dy + dz * dz;

	}
  
  min( v ) {
		this.x = Math.min( this.x, v.x );
		this.y = Math.min( this.y, v.y );
		return this;
	}

	max( v ) {
		this.x = Math.max( this.x, v.x );
		this.y = Math.max( this.y, v.y );
		this.z = Math.max( this.z, v.z );
		return this;
	}
  
}
