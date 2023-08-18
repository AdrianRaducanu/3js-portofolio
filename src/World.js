import {WORLD_OBJECT_GEOMETRIES, WORLD_OBJECT_MESH_TYPES} from "./constants/OBJECT_TYPES.js";
import WorldMesh from "./worldObjects/objectClasses/WorldMesh.js";
import WorldLight from "./worldObjects/objectClasses/WorldLight.js";
import {LIGHT_TYPE} from "./constants/LIGHT_TYPE.js";
import {
    AMBIENT_LIGHT_PROPS,
    DIRECTIONAL_LIGHT_PROPS,
    DIRECTIONAL_LIGHT_SHADOW_PROPS, MODEL_PROPS,
    PLANE_PROPS
} from "./worldObjects/constants/PROPS.js";
import MainObject from "./worldObjects/MainObject.js";
import {SHADOW_ACTION} from "./constants/SHADOW_ACTION.js";

class World {
    constructor() {
    }

    initialize() {
        //lights
        this._addLights();

        //plane
        this._addPlane();

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

        this.directionalLight = new WorldLight("World directional light", LIGHT_TYPE.DIRECTIONAL, DIRECTIONAL_LIGHT_PROPS, true);
        this.directionalLight.initialize();
        this.directionalLight.addShadow(DIRECTIONAL_LIGHT_SHADOW_PROPS);

    }

    _addPlane() {
        this.plane = new WorldMesh("Plane", WORLD_OBJECT_GEOMETRIES.PLANE, WORLD_OBJECT_MESH_TYPES.STANDARD, PLANE_PROPS);
        this.plane.initialize();
        this.plane.addShadow(SHADOW_ACTION.RECEIVE);
    }

    _addMainObject() {
        this.mainObject = new MainObject("dora", MODEL_PROPS);
        this.mainObject.initialize();
        // this.mainObject.addShadow();
    }


}

export default World;