import Renderer from "./requiredObjects/Renderer.js";
import * as THREE from "three";
import Camera from "./requiredObjects/Camera.js";
import {CAMERA} from "./constants/CAMERA_TYPE.js";
import Scene from "./requiredObjects/Scene.js";
import Sizes from "./requiredObjects/Sizes.js";
import OrbitController from "./requiredObjects/OrbitController.js";

class Enforcer {
}

class Engine {
    static get instance() {
        if(!Enforcer._instance) {
            Enforcer._instance = new Engine(new Enforcer());
        }
        return Enforcer._instance;
    }

    constructor(enforcer) {
        if(!enforcer || !(enforcer instanceof Enforcer)) {
            throw new Error("Use Engine.instance!");
        }
        Enforcer._instance = this;
    }

    initialize() {
        //sizes
        this.sizes = new Sizes();
        this.sizes.initialize();

        //canvas
        this.canvas = document.getElementById('canvas');

        //renderer
        this.renderer = new Renderer();
        this.renderer.initialize(this.sizes.getInstance());

        //scene
        this.scene = new Scene();
        this.scene.initialize();

        //camera
        this.camera = new Camera(CAMERA.PERSPECTIVE);
        this.camera.initialize(this.sizes.getInstance());

        //orbitController
        this.orbitController = new OrbitController();
        this.orbitController.initialize();

        //tick fcn
        this.tick();
    }

    start() {
        const light = new THREE.AmbientLight();
        this.scene.addInScene(light);


        const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        const material = new THREE.MeshBasicMaterial();
        material.color.set("#ffffff");
        const cube = new THREE.Mesh( geometry, material );
        this.scene.addInScene( cube );

        this.camera.setPosition({x: 0, y: 1, z: 5});


        this.renderer.renderApp();
    }


    getScene() {
        return this.scene;
    }

    getCamera() {
        return this.camera;
    }

    getCanvas() {
        return this.canvas;
    }

    getRenderer() {
        return this.renderer;
    }

    getOrbitController() {
        return this.orbitController;
    }

    tick() {
        requestAnimationFrame(() => this.tick());
        this.orbitController.getInstance().update();
        this.renderer.renderApp();
    }


}

export default Engine