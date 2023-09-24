import WorldLight from "./worldObjects/objectClasses/WorldLight.js";
import {LIGHT_TYPE} from "./constants/LIGHT_TYPE.js";
import {
    AMBIENT_LIGHT_PROPS,
    DIRECTIONAL_LIGHT_PROPS,
    DIRECTIONAL_LIGHT_SHADOW_PROPS, DIRECTIONAL_LIGHT_PROPS_2
} from "./worldObjects/constants/PROPS.js";
import MainObject from "./worldObjects/MainObject.js";
import Landscape from "./worldObjects/Landscape.js";
import RaycasterPoint from "./worldObjects/RaycasterPoint.js";
import {LIGHT_WITH_SHADOW} from "./worldObjects/constants/CONST.js";

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
    }

    start() {
    }

    updateWorld(delta) {
        this.mainObject.update(delta);
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
        this.landscape = new Landscape("landscape", this.raycaster);
        this.landscape.initialize();
    }

    _addMainObject() {
        this.mainObject = new MainObject("dora", this.raycaster);
        this.mainObject.initialize();
    }

    _addRaycaster() {
        this.raycaster = new RaycasterPoint();
    }


}

export default World;