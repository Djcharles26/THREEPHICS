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

var camera = [];
var aspect = window.innerWidth / window.innerHeight;
camera[PERSPECTIVE_CAMERA] = new THREE.PerspectiveCamera( 35,  aspect , 0.1, 30000 );
camera[PERSPECTIVE_CAMERA].position.set(30,30,100);
camera[RIGHT_CAMERA] = new THREE.OrthographicCamera(window.innerWidth / 8, window.innerWidth / -8,window.innerHeight/8, window.innerHeight/-8,0.1,3000);
camera[RIGHT_CAMERA].position.x = 500;
camera[LEFT_CAMERA] =new THREE.OrthographicCamera(window.innerWidth / 8,window.innerWidth / -8,window.innerHeight/8, window.innerHeight/-8,0.1,3000);
camera[LEFT_CAMERA].position.x = -500;
camera[TOP_CAMERA] = new THREE.OrthographicCamera(window.innerWidth / 8,window.innerWidth / -8,window.innerHeight/8, window.innerHeight/-8,0.1,3000);
camera[TOP_CAMERA].position.y = -500;
camera[BOTTOM_CAMERA] = new THREE.OrthographicCamera(window.innerWidth / 8,window.innerWidth / -8,window.innerHeight/8, window.innerHeight/-8,0.1,3000);
camera[BOTTOM_CAMERA].position.y = 500;
camera[FRONT_CAMERA] = new THREE.OrthographicCamera(window.innerWidth / 8,window.innerWidth / -8,window.innerHeight/8, window.innerHeight/-8,0.1,3000);
camera[FRONT_CAMERA].position.z = 100;
camera[BACK_CAMERA] = new THREE.OrthographicCamera(window.innerWidth / 8,window.innerWidth / -8,window.innerHeight/8, window.innerHeight/-8,0.1,3000);
camera[FRONT_CAMERA].position.z = -100;
export default camera;