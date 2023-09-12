import * as THREE from "three";
import Engine from "../Engine.js";
import RequiredObjects from "./RequiredObjects.js";
import {REQUIRED_OBJECT_TYPES} from "../constants/OBJECT_TYPES.js";
import {LinearSRGBColorSpace, PCFSoftShadowMap, SRGBColorSpace} from "three";
import {OutlineEffect} from "three/addons/effects/OutlineEffect.js";

class Renderer extends RequiredObjects{
    constructor() {
        super();
        this.rendererInstance = new THREE.WebGLRenderer({
            canvas: Engine.instance.getCanvas(),
            antialias: true
        });
    }

    initialize() {
        this.rendererInstance.shadowMap.enabled = true;
        this.rendererInstance.shadowMap.type = PCFSoftShadowMap;
        // this.rendererInstance.outputColorSpace = ColorSpace;
        this.sizes = Engine.instance.getRequiredObjectInstance(REQUIRED_OBJECT_TYPES.SIZES);
        this.sceneInstance = Engine.instance.getRequiredObjectInstance(REQUIRED_OBJECT_TYPES.SCENE);
        this.cameraInstance = Engine.instance.getRequiredObjectInstance(REQUIRED_OBJECT_TYPES.CAMERA);
        this.update();
    }

    renderApp() {
        const params = {};
        this.outline = new OutlineEffect(this.rendererInstance, params);
        this.outline.render(this.sceneInstance, this.cameraInstance);
    }

    update() {
        this.rendererInstance.setSize(this.sizes.width, this.sizes.height)
        this.rendererInstance.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    getInstance() {
        return this.rendererInstance;
    }

}

export default Renderer;