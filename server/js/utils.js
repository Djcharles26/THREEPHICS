//import * as THREE from './three.module';
import { camera, renderer } from './index.js';
import { CURRENT_CAMERA } from './constants.js';
import * as THREE from './three.module.js';

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
    
    camera[CURRENT_CAMERA].updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    
}

export const mouse = new THREE.Vector2();

export function onMouseMove(e){
    e.preventDefault();

    
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y =  - (e.clientY / window.innerHeight) * 2 + 1;

}
