import WorldLight from "./worldObjects/objectClasses/WorldLight.js";
import {LIGHT_TYPE} from "./constants/LIGHT_TYPE.js";
import {
    AMBIENT_LIGHT_PROPS,
    DIRECTIONAL_LIGHT_PROPS,
    DIRECTIONAL_LIGHT_PROPS_2,
    DIRECTIONAL_LIGHT_SHADOW_PROPS,
    DOWN_FACING_RAYCASTER,
    EASTER_EGG_PROP,
    FRONT_FACING_RAYCASTER,
    JOB_DB_PROPS,
    JOB_WSS_PROPS, PICKUP_PROP, QUESTION_MARK_PROP
} from "./worldObjects/constants/PROPS.js";
import MainObject from "./worldObjects/MainObject.js";
import Landscape from "./worldObjects/Landscape.js";
import CustomRaycaster from "./worldObjects/CustomRaycaster.js";
import {JOBS_NAME, LIGHT_WITH_SHADOW} from "./worldObjects/constants/CONST.js";
import WorldAnimatedObject from "./worldObjects/objectClasses/WorldAnimatedObject.js";
import Firefly from "./worldObjects/Firefly.js";
import MusicNotes from "./worldObjects/MusicNotes.js";

class World {

    constructor() {}

    /**
     * Initialize world related objects
     */
    initialize() {
        this._addLights();

        this._addRaycaster();

        this._addLandscape();

        this._addFireFlies();

        this._addJobs();

        this._addEasterEgg();

        this._addMusicObjects();

        this._addMainObject();
    }

    start() {}

    /**
     * Based on tick fnc in engine, animate world objects
     * @param delta
     * @param elapsedTime
     */
    updateWorld(delta, elapsedTime) {
        this.mainObject.update(delta);
        this.landscape.update(elapsedTime);
        this.jobWSS.update(delta);
        this.jobDB.update(delta);
        this.easterEgg.update(delta);
        this.questionMark.update(delta);
        this.fireflies.update(elapsedTime);
        this.musicNotes.update(elapsedTime);
    }

    /**
     * Create and add lights to the scene
     * @private
     */
    _addLights() {
        this.ambientLight = new WorldLight("World ambient light", LIGHT_TYPE.AMBIENT, AMBIENT_LIGHT_PROPS);
        this.ambientLight.initialize();

        this.directionalLight = new WorldLight("World directional light", LIGHT_TYPE.DIRECTIONAL, DIRECTIONAL_LIGHT_PROPS, LIGHT_WITH_SHADOW);
        this.directionalLight.initialize();
        this.directionalLight.addShadow(DIRECTIONAL_LIGHT_SHADOW_PROPS);

        // this.directionalLight = new WorldLight("World directional light 2", LIGHT_TYPE.DIRECTIONAL, DIRECTIONAL_LIGHT_PROPS_2);
        // this.directionalLight.initialize();
    }

    /**
     * Will create and add landscape
     * @private
     */
    _addLandscape() {
        this.landscape = new Landscape("landscape", this.downFacingRaycaster);
        this.landscape.initialize();
    }

    /**
     * Will create and add the cat
     *
     * Being the main objects, the cat should contain multiple raycasters in order to be aware of
     * the interation with other objects
     * @private
     */
    _addMainObject() {
        const otherObjects = {
            fireflies: this.fireflies,
            jobWSS: this.jobWSS,
            jobDB: this.jobDB,
            easterEgg: this.easterEgg,
            questionMark: this.questionMark,
            musicNotes: this.musicNotes,
            pickup: this.pickup
        }
        this.mainObject = new MainObject("dora", this.downFacingRaycaster, this.frontFacingRaycaster, otherObjects);
        this.mainObject.initialize();
    }

    /**
     * Creates all the raycasters
     *
     * DownFacing - used in order to constrain the area of walking
     * FrontFacing - used in order to be aware of the objects that the cat is looking at
     * @private
     */
    _addRaycaster() {
        this.downFacingRaycaster = new CustomRaycaster(DOWN_FACING_RAYCASTER.ORIGIN, DOWN_FACING_RAYCASTER.DIRECTION);
        this.frontFacingRaycaster = new CustomRaycaster(FRONT_FACING_RAYCASTER.ORIGIN, FRONT_FACING_RAYCASTER.DIRECTION);
    }

    /**
     * Will create and add other world objects (only jobs for now)
     * @private
     */
    _addJobs() {
        //db
        this.jobDB = new WorldAnimatedObject(JOBS_NAME.DB, JOB_DB_PROPS, this.frontFacingRaycaster);
        this.jobDB.initialize();

        //wss
        this.jobWSS = new WorldAnimatedObject(JOBS_NAME.WSS, JOB_WSS_PROPS, this.frontFacingRaycaster);
        this.jobWSS.initialize();
    }

    /**
     * Will create and add fireflies
     * @private
     */
    _addFireFlies() {
        this.fireflies = new Firefly("firefly");
        this.fireflies.initialize();
    }

    _addEasterEgg() {
        this.easterEgg = new WorldAnimatedObject("easter-egg", EASTER_EGG_PROP, this.frontFacingRaycaster);
        this.easterEgg.initialize();

        this.questionMark = new WorldAnimatedObject("question-mark", QUESTION_MARK_PROP, this.frontFacingRaycaster);
        this.questionMark.initialize();
    }

    _addMusicObjects() {
        this.pickup = new WorldAnimatedObject("pickup", PICKUP_PROP, this.frontFacingRaycaster);
        this.pickup.initialize();

        this.musicNotes = new MusicNotes("notes");
        this.musicNotes.initialize();
    }
}

export default World;