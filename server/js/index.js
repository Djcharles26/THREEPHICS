//'http://localhost:3000/static';

import * as THREE from './build/three.module.js';
import {OrbitControls} from './addons/jsm/controls/OrbitControls.js';
import { getRenderer, onWindowResize, onMouseMove, mouse } from './utils.js';
import { CURRENT_CAMERA, PLANE } from './constants.js';
import threeDGeometry from './objects/3DGeometry.js';
import {VertexNormalsHelper} from './addons/jsm/helpers/VertexNormalsHelper.js';
//variables

var  controls, scene;
var cubeObject;
var raycaster = new THREE.Raycaster();
export var  camera = [], renderer;
var INTERSECTED;



init();
function init(){
  renderer = getRenderer();
  //camera =>
  camera[0] = new THREE.PerspectiveCamera( 35,  window.innerWidth / window.innerHeight , 0.1, 3000 );
  //scene=>
  scene = new THREE.Scene();
  //controls => 
  controls = new OrbitControls( camera[CURRENT_CAMERA], renderer.domElement );
  controls.mouseButtons = {
    (LEFT && 13): 
  }
  console.log(controls);
  window.addEventListener('resize', onWindowResize, false );

  //lights => 
  
  const light = new THREE.AmbientLight(0xffffff, 0.5);
  
  scene.add(light);
  
  const light2 = new THREE.DirectionalLight(0xffffff, 0.5);
  light2.position.set(1000,1000,500);
  
  //var helper = new THREE.DirectionalLightHelper(light2, 5);
  scene.add(light2);
  //scene.add(helper);


  // world
  
  
  cubeObject = new threeDGeometry("Cube", new THREE.BoxGeometry(10,10,10), null, true);
  

  //world construction (Don't touch)
  const planeObject = new threeDGeometry(PLANE, new THREE.PlaneGeometry(100,100,10, 10),
   new THREE.MeshLambertMaterial({color:0xffff, wireframe:true}), false );
  planeObject.rotateObject(90 * Math.PI / 180);
  scene.add(planeObject.mesh);
  
  cubeObject.addObjectToScene(scene);
  
  camera[CURRENT_CAMERA].position.set(30,30,100);
  
  requestAnimationFrame(render);
}




window.edges = () => {
  cubeObject.seeEdgesOfObject();

};

window.addEventListener("mousemove", onMouseMove, false);



function render() {

  raycaster.setFromCamera(mouse, camera[CURRENT_CAMERA]);

  var intersects = raycaster.intersectObjects(scene.children);

  if ( intersects.length > 0  && intersects[ 0 ].object.name !== PLANE) {

    if ( INTERSECTED != intersects[ 0 ].object ) {

      if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
      
      INTERSECTED = intersects[ 0 ].object;
      INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
      INTERSECTED.material.emissive.setHex( 0xff0000 );

    }

  } else {

    if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
    INTERSECTED = null;

  }

  renderer.render( scene, camera[CURRENT_CAMERA] );
  requestAnimationFrame( render );
  controls.update();

}
   
render();
