import {PerspectiveCamera} from "three";
import {CAMERA} from "../constants/CAMERA_TYPE.js";
import RequiredObjects from "./RequiredObjects.js";
import Engine from "../Engine.js";

class Camera extends RequiredObjects{
    constructor(type) {
        super();
        this.cameraType = type;
    }

    initialize(sizes) {
        this.sizes = sizes
        this.cameraInstance = this._returnCameraType();
    }

    _returnCameraType() {
        switch (this.cameraType) {
            case CAMERA.PERSPECTIVE:
                return new PerspectiveCamera(85, this.sizes.width/this.sizes.height, 0.1, 100);
            default:
                return null;
        }
    }

    setPosition(pos) {
        this.cameraInstance.position.set(pos.x, pos.y, pos.z);

        //need to do that so the orbitController could work
        const orbitController = Engine.instance.getOrbitController().getInstance();
        orbitController.update();
    }

    update() {
        this.cameraInstance.aspect = this.sizes.width / this.sizes.height;
        this.cameraInstance.updateProjectionMatrix();
    }

    getInstance() {
        return this.cameraInstance;
    }
}

export default Camera;