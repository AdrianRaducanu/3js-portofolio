import Renderer from "./requiredObjects/Renderer.js";
import Camera from "./requiredObjects/Camera.js";
import {CAMERA} from "./constants/CAMERA_TYPE.js";
import Scene from "./requiredObjects/Scene.js";
import Sizes from "./requiredObjects/Sizes.js";
import OrbitController from "./requiredObjects/OrbitController.js";
import {REQUIRED_OBJECTS_TYPE} from "./constants/REQUIRED_OBJECTS_TYPE.js";
import World from "./World.js";
import Debugger from "./utils/Debugger.js";

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

        //debugger
        this.debugger = new Debugger();
        this.debugger.initialize();

        //canvas
        this.canvas = document.getElementById('canvas');

        //renderer
        this.renderer = new Renderer();
        this.renderer.initialize();

        //scene
        this.scene = new Scene();
        this.scene.initialize();

        //camera
        this.camera = new Camera(CAMERA.PERSPECTIVE);
        this.camera.initialize();

        //orbitController
        this.orbitController = new OrbitController();
        this.orbitController.initialize();

        //the world
        this.world = new World();
        this.world.initialize();

        //tick fcn
        this.tick();
    }

    start() {
        this.world.start();

        this.camera.setPosition({x: 0, y: 1, z: 5});

        this.renderer.renderApp();
    }

    getCanvas() {
        return this.canvas;
    }

    getRequiredObject(objectType) {
        switch (objectType) {
            case REQUIRED_OBJECTS_TYPE.CAMERA:
                return this.camera;
            case REQUIRED_OBJECTS_TYPE.SIZES:
                return this.sizes;
            case REQUIRED_OBJECTS_TYPE.SCENE:
                return this.scene;
            case REQUIRED_OBJECTS_TYPE.RENDERER:
                return this.renderer;
            case REQUIRED_OBJECTS_TYPE.ORBIT_CONTROLLER:
                return this.orbitController;
            case REQUIRED_OBJECTS_TYPE.DEBUGGER:
                return this.debugger.getInstance();
            default:
                throw new Error("Wrong object type")
        }
    }

    getRequiredObjectInstance(objectType) {
        switch (objectType) {
            case REQUIRED_OBJECTS_TYPE.CAMERA:
                return this.camera.getInstance();
            case REQUIRED_OBJECTS_TYPE.SIZES:
                return this.sizes.getInstance();
            case REQUIRED_OBJECTS_TYPE.SCENE:
                return this.scene.getInstance();
            case REQUIRED_OBJECTS_TYPE.RENDERER:
                return this.renderer.getInstance();
            case REQUIRED_OBJECTS_TYPE.ORBIT_CONTROLLER:
                return this.orbitController.getInstance();
            case REQUIRED_OBJECTS_TYPE.DEBUGGER:
                return this.debugger.getInstance();
            default:
                throw new Error("Wrong object type");
        }
    }

    createDebuggingFolder(folderTitle, props, callback) {
        this.debugger.createFolder(folderTitle, props, callback);
    }

    tick() {
        requestAnimationFrame(() => this.tick());
        this.orbitController.getInstance().update();
        this.renderer.renderApp();
    }


}

export default Engine