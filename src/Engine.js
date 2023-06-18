import Renderer from "./Renderer.js";
import * as THREE from "three";
import Camera from "./Camera.js";
import {CAMERA} from "./constants/CAMERA_TYPE.js";

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
        this.sizes = {
            width: window.innerWidth,
            height: window.innerHeight
        }
        this.canvas = document.getElementById('canvas');

        //renderer
        this.renderer = new Renderer(this.sizes);

        //scene
        this.scene = new THREE.Scene();

        //camera
        this.camera = new Camera(CAMERA.PERSPECTIVE, this.sizes);


        this._updateResize();
    }

    start() {
        const light = new THREE.AmbientLight();
        this.scene.add(light)


        const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        const material = new THREE.MeshBasicMaterial();
        material.color.set("#ffffff");
        const cube = new THREE.Mesh( geometry, material );
        this.scene.add( cube );

        this.camera.setPosition({x: 0,y: 1,z: 5});


        this.renderer.renderApp();
    }

    _updateResize() {
        window.addEventListener("resize", ()=> {
            this.sizes.height = window.innerHeight;
            this.sizes.width = window.innerWidth;

            this.camera.update();

            this.renderer.update();
        });
    }

    getScene() {
        return this.scene;
    }

    getCamera() {
        return this.camera.cameraInstance;
    }

    getCanvas() {
        return this.canvas;
    }

}

export default Engine