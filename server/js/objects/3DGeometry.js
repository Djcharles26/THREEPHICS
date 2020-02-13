//import * as THREE from '../three';
import * as THREE from '../build/three.module.js';

class threeDGeometry {

    constructor(name, geometry, material, axisNeeded = false){
        if(material === null)
            material = new THREE.MeshLambertMaterial(
                { color: 0xF3FFE2 }
            );
        this.geometry = geometry;
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.name = name;
 
        //edges =>
        this.edges = {
            edges : new THREE.EdgesGeometry(this.geometry),
            active : false,
        }
        this.edges.lines = new THREE.LineSegments(this.edges.edges, new THREE.LineBasicMaterial( { color:0x00d9ff } ));
        
        //vertex => 
        // this.vertex = {
        //     vertex :new THREE.VertexNormalsHelper(this.mesh, 2, 0x00ff00, 1 ),
        //     active: false
        // }
        
        
        this.material = material;

        this.axis = {
            axis: new THREE.AxesHelper(10),
            active: axisNeeded
        }

        if(this.axis.active) this.mesh.add(this.axis.axis);    

    }

    addObjectToScene(scene){
        scene.add(this.mesh);
    }

    seeEdgesOfObject(){
        this.edges.active = !this.edges.active;
        if(this.edges.active) this.mesh.add(this.edges.lines);
        else this.mesh.remove(this.edges.lines);   
    }



    changeMaterial = (material)=> {
        this.material = material;
        this.mesh.material.map = material;
        this.mesh.needsUpdate = true;
    }

    translateObject(x=this.mesh.position.x, y=this.mesh.position.y, z=this.mesh.position.z){
        this.mesh.position.set(x,y,z);
        this.position.set(x,y,z);
    }

    rotateObject(x=this.mesh.rotation.x,y=this.mesh.rotation.y,z=this.mesh.rotation.z){
        this.mesh.rotation.x += (x);
        this.mesh.rotation.y += (y);
        this.mesh.rotation.z += (z);
        

    }

    scaleObject(x=this.mesh.scale.x,y=this.mesh.scale.y,z=this.mesh.scale.z){
        this.mesh.scale(x,y,z);
    }
}

export default threeDGeometry;