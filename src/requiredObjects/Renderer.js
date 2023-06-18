import * as THREE from "three";
import Engine from "../Engine.js";
import RequiredObjects from "./RequiredObjects.js";

class Renderer extends RequiredObjects{
    constructor() {
        super();
        this.rendererInstance = new THREE.WebGLRenderer({
            canvas: Engine.instance.getCanvas(),
            antialias: true
        });
    }

    initialize(sizes) {
        this.sizes = sizes;
        this.update();
    }

    renderApp() {
        const scene = Engine.instance.getScene();
        const camera = Engine.instance.getCamera();
        this.rendererInstance.render(scene.getInstance(), camera.getInstance());
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