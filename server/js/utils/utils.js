//import * as THREE from './three.module';
import {renderer, controls, CURRENT_CAMERA , INTERSECTED, deleteObject, unselect, select } from '../index.js';
import camera from './camera.js';
import * as THREE from '../build/three.module.js';
import { PERSPECTIVE_CAMERA } from './constants.js';

var container = document.getElementById('canvas');

export function getRenderer(){
    var renderer = new THREE.WebGLRenderer({ antialias: true});  
    container.appendChild(renderer.domElement)
    renderer.setClearColor(0x000000);
    renderer.setPixelRatio(container.devicePixelRatio);
    renderer.setSize( container.offsetWidth, container.offsetHeight);
    return renderer;
    
}

export function onWindowResize() {
    var aspect = container.offsetWidth / container.offsetHeight;
    
    camera[CURRENT_CAMERA].aspect  = aspect;
    if(CURRENT_CAMERA){
      camera[CURRENT_CAMERA].left = container.offsetWidth / 8;
      camera[CURRENT_CAMERA].right = container.offsetWidth / -8;
      camera[CURRENT_CAMERA].top = container.offsetHeight / 8;
      camera[CURRENT_CAMERA].bottom = container.offsetHeight / -8;
    }
    
    camera[CURRENT_CAMERA].updateProjectionMatrix();
    renderer.setSize( container.offsetWidth, container.offsetHeight );
    
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
          selection = {}
          unselect();
        }else{
          selection.id = INTERSECTED.uuid;
          selection.Hex= INTERSECTED.material.emissive.getHex();
          
          select(selection);

        }
        
      }else{
        unselect();
        selection = {};
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

    
    mouse.x = ((e.clientX - 41) / container.offsetWidth) * 2 - 1;
    mouse.y =  - ((e.clientY -  106) / container.offsetHeight) * 2 + 1;

}


export function radians(angle){
  return angle * Math.PI/180;
}