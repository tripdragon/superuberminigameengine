
/*
Each game desides on its screenspace
of that being 2d or 3d, default...
which is just coords, but is also shaders and pipeline
so Pipeline actually desides this
Something has to be top level
In the intrest of rendering multiple games
Are we using multiple canvas elements?
Or draw spaces on a polygon???? Which is a texture...

abstraction gets fiddly

If System owns the screenspace then it gets rigid
gl. is what gets the direct shaders though no matter what and thats owned by canvas

So Game hands System the pipeline and then updates as needed



*/

import {Scene} from './scene.js';
import {SceneGrapth} from './sceneGrapth.js';

export class Game{
  pipelineType = null;
  pipeline = null;
  gl = null;
  scene = null;
  system;
  // shaderProgram = null;
  // programInfo = null;
  sceneGrapth = null;
  constructor(props){
    // debugger
    const {
      name = "",
      system = null,
      gl = null,
      // programInfo = null
    } = props;
    this.name = name;
    this.system = system;
    this.gl = gl;
    // this.app = app;
    // this.programInfo = programInfo;
    this.scene = new Scene();
    this.sceneGrapth = new SceneGrapth(this.system);
  }
  start({system}={}){
    if(system) this.system = system;
    console.log(`${this.name} start!!`);
    this.load();
  }
  load(){}
  unload(){}
  // not as simple at unity, we need to do stuff before drawing
  // and we dont yet have physics states etc, so naming
  // will reflect procedural steps in GL
  // update(){
  //   console.log("im a game!!");
  // }
  
  beforeDraw(){
    console.log("im a game before draw!!");
  }
  
  // drawScene(){}
  drawFrame(){}
  
}

// export function attachPipeline({game, pipeline}){
//   game.drawFrame = new pipeline();
// }
