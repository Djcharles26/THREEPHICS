import * as THREE from './build/three.module.js';
import {OrbitControls} from './addons/jsm/controls/OrbitControls.js';
import { getRenderer, onWindowResize, onMouseMove, onKeyPress, onKeyRelease, onMousePress, mouse } from './utils.js';
import {
  PLANE,
  PERSPECTIVE_CAMERA,
  RIGHT_CAMERA,
  TOP_CAMERA,
  BOTTOM_CAMERA,
  LEFT_CAMERA,
  FRONT_CAMERA,
  BACK_CAMERA,
  RIGHT, 
  FRONT,
  TOP,
  BOTTOM,
  BACK, 
  PERSPECTIVE
} from './constants.js';

import threeDGeometry from './objects/3DGeometry.js';
import List from './components/List.js';

import camera from './cameras/camera.js';


//variables

var scene;
var raycaster = new THREE.Raycaster();
var objectList = new List();
export var renderer, controls;
var INTERSECTED;
export var CURRENT_CAMERA;
var cube;

init();
function init(){
  renderer = getRenderer();
  //camera =>

  CURRENT_CAMERA = PERSPECTIVE_CAMERA;
  //scene =>
  scene = new THREE.Scene();
  //controls => 
  controls = new OrbitControls( camera[CURRENT_CAMERA], renderer.domElement );
  controls.enableKeys = false;
  controls.enabled = false;
  controls.mouseButtons = {
    LEFT: THREE.MOUSE.ROTATE,
    RIGHT:THREE.MOUSE.DOLLY,
    MIDDLE: THREE.MOUSE.PAN
  };
  //listeners =>
  window.addEventListener('resize', onWindowResize, false );
  window.addEventListener('onwheel' , onMousePress, false);
  window.addEventListener('keydown', onKeyPress, false );
  window.addEventListener('keyup', onKeyRelease, false);
  window.addEventListener("mousemove", onMouseMove, false);
  


  //world construction (Don't touch)
  const world = new THREE.Group();
  //lights => 
  
  
  const light = new THREE.AmbientLight(0xffffff, 0.5);
  world.add(light);
  const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
  light2.position.set(1000,1000,500);
  world.add(light2);


  //plane =>
  var planeObject = new threeDGeometry(PLANE, new THREE.PlaneGeometry(100,100,10, 10),
    new THREE.MeshLambertMaterial({color:0xffff, wireframe:true, transparent: true, opacity: 0.2}), false 
  );
  planeObject.vertex.visible = true;
  planeObject.rotateObject(270 * Math.PI / 180);
 
  //elements
  
  world.add(planeObject.mesh);
  

  scene.add(world);

}
const update = () =>{
  controls = new OrbitControls( camera[CURRENT_CAMERA], renderer.domElement );
  console.log(controls);
  controls.target = new THREE.Vector3(0,0,0);
  controls.enableKeys = false;
  controls.enabled = false;
  if(CURRENT_CAMERA === PERSPECTIVE_CAMERA)
  {
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      RIGHT:THREE.MOUSE.DOLLY,
      MIDDLE: THREE.MOUSE.PAN
    };
  }else{
    controls.mouseButtons = {
      RIGHT:THREE.MOUSE.DOLLY,

    };
  } 

}


window.changeCamera = (point)=>{
  console.log("CAMERA")
  switch(point){
    case TOP:
      CURRENT_CAMERA = TOP_CAMERA;
    break;
    case BOTTOM:
      CURRENT_CAMERA = BOTTOM_CAMERA;
    break;
    case LEFT:
      CURRENT_CAMERA = LEFT_CAMERA;
    break;
    case RIGHT:
      CURRENT_CAMERA = RIGHT_CAMERA;
    break;
    case FRONT:
      CURRENT_CAMERA = FRONT_CAMERA;
    break;
    case BACK:
      CURRENT_CAMERA = BACK_CAMERA;
    break;
    case PERSPECTIVE:
      CURRENT_CAMERA = PERSPECTIVE_CAMERA;
    break;
    default: 
      CURRENT_CAMERA = PERSPECTIVE_CAMERA;
    break;
  }
  update();
}

window.moveX = (positive)=>{
  if(positive){
    camera[CURRENT_CAMERA].position.x += 1;
  }else{
    camera[CURRENT_CAMERA].position.x -= 1;
  }
}



function render() {
  
  raycaster.setFromCamera(mouse, camera[CURRENT_CAMERA]);

  var intersects = raycaster.intersectObjects(scene.children);

  if ( intersects.length > 0  && intersects[ 0 ].object.name !== PLANE) {

    if ( INTERSECTED != intersects[ 0 ].object ) {
      console.log(intersects[0].object);
      INTERSECTED = intersects[ 0 ].object;
      // if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
      
      // INTERSECTED = intersects[ 0 ].object;
      // INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
      // console.log(INTERSECTED);
      // INTERSECTED.material.emissive.setHex( 0xff0000 );
    }

  } else {

    // if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );

    INTERSECTED = null;

  }

  camera[CURRENT_CAMERA].updateProjectionMatrix();
  renderer.render( scene, camera[CURRENT_CAMERA] );
  
  requestAnimationFrame( render );
  controls.update();

}
   
render();
