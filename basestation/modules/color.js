

export class Color{
    
  r = 0;
  g = 0;
  b = 0;
  
  // snipped from https://github.com/mrdoob/three.js/blob/master/src/math/Color.js
  // minus the color space conversions
  setHex( hex ) {

		hex = Math.floor( hex );

		this.r = ( hex >> 16 & 255 ) / 255;
		this.g = ( hex >> 8 & 255 ) / 255;
		this.b = ( hex & 255 ) / 255;

		return this;

	}
  
}
