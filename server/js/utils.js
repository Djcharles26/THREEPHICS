//import * as THREE from './three.module';
import {renderer, controls, CURRENT_CAMERA } from './index.js';
import camera from './cameras/camera.js';
import * as THREE from './build/three.module.js';
import { PERSPECTIVE_CAMERA } from './constants.js';

export function getRenderer(){
    var renderer = new THREE.WebGLRenderer({ antialias: true});  
    document.body.appendChild(renderer.domElement);  
    renderer.setClearColor(0x000000);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize( window.innerWidth, window.innerHeight);
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



export function onKeyPress(e){
  e.preventDefault();
  if(e.keyCode == 18) controls.enabled = true;
  else if(e.keyCode == 116) window.location.reload();
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
