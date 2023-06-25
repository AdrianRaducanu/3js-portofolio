import {WORLD_OBJECT_GEOMETRIES, WORLD_OBJECT_MESH_TYPES} from "./constants/OBJECT_TYPES.js";
import UsualMesh from "./worldObjects/UsualMesh.js";
import Light from "./worldObjects/Light.js";
import {LIGHT_TYPE} from "./constants/LIGHT_TYPE.js";

class World {
    constructor() {
    }

    initialize() {
        //lights
        this._addLights();

        //plane
        this._addPlane();
    }

    start() {

    }

    _addLights() {
        const ambientLightProps = {
            color: "#404040",
            intensity: 1
        }
        this.ambientLight = new Light("World ambient light", LIGHT_TYPE.AMBIENT, ambientLightProps);
        this.ambientLight.initialize();

        const directionalLightProps = {
            color: "#ff2200",
            intensity: 5,
            position: {
                x: -10,
                y: 5,
                z: 2
            }
        }
        this.directionalLight = new Light("World directional light", LIGHT_TYPE.DIRECTIONAL, directionalLightProps);
        this.directionalLight.initialize();

        const pointLightProps = {
            color: "#33ff11",
            intensity: 1,
            distance: 2,
            decay: 2,
            position: {
                x: 3,
                y: 1,
                z: -2
            }
        }
        this.pointLight = new Light("World point light", LIGHT_TYPE.POINT, pointLightProps);
        this.pointLight.initialize();
    }

    _addPlane() {
        const planeProps = {
            width: 10,
            height: 10,
            color: "#317b18"
        }
        this.plane = new UsualMesh("Plane",WORLD_OBJECT_GEOMETRIES.PLANE, WORLD_OBJECT_MESH_TYPES.STANDARD, planeProps);
        this.plane.initialize();
    }
}

export default World;