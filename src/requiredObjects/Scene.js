import RequiredObjects from "./RequiredObjects.js";
import * as THREE from "three";
import Engine from "../Engine.js";

class Scene extends RequiredObjects{
    constructor() {
        super();
        this.sceneInstance = new THREE.Scene();
    }

    initialize() {
        this._createInitialSceneProperties();
        this._setupDebugger();
    }

    addInScene(obj) {
        this.sceneInstance.add(obj);
    }

    removeFromScene(obj) {
        this.sceneInstance.remove(obj);
    }

    getInstance() {
        return this.sceneInstance;
    }

    _setupDebugger() {
        Engine.instance.createDebuggingFolder("Scene", this.sceneProperties, (key, value) => this._setProperty(key, value));
    }

    _createInitialSceneProperties() {
        this.sceneProperties = {
            background: "#000"
        }

        this.sceneInstance.background = new THREE.Color(this.sceneProperties.background );
    }

    _setProperty(key, value) {
        this.sceneInstance[key].set(value);
    }


}

export default Scene