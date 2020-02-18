//import * as THREE from './three.module';
import {renderer, controls, CURRENT_CAMERA , INTERSECTED, deleteObject, showGUI } from '../index.js';
import camera from './camera.js';
import * as THREE from '../build/three.module.js';
import { PERSPECTIVE_CAMERA } from './constants.js';

export function getRenderer(){
    var renderer = new THREE.WebGLRenderer({ antialias: true});  
    document.body.appendChild(renderer.domElement);  
    renderer.setClearColor(0x000000);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize( window.innerWidth, window.innerHeight - 30);
    return renderer;
    
}

export function onWindowResize() {
    var aspect = window.innerWidth / window.innerHeight;
    
    camera[CURRENT_CAMERA].aspect  = aspect;
    if(CURRENT_CAMERA !== PERSPECTIVE_CAMERA){
      camera[CURRENT_CAMERA].left = window.innerWidth / 8;
      camera[CURRENT_CAMERA].right = window.innerWidth / -8;
      camera[CURRENT_CAMERA].top = window.innerHeight / 8;
      camera[CURRENT_CAMERA].bottom = window.innerHeight / -8;
    }
    
    camera[CURRENT_CAMERA].updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    
}

export function onMousePress(e){
  e.preventDefault();
  console.log("Rueda");
}

export var selection = {
  id : 0,
  Hex: 0x0
}

export function onMouseClick(e){
  e.preventDefault();
  if(!controls.enabled){
    if(e.button == 0){
    
      if(INTERSECTED !== null){
        if(INTERSECTED.uuid === selection.id){
          INTERSECTED.material.emissive.setHex(selection.Hex);
          selection.id = 0;
          selection.Hex = 0x0;
        }else{
          selection.id = INTERSECTED.uuid;
          INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
          selection.Hex = INTERSECTED.currentHex;
          INTERSECTED.material.emissive.setHex( 0xff0000 );
        }
        showGUI(selection);
      }
    }
  }
}


export function onKeyPress(e){
  e.preventDefault();
  if(e.keyCode === 18) controls.enabled = true;
  else if(e.keyCode === 116) window.location.reload();
  else if(e.keyCode === 46) deleteObject(selection);
}

export function onKeyRelease(e){
  e.preventDefault();
  if(e.keyCode === 18){
    controls.enabled = false;
  }
}

export const mouse = new THREE.Vector2();



export function onMouseMove(e){
    e.preventDefault();

    
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y =  - (e.clientY / window.innerHeight) * 2 + 1;

}
