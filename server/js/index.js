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
import Chain from './Components/Chain.js';
import threeDGeometry from './Components/3DGeometry.js';
import camera from './utils/camera.js';
import * as dat from  './addons/jsm/libs/dat.gui.module.js';
//variables

export var renderer, controls, _settingParent = false;
var container = document.getElementById('canvas');
var gui = null;
var currentSelection = null;
var currentChildrenOptions = [];
var scene;
var raycaster = new THREE.Raycaster();
var objectList = new Map();
export var INTERSECTED, INTERSECTED_BONE;
export var CURRENT_CAMERA;
var i;
var chain = null;

const initialSizes = 10;
var params = {
  textField: 'some text'
}


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

  //IK programming =>

  

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
  if(currentSelection === null){
    document.getElementById("select-btn").style.display = 'flex';
    document.getElementById("unselect-btn").style.display = 'flex';
    currentSelection = {};
    currentSelection.object = objectList.get(selection.id);
    if(currentSelection.object !== null){
      currentSelection.object.material.emissive.setHex(0xff0000); 
      //If has children
      
      currentSelection.object.mesh.children.forEach((child, index) =>{
        if(child.type === "Mesh"){
          child.material.emissive.setHex(0xff0000);

        }
      })
      currentSelection.id = selection.id;
      currentSelection.Hex = selection.Hex;
      
      //GUI PART =>
      gui = new dat.GUI({name: "Controller"});
      document.getElementById("props").appendChild(gui.domElement);
      var parentFolder = gui.addFolder(currentSelection.object.name);
      var posFolder = parentFolder.addFolder("position");
      for(const key  of Object.keys(currentSelection.object.options.position)){
        posFolder.add(currentSelection.object.options.position, key, -300,300, 0.01);
      }
      var rotFolder = parentFolder.addFolder("rotation");
      for(const key of Object.keys(currentSelection.object.options.rotation)){
        rotFolder.add(currentSelection.object.options.rotation, key, 0, 360, 0.01);
      }

      var scaleFolder = parentFolder.addFolder("scale");
      for(const key of Object.keys(currentSelection.object.options.scale)){
        scaleFolder.add(currentSelection.object.options.scale, key, 0.01,10,0.001);
      }
      //TODO: If has children
      currentSelection.object.mesh.children.forEach((child, index) =>{
        if(child.type === "Mesh"){
          var options = {
            position: {
                x: child.position.x,
                y: child.position.y,
                z: child.position.z
            },
            scale : {
                x:child.scale.x,y:child.scale.y,z:child.scale.z
                
            },
            rotation: {
                x:child.rotation.x,y:child.rotation.y,z:child.rotation.z
            }
        }
        var childFolder = parentFolder.addFolder(child.name);
        var posFolder = childFolder.addFolder("position");
        for(const key  of Object.keys(options.position)){
          posFolder.add(options.position, key, -300,300, 0.01);
        }
        var rotFolder = childFolder.addFolder("rotation");
        for(const key of Object.keys(options.rotation)){
          rotFolder.add(options.rotation, key, 0, 360, 0.01);
        }
        
        var scaleFolder = childFolder.addFolder("scale");
        for(const key of Object.keys(options.scale)){
          scaleFolder.add(options.scale, key, 0.01,10,0.001);
        }
        currentChildrenOptions.push(options);
      }
      })
      parentFolder.open();
      posFolder.open();
      rotFolder.open();
      scaleFolder.open();

      
      window.objectName = currentSelection.object.name;

    }
}
  
}


export const unselect = () => {
  if(currentSelection !== null){
    document.getElementById('object-name').innerHTML = '[  ]';
    document.getElementById("select-btn").style.display = 'flex';
    document.getElementById("unselect-btn").style.display = 'flex';

    currentSelection.object.material.emissive.setHex(currentSelection.Hex);
    currentSelection.object.mesh.children.forEach((child) => {
      if(child.type === "Mesh"){
        child.material.emissive.setHex(currentSelection.Hex);
      }
    })
    currentSelection = null;
    currentChildrenOptions = [];
    document.getElementById("props").removeChild(gui.domElement);
  }
}

const setParent = () => {
  if(currentSelection !== null){
    _settingParent = true;
  }else{
    _settingParent  = false;
  }
}

window.setParent = setParent;

export const associate = (id) => {
  var childObject = objectList.get(id);
  currentSelection.object.mesh.attach(childObject.mesh);
  currentSelection.object.mesh.updateMatrixWorld();
  _settingParent = false;
  console.log(scene.children)
  window.alert('Associate Done');
  unselect();
}

window.addObject = (object) => {
  let geometry, isBone = false;
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
      geometry = new THREE.ConeGeometry(initialSizes, initialSizes * 2, 64);
    break;
    case "initial_bone":
      console.log("initial_bone");
      chain = new Chain("chain1", 10);
      isBone = true;
      scene.add(chain.pivot);
      //TODO: Create chain, create constraints create 1 bone
    break;
    case "bone":
      chain.addBone(new THREE.Bone());
      isBone = true;
      //TODO: create bone and add to chain
    break;
    case "final_bone":
      chain.addFinalBone(new THREE.Bone())
      isBone = true;
    break;

  }
  if(!isBone){
    var object = new threeDGeometry(`${object}-${i}`, geometry, null, false, camera[CURRENT_CAMERA], renderer.domElement);
    document.getElementById('object-name').innerHTML = '[  '+object.name+'  ]';
    objectList.set(object.id, object);
    i++;
    scene.add(object.mesh);
  }else{

    isBone = false;
    scene.add(chain.ik.getRootBone());  
    scene.add(chain.helper);
    
  }
  

}




export const deleteObject = () =>{
  if(currentSelection !==  null){
    document.getElementById("select-btn").style.display = 'flex';
    document.getElementById("unselect-btn").style.display = 'flex';
    scene.remove(scene.children.find((value) => value.uuid === currentSelection.id));
    objectList.delete(currentSelection.id);
    console.log(currentSelection.object);
    document.getElementById('object-name').innerHTML = '[  ]';
    unselect();
    
  }

}




export function animate(){


  // ik.solve();

  if(currentSelection !== null){ 
    currentSelection.object.translateObject(currentSelection.object.options.position.x,
      currentSelection.object.options.position.y,
      currentSelection.object.options.position.z);
    currentSelection.object.rotateObject(currentSelection.object.options.rotation.x * Math.PI/180,
      currentSelection.object.options.rotation.y * Math.PI/180 , currentSelection.object.options.rotation.z * Math.PI/180);  
    currentSelection.object.scaleObject(currentSelection.object.options.scale.x,
      currentSelection.object.options.scale.y, currentSelection.object.options.scale.z);
    var j = 0;
    currentSelection.object.mesh.children.forEach((child) => {
      if(child.type === "Mesh"){
        child.position.set(currentChildrenOptions[j].position.x,currentChildrenOptions[j].position.y, currentChildrenOptions[j].position.z);
        child.rotation.set(currentChildrenOptions[j].rotation.x,currentChildrenOptions[j].rotation.y, currentChildrenOptions[j].rotation.z);
        child.scale.set(currentChildrenOptions[j].scale.x,currentChildrenOptions[j].scale.y, currentChildrenOptions[j].scale.z);
        j++;
      }
    })
  }

  
  raycaster.setFromCamera(mouse, camera[CURRENT_CAMERA]);

  var intersects = raycaster.intersectObjects(scene.children, true );

  if ( intersects.length > 0  && intersects[ 0 ].object.name !== PLANE) {
    if ( INTERSECTED !== intersects[ 0 ].object ) { 
      INTERSECTED = intersects[ 0 ].object;
      console.log(INTERSECTED);
      }
  } else {

    INTERSECTED = null;

  }

  
  
  camera[CURRENT_CAMERA].updateProjectionMatrix();
  requestAnimationFrame(animate);

  controls.update();
  render();


}

window.openFile = () => {
  console.log(scene);
}


function render() {

  if(chain!==null && !chain.openChain){
    chain.pivot.rotation.x += 0.01;
    chain.pivot.rotation.y += 0.01;
    chain.pivot.rotation.z += 0.01;
    chain.ik.solve();
  }

  renderer.render( scene, camera[CURRENT_CAMERA] );
  
  

}
   
animate();