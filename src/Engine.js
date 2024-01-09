import Renderer from "./requiredObjects/Renderer.js";
import Camera from "./requiredObjects/Camera.js";
import {CAMERA} from "./constants/CAMERA_TYPE.js";
import Scene from "./requiredObjects/Scene.js";
import Sizes from "./requiredObjects/Sizes.js";
import {REQUIRED_OBJECT_TYPES} from "./constants/OBJECT_TYPES.js";
import World from "./World.js";
import {Clock, DefaultLoadingManager} from "three";
import * as TWEEN from "@tweenjs/tween.js";
import {TIME} from "./constants/DATE_AND_LOCATION.js";
import {WEATHER_SCENARIOS} from "./constants/WEAHTER_CODES.js";
import {Manager} from "./Manager.js";
import {SOUND_NAMES} from "./constants/SOUND_CONSTANTS.js";
import {CAMERA_ANGLE, CAMERA_OFFSET, STARTING_POSITION} from "./worldObjects/constants/CONST.js";

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
     */
    initialize(canvas) {
        this._manageLoading();

        //canvas
        this.canvas = canvas;

        //sizes
        this.sizes = new Sizes();
        this.sizes.initialize();

        //scene
        this.scene = new Scene();
        this.scene.initialize();

        //camera
        this.camera = new Camera(CAMERA.PERSPECTIVE);
        this.camera.initialize();

        //renderer
        this.renderer = new Renderer();
        this.renderer.initialize();

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
        this.camera.setPosition({
            x: STARTING_POSITION.X + Math.sin(CAMERA_ANGLE) * CAMERA_OFFSET.X,
            y: STARTING_POSITION.Y + CAMERA_OFFSET.Y,
            z: STARTING_POSITION.Z + Math.cos(CAMERA_ANGLE) * CAMERA_OFFSET.Z
        });

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
     * Rotate camera when main object is rotating
     * @param value
     * @param mainX
     * @param mainZ
     */
    rotateCamera(value, mainX, mainZ) {
        this.camera.rotate(value, mainX, mainZ);
    }

    /**
     * Tween camera for when entering or exiting the cave
     * @param isInCave
     */
    tweenCamera(isInCave) {
        this.camera.tweenCamera(isInCave);
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
     * Called from Manager
     *
     * Will make the cat unable to move
     */
    freezeApp() {
        this.world.onFreeze();
    }

    /**
     * Called from Manager
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
        DefaultLoadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
            Manager.showLoadingInfo(itemsTotal);
        }
        DefaultLoadingManager.onLoad = () => {
            Engine.instance.start();

            //this in order to not starting the game without training
            Engine.instance.freezeApp();
            Manager.muteAllSounds();
            //will not be here since I dont start the app based on user info
            Manager.changeWeatherScenario(SOUND_NAMES.LAVA, WEATHER_SCENARIOS.LAVA, true);
            Manager.changeTimeScenario(TIME.NIGHT);
            Manager.finishLoading();
            this.tick();
        }
        DefaultLoadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
            console.log(url, itemsLoaded, itemsTotal)
            Manager.updateLoadingInfo(itemsLoaded);
        }
    }

    /**
     * Used to make music notes visible or not based on music
     * @param flag
     */
    setMusicNotesVisibility(flag) {
        this.world.setMusicNotesVisibility(flag);
    }

    /**
     * Manage the scenarios
     * @param weather
     * @param time
     * @private
     */
    manageScenario(weather, time) {
        if(time === TIME.NIGHT) {
            this.onNightTime();
        } else {
            this.onDayTime();
        }
        switch (weather) {
            case WEATHER_SCENARIOS.CLEAR:
                this.onClearScenario();
                break;
            case WEATHER_SCENARIOS.SNOW:
                this.onSnowScenario(time === TIME.DAY);
                break;
            case WEATHER_SCENARIOS.LAVA:
                this.onLavaScenario();
                break;
            case WEATHER_SCENARIOS.RAIN:
                this.onRainScenario();
                break;
            case WEATHER_SCENARIOS.INVALID:
                this.onClearScenario();
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
     * @public
     */
    onNightTime() {
        // console.log("is Night");
        this.world.onNightTime();
    }

    /**
     * Called when day time scenario is selected
     * @public
     */
    onDayTime() {
        // console.log("is Day");
        this.world.onDayTime();
    }

    /**
     * Called when sky is clear (no rain nor snow)
     * @public
     */
    onClearScenario() {
        // console.log("Is clear");
        this.world.onClear();
        this.scene.setDefaultFog();
    }

    /**
     * Called when Lava scenario is selected
     * @public
     */
    onLavaScenario() {
        // console.log("Is LAVA!!");
        this.world.onLava();
        this.scene.setDefaultFog();
    }

    /**
     * Called when snow scenario is selected
     * @public
     */
    onSnowScenario(isFog) {
        // console.log("Is snowing");
        this.world.onSnow();
        if(isFog) {
            this.scene.setSpecialFog();
        } else {
            this.scene.setDefaultFog();
        }
    }

    /**
     * Called when rain scenario is selected
     * @public
     */
    onRainScenario() {
        // console.log("Is raining");
        this.world.onRain();
        this.scene.setDefaultFog();
    }

    /**
     * Called when cat should change its visibility
     * @param bool
     */
    setCatVisible(bool) {
        this.world.setCatVisible(bool);
    }

}

export default Engine