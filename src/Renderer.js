import * as THREE from "three";
import Engine from "./Engine.js";

class Renderer {
    constructor(sizes) {
        this.sizes = sizes;
        this.rendererInstance = new THREE.WebGLRenderer({
            canvas: Engine.instance.getCanvas(),
            antialias: true
        });
        this.update();
    }


    renderApp() {
        const scene = Engine.instance.getScene();
        const camera = Engine.instance.getCamera();
        this.rendererInstance.render(scene, camera);
        console.log(this.rendererInstance)
    }

    update() {
        this.rendererInstance.setSize(this.sizes.width, this.sizes.height)
        this.rendererInstance.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

}

export default Renderer;