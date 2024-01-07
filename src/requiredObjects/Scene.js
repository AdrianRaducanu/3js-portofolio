import RequiredObjects from "./RequiredObjects.js";
import * as THREE from "three";
import {FOG_PROPS, SCENE_PROPS} from "../constants/SCENE_PROPS.js";
import {Fog} from "three";

class Scene extends RequiredObjects{
    constructor() {
        super();
        this.sceneInstance = new THREE.Scene();
        this.sceneProperties = SCENE_PROPS;
        this.sceneInstance.fog = new Fog(
            FOG_PROPS.DEFAULT.color,
            FOG_PROPS.DEFAULT.near,
            FOG_PROPS.DEFAULT.far,
        );
    }

    /**
     * Called from outside of this class
     */
    initialize() {
        this._createInitialSceneProperties();
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
     * Scene properties
     * @private
     */
    _createInitialSceneProperties() {
        this.sceneInstance.background = new THREE.Color(this.sceneProperties.background);
    }

    /**
     * Change background color
     * @param value
     */
    changeBackground(value) {
        this.sceneInstance.background.set(value);
    }

    /**
     * Set rain's fog
     */
    setSpecialFog() {
        this.sceneInstance.fog = new Fog(
            FOG_PROPS.SNOW.color,
            FOG_PROPS.SNOW.near,
            FOG_PROPS.SNOW.far,
        );
    }

    /**
     * Set default fog
     */
    setDefaultFog() {
        this.sceneInstance.fog = new Fog(
            FOG_PROPS.DEFAULT.color,
            FOG_PROPS.DEFAULT.near,
            FOG_PROPS.DEFAULT.far,
        );
    }

}

export default Scene