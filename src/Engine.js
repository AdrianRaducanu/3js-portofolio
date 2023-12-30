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
import {SOUND_NAMES} from "./constants/SOUND_CONSTANTS.js";
import {TIME} from "./constants/DATE_AND_LOCATION.js";
import {getWeatherScenario, WEATHER_SCENARIOS} from "./constants/WEAHTER_CODES.js";

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
     *
     * @param canvas
     * @param weather
     * @param time
     */
    initialize(canvas, weather, time) {
        this._manageLoading();
        this.weather = weather;
        this.time = time;

        //canvas
        this.canvas = canvas;

        // ColorManagement.enabled = false;
        //sizes
        this.sizes = new Sizes();
        this.sizes.initialize();

        //debugger
        this.debugger = new Debugger();
        this.debugger.initialize();

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
     * Remove obj from scene
     * @param obj
     */
    removeFromScene(obj) {
        this.scene.removeFromScene(obj);
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
        requestAnimationFrame(() => this.tick());
    }

    /**
     * Called from API
     *
     * Will make the cat unable to move
     */
    freezeApp() {
        this.world.onFreeze();
    }

    /**
     * Called from API
     *
     * Will make the cat able to move
     */
    unfreezeApp() {
        this.world.onUnfreeze();
    }
    /**
     * This will start the app after all the models are loaded
     * in order to avoid [violation] requestAnimationFrame errors
     * @private
     */
    _manageLoading() {
        DefaultLoadingManager.onLoad = () => {
            Engine.instance.start();
            //will not be here since I dont start the app based on user info
            this._manageScenario(this.weather, this.time);
            this.tick();
        }
    }

    /**
     * Used to make music notes visible or not based on music
     * @param music
     */
    setMusicNotesVisibility(music) {
        if(music === SOUND_NAMES.PUYA) {
            this.world.setMusicNotesVisibility(true);
        } else {
            this.world.setMusicNotesVisibility(false);
        }
    }

    /**
     * Manage the scenarios
     * @param weather
     * @param time
     * @private
     */
    _manageScenario(weather, time) {
        if(time === TIME.NIGHT) {
            this._onDayTime();
        } else {
            this._onDayTime();
        }

        const weatherScenario = getWeatherScenario(weather);
        console.log(weatherScenario)
        switch (weatherScenario) {
            case WEATHER_SCENARIOS.CLEAR:
                this._onClearScenario();
                break;
            case WEATHER_SCENARIOS.SNOW:
                this._onSnowScenario();
                break;
            case WEATHER_SCENARIOS.LAVA:
                this._onLavaScenario();
                break;
            case WEATHER_SCENARIOS.RAIN:
                this._onSnowScenario();
                // setTimeout(() => {
                //     this._onRainScenario();
                // }, 5000)
                // setTimeout(() => {
                //     this._onClearScenario();
                // }, 10000)
                // setTimeout(() => {
                //     this._onLavaScenario();
                // }, 12000)
                break;
            case WEATHER_SCENARIOS.INVALID:
                this._onClearScenario();
                alert("Couldn't get your location, enjoy the clear scenario")
                break;
            default:
                break;
        }
    }

    /**
     * Change background of the scene
     * @param value
     */
    changeBackground(value) {
        this.scene.changeBackground(value);
    }

    /**
     * Called when night time scenario is selected
     * @private
     */
    _onNightTime() {
        console.log("is Night");
        this.world.onNightTime();
    }

    /**
     * Called when day time scenario is selected
     * @private
     */
    _onDayTime() {
        console.log("is Day");
        this.world.onDayTime();
    }

    /**
     * Called when sky is clear (no rain nor snow)
     * @private
     */
    _onClearScenario() {
        console.log("Is clear");
        this.world.onClear();
    }

    /**
     * Called when Lava scenario is selected
     * @private
     */
    _onLavaScenario() {
        console.log("Is LAVA!!");
        this.world.onLava();
    }

    /**
     * Called when snow scenario is selected
     * @private
     */
    _onSnowScenario() {
        console.log("Is snowing");
        this.world.onSnow();
    }

    /**
     * Called when rain scenario is selected
     * @private
     */
    _onRainScenario() {
        console.log("Is raining");
        this.world.onRain();
    }

}

export default Engine