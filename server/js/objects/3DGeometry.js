import * as THREE from '../build/three.module.js';
import {VertexNormalsHelper} from '../addons/jsm/helpers/VertexNormalsHelper.js';

class threeDGeometry {

    constructor(name, geometry, material, axisNeeded = false){
        if(material === null){
            material = new THREE.MeshLambertMaterial(
                { color: 0xF3FFE2, wireframe:false }
            );
        }
        this.geometry = geometry;
        this.material = material;
        //mesh =>
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.name = name;

        //edges =>
        this.edges = new THREE.LineSegments(new THREE.EdgesGeometry(this.geometry), new THREE.LineBasicMaterial( { color:0x00d9ff } ));
        this.edges.visible = false;

        //vertex =>
        this.vertex = new VertexNormalsHelper(this.mesh,2, 0x00ff00, 1000);
        this.vertex.visible = false;
        

        //axis
        this.axis =  new THREE.AxesHelper(15);
        this.axis.visible = axisNeeded;
        
        
        this.mesh.add(this.edges);
        this.mesh.add(this.vertex);
        this.mesh.add(this.axis);    
    }




    changeMaterial = (material)=> {
        this.material = material;
        this.mesh.material.map = material;
        this.mesh.needsUpdate = true;
    }

    translateObject(x=this.mesh.position.x, y=this.mesh.position.y, z=this.mesh.position.z){
        this.mesh.position.set(x,y,z);
    }

    rotateObject(x=this.mesh.rotation.x,y=this.mesh.rotation.y,z=this.mesh.rotation.z){
        this.mesh.rotateX(x);
        this.mesh.rotateY(y);
        this.mesh.rotateZ(z);
    

    }

    scaleObject(x=this.mesh.scale.x,y=this.mesh.scale.y,z=this.mesh.scale.z){
        this.mesh.scale(x,y,z);
    }
}

export default threeDGeometry;