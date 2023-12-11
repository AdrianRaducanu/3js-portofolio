import Renderer from "./requiredObjects/Renderer.js";
import Camera from "./requiredObjects/Camera.js";
import {CAMERA} from "./constants/CAMERA_TYPE.js";
import Scene from "./requiredObjects/Scene.js";
import Sizes from "./requiredObjects/Sizes.js";
import OrbitController from "./requiredObjects/OrbitController.js";
import {REQUIRED_OBJECT_TYPES} from "./constants/OBJECT_TYPES.js";
import World from "./World.js";
import Debugger from "./utils/Debugger.js";
import {Clock, ColorManagement, DefaultLoadingManager} from "three";
import * as TWEEN from "@tweenjs/tween.js";

class Enforcer {
}

/**
 * Singleton, used as an engine for the entire app
 */
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

    /**
     * Initialize the main components of the app
     */
    initialize() {
        this._manageLoading();

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

        //freeze
        this.tickId = 0;
    }

    /**
     * Called after initialize
     */
    start() {
        this.camera.setPosition({x: 0, y: 3, z: 77});

        this.world.start();

        this.renderer.renderApp();
    }

    /**
     * Used to encapsulate class attributes
     */
    getRequiredObject(objectType) {
        switch (objectType) {
            case REQUIRED_OBJECT_TYPES.CANVAS:
                return this.canvas
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
            default:
                throw new Error("Wrong object type")
        }
    }

    /**
     * Used to encapsulate class attributes and return an instance
     */
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

    /**
     * Add obj in scene
     * @param obj
     */
    addInScene(obj) {
        this.scene.addInScene(obj);
    }

    /**
     * Move camera based on axis and a value
     * @param axis
     * @param value
     */
    moveCamera(axis, value) {
        this.camera.moveCamera(axis, value);
    }

    /**
     * Used for orbit controller
     * @param pos
     */
    setOrbitPosition(pos) {
        this.orbitController.setTarget(pos);
    }

    /**
     * Used for debugging
     * @param folderTitle
     * @param props
     * @param callback
     */
    createDebuggingFolder(folderTitle, props, callback) {
        this.debugger.createFolder(folderTitle, props, callback);
    }

    /**
     * Tick fcn used to animate things
     *
     * Out of memory error was due to using ".. = new .." on tick fcn
     */
    tick() {
        const elapsedTime = this.clock.getElapsedTime();
        const deltaTime = elapsedTime - this.previousTime;
        this.previousTime = elapsedTime;

        TWEEN.update();
        this.world.updateWorld(deltaTime, elapsedTime);
        this.renderer.renderApp();
        this.tickId = requestAnimationFrame(() => this.tick());
    }

    freezeApp() {
        cancelAnimationFrame(this.tickId);
    }

    unfreezeApp() {
        this.tickId = requestAnimationFrame(() => this.tick());
    }

    /**
     * This will start the app after all the models are loaded
     * in order to avoid [violation] requestAnimationFrame errors
     * @private
     */
    _manageLoading() {
        DefaultLoadingManager.onLoad = () => {
            Engine.instance.start();
            this.tick();
        }
    }

}

export default Engine