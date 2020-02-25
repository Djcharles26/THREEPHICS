import * as THREE from './build/three.module.js';
import {IK, IKChain, IKBallConstraint, IKJoint, IKHelper} from './build/three-ik.module.js';
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
  if(currentSelection === null){
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
    var object = objectList.get(currentSelection.id)
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
    console.log("Ready to associate");
  }else{
    _settingParent  = false;
    console.log("First select an object")
  }
}

window.setParent = setParent;

export const associate = (id) => {
  var childObject = objectList.get(id);
  currentSelection.object.mesh.attach(childObject.mesh);
  currentSelection.object.mesh.updateMatrixWorld();
  _settingParent = false;
  console.log(scene.children)
  unselect();
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
  i++;
  scene.add(object.mesh);

}


export const deleteObject = () =>{
  if(currentSelection !==  null){
    scene.remove(scene.children.find((value) => value.uuid === currentSelection.id));
    scene.remove(currentSelection.object.transformControls);
    objectList.delete(currentSelection.id);
    console.log(currentSelection.object);
    
    currentSelection.object = null;
    currentSelection = null;

  }

}

const ik = new IK();

const chain = new IKChain();
const constraints = [new IKBallConstraint(180)];
const bones = [];

// Create a target that the IK's effector will reach
// for.
const movingTarget = new THREE.Mesh(new THREE.SphereGeometry(0.1), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
movingTarget.position.z = 50 ;
const pivot = new THREE.Object3D();
pivot.add(movingTarget);
scene.add(pivot);

// Create a chain of THREE.Bone's, each wrapped as an IKJoint
// and added to the IKChain
for (let i = 0; i < 10; i++) {
  const bone = new THREE.Bone();
  bone.position.y = i === 0 ? 0 : 10;

  if (bones[i - 1]) { bones[i - 1].add(bone); }
  bones.push(bone);

  // The last IKJoint must be added with a `target` as an end effector.
  const target = i === 9 ? movingTarget : null;
  chain.add(new IKJoint(bone, { constraints }), { target });
}

// Add the chain to the IK system
ik.add(chain);

// Ensure the root bone is added somewhere in the scene
scene.add(ik.getRootBone());

console.log(ik);
// Create a helper and add to the scene so we can visualize
// the bones
const helper = new IKHelper(ik, {
  boneSize: 1,
  wireframe: false
});
helper.showAxes = false;
scene.add(helper);

export function animate(){


  ik.solve();

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


function render() {

  pivot.rotation.x += 0.01;
  pivot.rotation.y += 0.01;


  renderer.render( scene, camera[CURRENT_CAMERA] );
  
  

}
   
animate();