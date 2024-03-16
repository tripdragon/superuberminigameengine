

export class Color{
    
  r = 0;
  g = 0;
  b = 0;
  hex = 0;
  
  // constructor(){}
  
  setRGB(r,g,b){
    this.r = r; this.g = g; this.b = b;
    // getHex()
  }
  
  
  
  // snipped from https://github.com/mrdoob/three.js/blob/master/src/math/Color.js
  // minus the color space conversions
  setHex( hex ) {

		hex = Math.floor( hex );
    this.hex = hex;

		this.r = ( hex >> 16 & 255 ) / 255;
		this.g = ( hex >> 8 & 255 ) / 255;
		this.b = ( hex & 255 ) / 255;

		return this;

	}
  equals(color){
    return this.hex === color.hex;
  }
  
  copy(cc){
    this.r = cc.r;
    this.g = cc.g;
    this.b = cc.b;
    this.hex = cc.hex;
    return this;
  }
  clone(){
    return new this.constructor().copy(this);
  }
  
  // https://github.com/mrdoob/three.js/blob/ef80ac74e6716a50104a57d8add6c8a950bff8d7/src/math/Color.js#L509C1-L527C3
  lerp( color, alpha ) {
		this.r += ( color.r - this.r ) * alpha;
		this.g += ( color.g - this.g ) * alpha;
		this.b += ( color.b - this.b ) * alpha;
		return this;
	}

	lerpColors( color1, color2, alpha ) {
		this.r = color1.r + ( color2.r - color1.r ) * alpha;
		this.g = color1.g + ( color2.g - color1.g ) * alpha;
		this.b = color1.b + ( color2.b - color1.b ) * alpha;
		return this;
	}
  
  // getHex() {
  // 
	// 	return Math.round( clamp( _color.r * 255, 0, 255 ) ) * 65536 + Math.round( clamp( _color.g * 255, 0, 255 ) ) * 256 + Math.round( clamp( _color.b * 255, 0, 255 ) );
  // 
	// }
  
}
