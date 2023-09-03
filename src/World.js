import WorldLight from "./worldObjects/objectClasses/WorldLight.js";
import {LIGHT_TYPE} from "./constants/LIGHT_TYPE.js";
import {
    AMBIENT_LIGHT_PROPS,
    DIRECTIONAL_LIGHT_PROPS,
    DIRECTIONAL_LIGHT_SHADOW_PROPS, MODEL_PROPS, TERRAIN_PROPS
} from "./worldObjects/constants/PROPS.js";
import MainObject from "./worldObjects/MainObject.js";
import Landscape from "./worldObjects/Landscape.js";

class World {
    constructor() {
    }

    initialize() {
        //lights
        this._addLights();

        //mainObject model mockup
        this._addMainObject();

        //addTerrain
        this._addTerrain();
    }

    start() {
    }

    updateWorld(delta) {
        this.mainObject.update(delta);
    }

    _addLights() {
        this.ambientLight = new WorldLight("World ambient light", LIGHT_TYPE.AMBIENT, AMBIENT_LIGHT_PROPS);
        this.ambientLight.initialize();

        this.directionalLight = new WorldLight("World directional light", LIGHT_TYPE.DIRECTIONAL, DIRECTIONAL_LIGHT_PROPS, true);
        this.directionalLight.initialize();
        this.directionalLight.addShadow(DIRECTIONAL_LIGHT_SHADOW_PROPS);

    }

    _addTerrain() {
        this.terrain = new Landscape("Landscape", TERRAIN_PROPS);
        this.terrain.initialize();
    }

    _addMainObject() {
        this.mainObject = new MainObject("dora", MODEL_PROPS);
        this.mainObject.initialize();
    }


}

export default World;