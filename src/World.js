import WorldLight from "./worldObjects/objectClasses/WorldLight.js";
import {LIGHT_TYPE} from "./constants/LIGHT_TYPE.js";
import {
    AMBIENT_LIGHT_PROPS,
    DIRECTIONAL_LIGHT_PROPS,
    DIRECTIONAL_LIGHT_SHADOW_PROPS, DOWN_FACING_RAYCASTER, FRONT_FACING_RAYCASTER, JOB_DB_PROPS, JOB_WSS_PROPS
} from "./worldObjects/constants/PROPS.js";
import MainObject from "./worldObjects/MainObject.js";
import Landscape from "./worldObjects/Landscape.js";
import CustomRaycaster from "./worldObjects/CustomRaycaster.js";
import {JOBS_NAME, LIGHT_WITH_SHADOW} from "./worldObjects/constants/CONST.js";
import WorldAnimatedObject from "./worldObjects/objectClasses/WorldAnimatedObject.js";

class World {

    constructor() {}

    /**
     * Initialize world related objects
     */
    initialize() {
        //lights
        this._addLights();

        //raycaster
        this._addRaycaster();

        //addLandscape
        this._addLandscape();

        //mainObject model mockup
        this._addMainObject();

        //add other objects
        this._addOtherObjects();
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
        this.jobWSS.rotateOnLoop();
        this.jobDB.rotateOnLoop();
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
        this.mainObject = new MainObject("dora", this.downFacingRaycaster, this.frontFacingRaycaster);
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
    _addOtherObjects() {
        //db
        this.jobDB = new WorldAnimatedObject(JOBS_NAME.DB, this.frontFacingRaycaster, JOB_DB_PROPS);
        this.jobDB.initialize();

        //wss
        this.jobWSS = new WorldAnimatedObject(JOBS_NAME.WSS, this.frontFacingRaycaster, JOB_WSS_PROPS);
        this.jobWSS.initialize();
    }
}

export default World;