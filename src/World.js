import WorldLight from "./worldObjects/objectClasses/WorldLight.js";
import {LIGHT_TYPE} from "./constants/LIGHT_TYPE.js";
import {
    AMBIENT_LIGHT_PROPS,
    DIRECTIONAL_LIGHT_PROPS,
    DIRECTIONAL_LIGHT_SHADOW_PROPS, DOWN_FACING_RAYCASTER, FRONT_FACING_RAYCASTER
} from "./worldObjects/constants/PROPS.js";
import MainObject from "./worldObjects/MainObject.js";
import Landscape from "./worldObjects/Landscape.js";
import CustomRaycaster from "./worldObjects/CustomRaycaster.js";
import {LIGHT_WITH_SHADOW} from "./worldObjects/constants/CONST.js";
import AnimatedObject from "./worldObjects/AnimatedObject.js";

class World {
    constructor() {
    }

    initialize() {
        //lights
        this._addLights();

        //raycaster
        this._addRaycaster();

        //addLandscape
        this._addLandscape();

        //mainObject model mockup
        this._addMainObject();

        this._addOtherObjects();
    }

    start() {
    }

    updateWorld(delta, elapsedTime) {
        this.mainObject.update(delta);
        this.landscape.update(elapsedTime);
        this.jobWSS.rotateAnimatedNode();
        this.jobDB.rotateAnimatedNode();
    }

    _addLights() {
        this.ambientLight = new WorldLight("World ambient light", LIGHT_TYPE.AMBIENT, AMBIENT_LIGHT_PROPS);
        this.ambientLight.initialize();

        this.directionalLight = new WorldLight("World directional light", LIGHT_TYPE.DIRECTIONAL, DIRECTIONAL_LIGHT_PROPS, LIGHT_WITH_SHADOW);
        this.directionalLight.initialize();
        this.directionalLight.addShadow(DIRECTIONAL_LIGHT_SHADOW_PROPS);

        // this.directionalLight = new WorldLight("World directional light 2", LIGHT_TYPE.DIRECTIONAL, DIRECTIONAL_LIGHT_PROPS_2);
        // this.directionalLight.initialize();

    }

    _addLandscape() {
        this.landscape = new Landscape("landscape", this.downFacingRaycaster);
        this.landscape.initialize();
    }

    _addMainObject() {
        this.mainObject = new MainObject("dora", this.downFacingRaycaster, this.frontFacingRaycaster);
        this.mainObject.initialize();
    }

    _addRaycaster() {
        this.downFacingRaycaster = new CustomRaycaster(DOWN_FACING_RAYCASTER.ORIGIN, DOWN_FACING_RAYCASTER.DIRECTION);
        this.frontFacingRaycaster = new CustomRaycaster(FRONT_FACING_RAYCASTER.ORIGIN, FRONT_FACING_RAYCASTER.DIRECTION);
    }

    _addOtherObjects() {
        const jobDBProps = {
            position: {
                x: -88,
                z: 20
            }
        }
        this.jobDB = new AnimatedObject("db", this.frontFacingRaycaster, jobDBProps);
        this.jobDB.initialize();

        //wss
        const jobWSSProps = {
            position: {
                x: -81,
                z: 37
            },
            rotation: {
                y: Math.PI / 3
            }
        }
        this.jobWSS = new AnimatedObject("wss", this.frontFacingRaycaster, jobWSSProps);
        this.jobWSS.initialize();
    }

}

export default World;