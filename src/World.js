import {WORLD_OBJECT_GEOMETRIES, WORLD_OBJECT_MESH_TYPES} from "./constants/OBJECT_TYPES.js";
import UsualMesh from "./worldObjects/UsualMesh.js";
import Light from "./worldObjects/Light.js";
import {LIGHT_TYPE} from "./constants/LIGHT_TYPE.js";
import {AMBIENT_LIGHT_PROPS, BOX_PROPS, PLANE_PROPS} from "./worldObjects/PROPS.js";
import EventHandler from '../src/EventHandler';

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

    _addLights() {
        this.ambientLight = new Light("World ambient light", LIGHT_TYPE.AMBIENT, AMBIENT_LIGHT_PROPS);
        this.ambientLight.initialize();

    }

    _addPlane() {
        this.plane = new UsualMesh("Plane",WORLD_OBJECT_GEOMETRIES.PLANE, WORLD_OBJECT_MESH_TYPES.STANDARD, PLANE_PROPS);
        this.plane.initialize();
    }

    _addBox() {
        this.box = new UsualMesh("BOX", WORLD_OBJECT_GEOMETRIES.BOX, WORLD_OBJECT_MESH_TYPES.STANDARD, BOX_PROPS);
        this.box.initialize();
        EventHandler.instance.onKeyPress(1,2,3);
    }


}

export default World;