import Engine from "./Engine.js";
import {REQUIRED_OBJECTS_TYPE} from "./constants/REQUIRED_OBJECTS_TYPE.js";
import * as THREE from "three";
import {MEASUREMENT_UNITS} from "./constants/UNITS.js";

class World {
    constructor() {
    }

    initialize() {
        this.scene = Engine.instance.getRequiredObject(REQUIRED_OBJECTS_TYPE.SCENE);
    }

    start() {
        const light = new THREE.AmbientLight();
        this.scene.addInScene(light);


        const geometry = new THREE.BoxGeometry( MEASUREMENT_UNITS.BASIC, MEASUREMENT_UNITS.BASIC, MEASUREMENT_UNITS.BASIC );
        const material = new THREE.MeshBasicMaterial();
        material.color.set("#ffffff");
        const cube = new THREE.Mesh( geometry, material );
        this.scene.addInScene( cube );
    }
}

export default World;