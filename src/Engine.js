import Renderer from "./requiredObjects/Renderer.js";
import Camera from "./requiredObjects/Camera.js";
import {CAMERA} from "./constants/CAMERA_TYPE.js";
import Scene from "./requiredObjects/Scene.js";
import Sizes from "./requiredObjects/Sizes.js";
import OrbitController from "./requiredObjects/OrbitController.js";
import {REQUIRED_OBJECT_TYPES} from "./constants/OBJECT_TYPES.js";
import World from "./World.js";
import Debugger from "./utils/Debugger.js";
import {Clock, ColorManagement} from "three";

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
        // ColorManagement.enabled = false;
        //sizes
        this.sizes = new Sizes();
        this.sizes.initialize();

        //debugger
        this.debugger = new Debugger();
        this.debugger.initialize();

        //canvas
        this.canvas = document.getElementById('canvas');

        //scene
        this.scene = new Scene();
        this.scene.initialize();

        //camera
        this.camera = new Camera(CAMERA.PERSPECTIVE);
        this.camera.initialize();

        //renderer
        this.renderer = new Renderer();
        this.renderer.initialize();

        //orbitController
        this.orbitController = new OrbitController();
        this.orbitController.initialize();

        //the world
        this.world = new World();
        this.world.initialize();

        //tick fcn
        this.previousTime = 0;
        this.clock = new Clock();
        this.tick();
    }

    start() {
        this.camera.setPosition({x: 0, y: 3, z: 77});

        this.world.start();

        this.renderer.renderApp();
    }

    getCanvas() {
        return this.canvas;
    }

    getRequiredObject(objectType) {
        switch (objectType) {
            case REQUIRED_OBJECT_TYPES.CAMERA:
                return this.camera;
            case REQUIRED_OBJECT_TYPES.SIZES:
                return this.sizes;
            case REQUIRED_OBJECT_TYPES.SCENE:
                return this.scene;
            case REQUIRED_OBJECT_TYPES.RENDERER:
                return this.renderer;
            case REQUIRED_OBJECT_TYPES.ORBIT_CONTROLLER:
                return this.orbitController;
            case REQUIRED_OBJECT_TYPES.DEBUGGER:
                return this.debugger.getInstance();
            default:
                throw new Error("Wrong object type")
        }
    }

    getRequiredObjectInstance(objectType) {
        switch (objectType) {
            case REQUIRED_OBJECT_TYPES.CAMERA:
                return this.camera.getInstance();
            case REQUIRED_OBJECT_TYPES.SIZES:
                return this.sizes.getInstance();
            case REQUIRED_OBJECT_TYPES.SCENE:
                return this.scene.getInstance();
            case REQUIRED_OBJECT_TYPES.RENDERER:
                return this.renderer.getInstance();
            case REQUIRED_OBJECT_TYPES.ORBIT_CONTROLLER:
                return this.orbitController.getInstance();
            case REQUIRED_OBJECT_TYPES.DEBUGGER:
                return this.debugger.getInstance();
            default:
                throw new Error("Wrong object type");
        }
    }

    addInScene(obj) {
        this.scene.addInScene(obj);
    }

    moveCamera(axis, value) {
        this.camera.moveCamera(axis, value);
    }

    setOrbitPosition(pos) {
        this.orbitController.setTarget(pos);
    }

    createDebuggingFolder(folderTitle, props, callback) {
        this.debugger.createFolder(folderTitle, props, callback);
    }

    tick() {
        const elapsedTime = this.clock.getElapsedTime();
        const deltaTime = elapsedTime - this.previousTime;
        this.previousTime = elapsedTime;

        this.world.updateWorld(deltaTime, elapsedTime);
        this.renderer.renderApp();
        requestAnimationFrame(() => this.tick());
    }


}

export default Engine