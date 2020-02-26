import * as THREE from '../build/three.module.js';
import {IKChain, IKHelper, IKBallConstraint, IKJoint, IK } from '../build/three-ik.module.js';
import { radians } from '../utils/utils.js';

class Chain {

    //@param{string} name
    //@param{...number} boneSize   
    constructor(name= "chain", boneSize){
        this.name = name;
        this.ik = new IK();
        this.chain = new IKChain();
        this.constraints = [new IKBallConstraint(180)];
        
        this.bones = [];
        this.currentBone = 2;

       
        this.pivot = new THREE.Object3D();
        this.pivot.name="pivot";
        var bone = new THREE.Bone();
        bone.name=`bone ${this.currentBone}`;
        bone.position.y = 0;
        this.bones.push(bone);
        var bone2 = new THREE.Bone();
        bone2.name=`bone ${this.currentBone}`

        this.boneSize = boneSize;
        bone2.position.y = this.boneSize;
        this.bones[0].add(bone2);
        this.bones.push(bone2);
        this.chain.add(new IKJoint(bone, {constraints: this.constraints}), {});
        this.chain.add(new IKJoint(bone2, {constraints: this.constraints}), {});
        
        this.ik.add(this.chain);
        this.helper = new IKHelper(this.ik, {boneSize: 1, wireframe:false});
        this.helper.wireframe = false;
        this.openChain = true;
        this.movingTarget = null;
    }


    //@param{THREE.Bone} bone 
    addBone(bone){
        bone.position.y = this.boneSize;
        bone.name=`bone ${this.currentBone}`
        if (this.bones[this.currentBone - 1]) this.bones[this.currentBone - 1].add(bone); 
        this.bones.push(bone);
        this.chain.add(new IKJoint(bone, {constraints:this.constraints}), {});
        this.currentBone++;
        //refresh chain
        console.log(this.ik); 
        // this.ik = new IK();
        // this.ik.add(this.chain);
        this.helper = new IKHelper(this.ik, {boneSize: 1});
    }

    //@param{THREE.Bone} bone 
    addFinalBone(bone, target){
      this.movingTarget = target;
      this.pivot.add(target);
      bone.position.y = this.boneSize;
      if (this.bones[this.currentBone - 1]) { this.bones[this.currentBone - 1].add(bone); }
      this.bones.push(bone);
      this.chain.add(new IKJoint(bone, {constraints:this.constraints}), {target});
      this.currentBone++;
      this.openChain = false;
    }




}

export default Chain;