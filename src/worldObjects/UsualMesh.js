import WorldObjects from "./WorldObjects.js";
import * as THREE from "three"
import Engine from "../Engine.js";
import {OBJECT_PROPERTIES} from "../constants/OBJECT_PROPERTIES.js";
import {WORLD_OBJECT_GEOMETRIES, WORLD_OBJECT_MESH_TYPES} from "../constants/OBJECT_TYPES.js";
import {SHADOW_ACTION} from "../constants/SHADOW_ACTION.js";

class UsualMesh extends WorldObjects{
    constructor(name, geometry, material, props) {
        super(name, props);
        this._createMeshBasedOnGeometryAndMaterial(geometry, material);
    }

    initialize() {
        this._setupDebugger();
        this._addInScene();
    }

    _addInScene() {
        Engine.instance.addInScene(this.meshInstance);
    }

    _setupDebugger() {
        Engine.instance.createDebuggingFolder(this.name, {color: this.properties.color}, (key, value) => this.setProperty(key, value));
    }

    addShadow(shouldCast = null) {
        switch (shouldCast) {
            case SHADOW_ACTION.RECEIVE:
                this.meshInstance.receiveShadow = true;
                break;
            case SHADOW_ACTION.CAST:
                this.meshInstance.castShadow = true;
                break;
            case SHADOW_ACTION.BOTH:
            default:
                this.meshInstance.castShadow = true;
                this.meshInstance.receiveShadow = true;
                break;
        }

    }

    setProperty(key, value) {
        switch (key) {
            case OBJECT_PROPERTIES.COLOR:
                this.meshInstance.material.color.set(value);
                break;
            case OBJECT_PROPERTIES.POSITION:
                this.meshInstance.position.set(value.x, value.y, value.z);
                break;
            default:
                throw new Error("Invalid property to toggle in class UsualMesh");
        }
    }

    _createMeshBasedOnGeometryAndMaterial(geometry, material) {
        switch (geometry) {
            case WORLD_OBJECT_GEOMETRIES.PLANE:
                this.meshGeometry = new THREE.PlaneGeometry(this.properties.width, this.properties.height);
                this.meshGeometry.rotateX(Math.PI / 2);
                break;
            case WORLD_OBJECT_GEOMETRIES.BOX:
                this.meshGeometry = new THREE.BoxGeometry(this.properties.width);
                // this.meshGeometry.position.y = this.properties.width / 2;
                break;
            default:
                throw new Error("Problem with geometry");
        }
        switch (material) {
            case WORLD_OBJECT_MESH_TYPES.BASIC:
                this.meshMaterial = new THREE.MeshBasicMaterial({
                    side: THREE.DoubleSide,
                    color: this.properties.color
                });
                break;
            case WORLD_OBJECT_MESH_TYPES.STANDARD:
                this.meshMaterial = new THREE.MeshStandardMaterial({
                    side: THREE.DoubleSide,
                    color: this.properties.color
                });
                break;
            default:
                throw new Error("Problem with material");
        }

        this.meshInstance = new THREE.Mesh(this.meshGeometry, this.meshMaterial);

        if(geometry !== WORLD_OBJECT_GEOMETRIES.PLANE) {
            this._uniformPositionOnY();
        }
    }

    _uniformPositionOnY() {
        this.meshInstance.position.y += this.meshInstance.geometry.parameters.height / 2 + 0.01;
    }
}

export default UsualMesh;