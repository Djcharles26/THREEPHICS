import * as THREE from './build/three.module.js';
import {OrbitControls} from './addons/jsm/controls/OrbitControls.js';
import {TransformControls} from './addons/jsm/controls/TransformControls.js';
import { 
  getRenderer,
  onWindowResize, 
  onMouseMove, 
  onKeyPress, 
  onKeyRelease, 
  onMousePress, 
  onMouseClick, 
  mouse,
  radians
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
import * as dat from  './addons/jsm/libs/dat.gui.module.js';

//variables

export var renderer, controls;
var currentObject = null;
var container = document.getElementById('canvas');
var gui = null;
var currentSelection = null;
var scene;
var raycaster = new THREE.Raycaster();
var objectList = new Map();
export var INTERSECTED;
export var CURRENT_CAMERA;
var i;
const initialSizes = 10;
var params = {
  textField: 'some text'
}
var bones;

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
  container.addEventListener('resize', onWindowResize, false );
  container.addEventListener('onwheel' , onMousePress, false);
  container.addEventListener('keydown', onKeyPress, false );
  container.addEventListener('keyup', onKeyRelease, false);
  container.addEventListener("mousemove", onMouseMove, false);
  container.addEventListener("mouseup", onMouseClick, false );


  //world construction=>
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
  
  
  world.add(planeObject.mesh);
  world.name="WORLD";
  scene.add(world);

  
  


}



container.changeCamera = (point)=>{
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


export const select = (selection) => {

  currentObject = objectList.get(selection.id);
  if(currentObject !== null){
    currentObject.material.emissive.setHex(0xff0000); 
    currentSelection = selection;
    if(currentObject.transformControls !== null)  currentObject.transformControls.visible = true;
    //GUI PART =>
    gui = new dat.GUI({name: "Controller"});
    document.getElementById("props").appendChild(gui.domElement);
    var posFolder = gui.addFolder("position");
    for(const key  of Object.keys(currentObject.options.position)){
      posFolder.add(currentObject.options.position, key, -300,300, 0.01);
    }
    var rotFolder = gui.addFolder("rotation");
    for(const key of Object.keys(currentObject.options.rotation)){
      rotFolder.add(currentObject.options.rotation, key, 0, 360, 0.01);
    }

    var scaleFolder = gui.addFolder("scale");
    for(const key of Object.keys(currentObject.options.scale)){
      scaleFolder.add(currentObject.options.scale, key, 0.01,10,0.001);
    }

    posFolder.open();
    rotFolder.open();
    scaleFolder.open();

    
    window.objectName = currentObject.name;

  }
  
}


export const unselect = () => {
  if(currentSelection !== null){
    var object = objectList.get(currentSelection.id);
    object.material.emissive.setHex(currentSelection.Hex);
    currentSelection = null;
    document.getElementById("props").removeChild(gui.domElement);
  }
  window.objectName = "NOMBRE DEL OBJETO";
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
  var object = new threeDGeometry(`${object}-${i}`, geometry, null, false, camera[CURRENT_CAMERA], renderer.domElement);
  objectList.set(object.id, object);

  scene.add(object.mesh);
  if(object.transformControls !== null) scene.add(object.transformControls);
}


export const deleteObject = (selection) =>{
  scene.remove(scene.children.find((value) => value.uuid === selection.id));
  objectList.delete(selection.id);
  currentObject = null;
}


function animate(){
  const time = Date.now() * 0.001;
  const angle = Math.cos(time);



  if(currentObject !== null){ 
    currentObject.translateObject(currentObject.options.position.x,
      currentObject.options.position.y,
      currentObject.options.position.z);
    currentObject.rotateObject(currentObject.options.rotation.x * Math.PI/180,
      currentObject.options.rotation.y * Math.PI/180 , currentObject.options.rotation.z * Math.PI/180);  
    currentObject.scaleObject(currentObject.options.scale.x,
      currentObject.options.scale.y, currentObject.options.scale.z);
  }
  
  raycaster.setFromCamera(mouse, camera[CURRENT_CAMERA]);

  var intersects = raycaster.intersectObjects(scene.children);

  if ( intersects.length > 0  && intersects[ 0 ].object.name !== PLANE) {
  if ( INTERSECTED !== intersects[ 0 ].object )  INTERSECTED = intersects[ 0 ].object;
  } else {

    INTERSECTED = null;

  }
  


  camera[CURRENT_CAMERA].updateProjectionMatrix();
  requestAnimationFrame(animate);

  controls.update();
  render();
}


export function render() {


  
  renderer.render( scene, camera[CURRENT_CAMERA] );
  
  

}
   
animate();