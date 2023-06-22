import WorldObjects from "./WorldObjects.js";
import * as THREE from "three"
import Engine from "../Engine.js";
import {REQUIRED_OBJECTS_TYPE} from "../constants/REQUIRED_OBJECTS_TYPE.js";
import {OBJECT_PROPERTIES} from "../constants/OBJECT_PROPERTIES.js";

class Plane extends WorldObjects{
    constructor() {
        super();
        const planeGeometry = new THREE.PlaneGeometry(10,10);
        const planeMaterial = new THREE.MeshBasicMaterial({side: THREE.DoubleSide});
        this.planeInstance = new THREE.Mesh(planeGeometry, planeMaterial);
        console.log(this.planeInstance)
    }

    initialize() {
        this._createInitialProperties();
        this._setupDebugger();
        this._addInScene();
    }

    _addInScene() {
        const scene = Engine.instance.getRequiredObject(REQUIRED_OBJECTS_TYPE.SCENE);
        scene.addInScene(this.planeInstance);
    }

    _createInitialProperties() {
        this.planeProperties = {
            color: "#214b4b"
        }
        this.planeInstance.rotateX(Math.PI / 2);
        this.planeInstance.material.color.set(this.planeProperties.color);
    }

    _setupDebugger() {
        Engine.instance.createDebuggingFolder("Plane", this.planeProperties, (key, value) => this._setProperty(key, value));
    }

    _setProperty(key, value) {
        switch (key) {
            case OBJECT_PROPERTIES.COLOR:
                this.planeInstance.material.color.set(value);
                break;
            default:
                throw new Error("Invalid property in class Plane");
        }
    }
}

export default Plane