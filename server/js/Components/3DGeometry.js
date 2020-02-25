import * as THREE from '../build/three.module.js';

class threeDGeometry {

    constructor(name, geometry, material, axisNeeded = false){
        if(material === null){
            material = new THREE.MeshLambertMaterial(
                { color: 0xF3FFE2, wireframe:false }
            );
        }
        this.geometry = geometry;
        this.material = material;
        this.name = name;
        //mesh =>
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.name = name;
        this.id = this.mesh.uuid;

        //edges =>
        this.edges = new THREE.LineSegments(new THREE.EdgesGeometry(this.geometry), new THREE.LineBasicMaterial( { color:0x00d9ff } ));
        this.edges.visible = false;

        //vertex =>
        this.vertex = new THREE.Points(new THREE.Geometry().setFromPoints(geometry.vertices), new THREE.PointsMaterial({
            color: 0x0080ff,
            size: 1,
            alphaTest: 0.5
        }))
        this.vertex.visible = false;
        

        //axis => 
        this.axis =  new THREE.AxesHelper(15);
        this.axis.visible = axisNeeded;

        //transform controls => 


        //GUI OPTIONS => 



        this.options = {
            position: {
                x: this.mesh.position.x,    
                y: this.mesh.position.y,
                z: this.mesh.position.z
            },
            scale : {
                x:1,y:1,z:1
                
            },
            rotation: {
                x:0,y:0,z:0
            }
        }


        //mesh adding =>
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
        
        this.mesh.rotation.set(x,y,z);

    }

    scaleObject(x=this.mesh.scale.x,y=this.mesh.scale.y,z=this.mesh.scale.z){
        this.mesh.scale.set(x,y,z);
    }
}

export default threeDGeometry;