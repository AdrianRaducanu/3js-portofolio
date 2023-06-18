import RequiredObjects from "./RequiredObjects.js";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import Engine from "../Engine.js";

class OrbitController extends RequiredObjects{
    constructor() {
        super();
    }

    initialize() {
        const camera = Engine.instance.getCamera().getInstance();
        const renderer = Engine.instance.getRenderer().getInstance();
        this.orbitController = new OrbitControls(camera, renderer.domElement);
    }

    getInstance() {
        return this.orbitController;
    }
}

export default OrbitController;