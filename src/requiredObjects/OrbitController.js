import RequiredObjects from "./RequiredObjects.js";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import Engine from "../Engine.js";
import {REQUIRED_OBJECTS_TYPE} from "../constants/REQUIRED_OBJECTS_TYPE.js";

class OrbitController extends RequiredObjects{
    constructor() {
        super();
    }

    initialize() {
        const camera = Engine.instance.getRequiredObjectInstance(REQUIRED_OBJECTS_TYPE.CAMERA);
        const renderer = Engine.instance.getRequiredObjectInstance(REQUIRED_OBJECTS_TYPE.RENDERER);
        this.orbitController = new OrbitControls(camera, renderer.domElement);
    }

    getInstance() {
        return this.orbitController;
    }
}

export default OrbitController;