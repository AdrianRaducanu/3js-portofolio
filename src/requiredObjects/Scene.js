import RequiredObjects from "./RequiredObjects.js";
import * as THREE from "three";
import Engine from "../Engine.js";
import {SCENE_PROPS} from "../constants/SCENE_PROPS.js";

class Scene extends RequiredObjects{
    constructor() {
        super();
        this.sceneInstance = new THREE.Scene();
        this.sceneProperties = SCENE_PROPS;
    }

    /**
     * Called from outside of this class
     */
    initialize() {
        this._createInitialSceneProperties();
        this._setupDebugger();
    }

    /**
     * Add obj to the scene
     * @param obj
     */
    addInScene(obj) {
        this.sceneInstance.add(obj);
    }

    /**
     * Remove obj from scene
     * @param obj
     */
    removeFromScene(obj) {
        this.sceneInstance.remove(obj);
    }

    /**
     * return sceneInstace
     * @returns {Scene|Scene}
     */
    getInstance() {
        return this.sceneInstance;
    }

    /**
     * Add debugger
     * @private
     */
    _setupDebugger() {
        Engine.instance.createDebuggingFolder("Scene", this.sceneProperties, (key, value) => this._setProperty(key, value));
    }

    /**
     * Scene properties
     * @private
     */
    _createInitialSceneProperties() {
        this.sceneInstance.background = new THREE.Color(this.sceneProperties.background);
    }

    /**
     * Set property based on key and value
     * @param key
     * @param value
     * @private
     */
    _setProperty(key, value) {
        this.sceneInstance[key].set(value);
    }

    /**
     * Change background color
     * @param value
     */
    changeBackground(value) {
        this.sceneInstance.background.set(value);
    }


}

export default Scene