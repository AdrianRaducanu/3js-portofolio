import RequiredObjects from "./RequiredObjects.js";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import Engine from "../Engine.js";
import {REQUIRED_OBJECT_TYPES} from "../constants/OBJECT_TYPES.js";

class OrbitController extends RequiredObjects{
    constructor() {
        super();
    }

    initialize() {
        const camera = Engine.instance.getRequiredObjectInstance(REQUIRED_OBJECT_TYPES.CAMERA);
        const renderer = Engine.instance.getRequiredObjectInstance(REQUIRED_OBJECT_TYPES.RENDERER);
        this.orbitController = new OrbitControls(camera, renderer.domElement);

        this._setupOrbitProps();
    }

    getInstance() {
        return this.orbitController;
    }

    update() {
        this.orbitController.update();
    }

    setTarget(pos) {
        this.orbitController.target = pos;
    }

    _setupOrbitProps() {
        this.orbitController.minDistance = 2;
        this.orbitController.maxDistance = 15;

        this.orbitController.maxPolarAngle = Math.PI / 2;
    }
}

export default OrbitController;