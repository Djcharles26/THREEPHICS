import * as THREE from './build/three.module.js';
import {OrbitControls} from './addons/jsm/controls/OrbitControls.js';
import { 
  getRenderer,
  onWindowResize, 
  onMouseMove, 
  onKeyPress, 
  onKeyRelease, 
  onMousePress, 
  onMouseClick, 
  mouse
} from './utils/utils.js';
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
} from './utils/constants.js';
import threeDGeometry from './Components/3DGeometry.js';
import camera from './utils/camera.js';
import { GUI }from './addons/jsm/libs/dat.gui.module.js';

//variables

export var renderer, controls;
var scene;
var raycaster = new THREE.Raycaster();
var objectList = new Map();
export var INTERSECTED;
export var CURRENT_CAMERA;
var i;
const initialSizes = 10;

init();
function init(){
  i = 0;
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
  window.addEventListener("mouseup", onMouseClick, false );


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


  console.log(planeObject.mesh.rotation)
  world.add(planeObject.mesh);
  world.name="WORLD";
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

export const showGUI = (selection) => {

  var currentObject = objectList.get(selection.id);
  var options = currentObject.options;
  console.log(options);
  const {position, rotation, scale} = currentObject.options;
  var gui = new GUI({name:currentObject.name});
  var posFolder = gui.addFolder("position");
  for(const key  of Object.keys(position)){
    posFolder.add(position, key).listen();
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

window.addObject = (object) => {

  let geometry;
  switch(object){
    case "cube":  
      geometry = new THREE.BoxGeometry(initialSizes, initialSizes, initialSizes) ;
    break;
    case "sphere":
      geometry = new THREE.SphereGeometry(initialSizes, initialSizes * 10, initialSizes * 10);
    break;
    case "toroid": 
      geometry = new THREE.TorusGeometry(initialSizes, initialSizes / 3, initialSizes, initialSizes * initialSizes)
    break;
    case "cone":
      geometry = new THREE.ConeGeometry(initialSizes, initialSizes * 2, initialSizes);
    break;
  }
  var object = new threeDGeometry(`${object}-${i}`, geometry, null, false);
  objectList.set(object.id, object);

  scene.add(object.mesh);
}


export const deleteObject = (selection) =>{
  scene.remove(scene.children.find((value) => value.uuid === selection.id));
  objectList.delete(selection.id);
}


function render() {
  
  raycaster.setFromCamera(mouse, camera[CURRENT_CAMERA]);

  var intersects = raycaster.intersectObjects(scene.children);

  if ( intersects.length > 0  && intersects[ 0 ].object.name !== PLANE) {

    if ( INTERSECTED != intersects[ 0 ].object )  INTERSECTED = intersects[ 0 ].object;
    
  } else {

    INTERSECTED = null;

  }
  


  camera[CURRENT_CAMERA].updateProjectionMatrix();
  renderer.render( scene, camera[CURRENT_CAMERA] );
  
  requestAnimationFrame( render );
  controls.update();

}
   
render();
