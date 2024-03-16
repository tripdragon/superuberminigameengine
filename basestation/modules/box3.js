

/*

debug within


plat = box4;
plat.boundingBox.print()

point = {x:0,y:0}
point.x = plat.boundingBox.min.x;
point.y = plat.boundingBox.max.y;

if(box){
box.delete()
box = null;
}
var box = new Plane("boxlike", point.x, point.y, 0, 10, 10, new Color().random());
APPPP.add(box);

pointInBoundingBoxScreenSpace(point, plat)

*/


// this is a merger of Box2 and Box3
// as the start of all things is 2dish but would just like to have z in already


// most of this will be copied from THREE.js
import { Vector2 } from "./vector2.js";
import { Vector3 } from "./vector3.js";
import { AABBTestScreenSpace, AABBTest3D, AABBTestScreenSpace222BackToTopYYY } from "./collisions2D.js";


const v3a = new Vector3();

export class Box3{
  
  min = new Vector2(- Infinity, - Infinity, - Infinity);
  max = new Vector2(Infinity, Infinity, Infinity);
  
  AABBTestScreenSpace(box){
    return AABBTestScreenSpace222BackToTopYYY(this,box);
  }
  
  intersectsBox2( box ) {
		// using 4 splitting planes to rule out intersections
		return box.max.x < this.min.x || box.min.x > this.max.x ||
			box.max.y < this.min.y || box.min.y > this.max.y ? false : true;
	}
  // and
  // containsBox( box ) {
  // 
	// 	return this.min.x <= box.min.x && box.max.x <= this.max.x &&
	// 		this.min.y <= box.min.y && box.max.y <= this.max.y;
  // 
	// }
  
  AABBTest3D(object){
    return AABBTest3D(this,object);
  }
  
  clear(){
    this.min.clear();
    this.max.clear();
    return this;
  }
  
  containsPoint2D( point ) {
		return point.x < this.min.x || point.x > this.max.x ||
			point.y < this.min.y || point.y > this.max.y ? false : true;
	}
  
  copy(box){
    this.min.copy(box.min);
    this.max.copy(box.max);
    return this;
  }
  
  clone(){
    return new constructor().copy(this);
  }
  
  // this is a SPECIAL case for screenSpace
  addPaddingScreenSpace(val){
    this.min.x += -val;
    this.min.y += val;    
    this.max.x += val;
    this.max.y += -val;
    return this;
  }

  applyMatrix4( matrix ) {

		// transform of empty box is an empty box.
		// if ( this.isEmpty() ) return this;
    
    this.min.applyMatrix4(matrix);
    this.max.applyMatrix4(matrix);
    
		return this;

	}
  
  print(){

    console.log("min",this.min.toString());
    console.log("max",this.max.toString());
    
  }
  
  // it flips the values
  makeEmpty() {
		this.min.x = this.min.y = this.min.z = + Infinity;
		this.max.x = this.max.y = this.max.z = - Infinity;
		return this;
	}

  // this is not in threejs but its derived from the logic in box3
  // its also in local space
  
  setFromObject(wobject){
    if( ! wobject.positions ){
      console.log("wobject does not have positions array");
      return;
    }
    this.makeEmpty();
    wobject.updateWorldMatrix(false);
    const size = 3;
    for (var i = 0; i < wobject.positions.length/3; i++) {
      // positions are floats
      let a = wobject.positions[i*size];
      let b = wobject.positions[i*size+1];
      let c = wobject.positions[i*size+2];
      // console.log(a,b,c);
      v3a.set(a,b,c);
      this.expandByPoint(v3a);
    }
    // fix the z for 2d since they are inversed
    if(this.min.z === Infinity) this.min.z = 0;
    if(this.max.z === -Infinity) this.max.z = 0;
    return this;
  }
  
  expandByPoint(point){
    this.min.min(point);
    this.max.max(point);
    return this;
  }
  

  // this was to print points in counter clockwise
  // print(){
  //   console.log(this.min.x, this.max.y, "____", this.max.x, this.max.y);
  //   console.log(this.min.x, this.min.y, "____", this.max.x, this.min.y);
  // }
  
}
