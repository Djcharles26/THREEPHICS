import * as THREE from '../build/three.module.js';
import {
    PERSPECTIVE_CAMERA,
    RIGHT_CAMERA,
    TOP_CAMERA,
    BOTTOM_CAMERA,
    LEFT_CAMERA,
    FRONT_CAMERA,
    BACK_CAMERA,
}from './constants.js';

var container = document.getElementById('desmadre_johan');

var camera = [];
var aspect = container.offsetWidth / container.offsetHeight;
camera[PERSPECTIVE_CAMERA] = new THREE.PerspectiveCamera( 35,  aspect , 0.1, 30000 );
camera[PERSPECTIVE_CAMERA].position.set(30,30,100);
camera[RIGHT_CAMERA] = new THREE.OrthographicCamera(container.offsetWidth / 8, container.offsetWidth / -8,container.offsetHeight/8, container.offsetHeight/-8,0.1,3000);
camera[RIGHT_CAMERA].position.x = 500;
camera[LEFT_CAMERA] =new THREE.OrthographicCamera(container.offsetWidth / 8,container.offsetWidth / -8,container.offsetHeight/8, container.offsetHeight/-8,0.1,3000);
camera[LEFT_CAMERA].position.x = -500;
camera[TOP_CAMERA] = new THREE.OrthographicCamera(container.offsetWidth / 8,container.offsetWidth / -8,container.offsetHeight/8, container.offsetHeight/-8,0.1,3000);
camera[TOP_CAMERA].position.y = -500;
camera[BOTTOM_CAMERA] = new THREE.OrthographicCamera(container.offsetWidth / 8,container.offsetWidth / -8,container.offsetHeight/8, container.offsetHeight/-8,0.1,3000);
camera[BOTTOM_CAMERA].position.y = 500;
camera[FRONT_CAMERA] = new THREE.OrthographicCamera(container.offsetWidth / 8,container.offsetWidth / -8,container.offsetHeight/8, container.offsetHeight/-8,0.1,3000);
camera[FRONT_CAMERA].position.z = 100;
camera[BACK_CAMERA] = new THREE.OrthographicCamera(container.offsetWidth / 8,container.offsetWidth / -8,container.offsetHeight/8, container.offsetHeight/-8,0.1,3000);
camera[FRONT_CAMERA].position.z = -100;
export default camera;