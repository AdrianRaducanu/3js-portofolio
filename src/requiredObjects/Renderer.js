import * as THREE from "three";
import Engine from "../Engine.js";
import RequiredObjects from "./RequiredObjects.js";
import {REQUIRED_OBJECT_TYPES} from "../constants/OBJECT_TYPES.js";

class Renderer extends RequiredObjects{
    constructor() {
        super();
        this.rendererInstance = new THREE.WebGLRenderer({
            canvas: Engine.instance.getCanvas(),
            antialias: true
        });
    }

    initialize() {
        this.sizes = Engine.instance.getRequiredObjectInstance(REQUIRED_OBJECT_TYPES.SIZES);
        this.update();
    }

    renderApp() {
        const scene = Engine.instance.getRequiredObjectInstance(REQUIRED_OBJECT_TYPES.SCENE);
        const camera = Engine.instance.getRequiredObjectInstance(REQUIRED_OBJECT_TYPES.CAMERA);
        this.rendererInstance.render(scene, camera);
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