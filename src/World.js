import {WORLD_OBJECT_GEOMETRIES, WORLD_OBJECT_MESH_TYPES} from "./constants/OBJECT_TYPES.js";
import UsualMesh from "./worldObjects/UsualMesh.js";
import Light from "./worldObjects/Light.js";
import {LIGHT_TYPE} from "./constants/LIGHT_TYPE.js";
import {
    AMBIENT_LIGHT_PROPS,
    BOX_PROPS,
    DIRECTIONAL_LIGHT_PROPS,
    DIRECTIONAL_LIGHT_SHADOW_PROPS,
    PLANE_PROPS
} from "./worldObjects/PROPS.js";
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

        //box model mockup
        this._addBox();
    }

    start() {
    }

    updateWorld() {
        this.box.updatePosition();
    }

    _addLights() {
        this.ambientLight = new Light("World ambient light", LIGHT_TYPE.AMBIENT, AMBIENT_LIGHT_PROPS);
        this.ambientLight.initialize();

        this.directionalLight = new Light("World directional light", LIGHT_TYPE.DIRECTIONAL, DIRECTIONAL_LIGHT_PROPS, true);
        this.directionalLight.initialize();
        this.directionalLight.addShadow(DIRECTIONAL_LIGHT_SHADOW_PROPS);

    }

    _addPlane() {
        this.plane = new UsualMesh("Plane", WORLD_OBJECT_GEOMETRIES.PLANE, WORLD_OBJECT_MESH_TYPES.STANDARD, PLANE_PROPS);
        this.plane.initialize();
        this.plane.addShadow(SHADOW_ACTION.RECEIVE);
    }

    _addBox() {
        this.box = new MainObject("BOX", WORLD_OBJECT_GEOMETRIES.BOX, WORLD_OBJECT_MESH_TYPES.STANDARD, BOX_PROPS);
        this.box.initialize();
        this.box.addShadow(SHADOW_ACTION.CAST)
    }


}

export default World;