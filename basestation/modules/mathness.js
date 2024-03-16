
// various, some from threejs MathUtils.js

export function clamp(x,min,max){
  return Math.min(Math.max(x,min),max);
}

export function clampZeroOne(x){
  return Math.min(Math.max(x,0),1);
}


export function radToDegree(rad) { return rad * 180 / Math.PI };
export function degreeToRad(angle) { return angle * Math.PI / 180 };

export function randomInRange(start, end) {
  var range = end - start;
  var result = Math.random() * range;
  result += start;
  // return Math.round(result);
  return result;
}

export function randomFromArr(arr) {

  return arr[Math.floor(Math.random() * arr.length)];
}

export function random3InRange(start, end) {

  return [
    randomInRange(start, end),
    randomInRange(start, end),
    randomInRange(start, end)
  ]
}

// https://www.gamedev.net/tutorials/programming/general-and-gameplay-programming/inverse-lerp-a-super-useful-yet-often-overlooked-function-r5230/
export function inverseLerp( x, y, value ) {
	if ( x !== y ) {
		return ( value - x ) / ( y - x );
	} else {
		return 0;
	}
}

// https://en.wikipedia.org/wiki/Linear_interpolation
export function lerp( x, y, t ) {
	return ( 1 - t ) * x + t * y;
}

// Linear mapping from range <a1, a2> to range <b1, b2>
export function mapLinear( x, a1, a2, b1, b2 ) {
	return b1 + ( x - a1 ) * ( b2 - b1 ) / ( a2 - a1 );
}
