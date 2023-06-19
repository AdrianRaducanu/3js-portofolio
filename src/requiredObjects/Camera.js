import {PerspectiveCamera} from "three";
import {CAMERA} from "../constants/CAMERA_TYPE.js";
import RequiredObjects from "./RequiredObjects.js";
import Engine from "../Engine.js";
import {REQUIRED_OBJECTS_TYPE} from "../constants/REQUIRED_OBJECTS_TYPE.js";

class Camera extends RequiredObjects{
    constructor(type) {
        super();
        this.cameraType = type;
    }

    initialize() {
        this.sizes = Engine.instance.getRequiredObjectInstance(REQUIRED_OBJECTS_TYPE.SIZES);
        this.cameraInstance = this._returnCameraType();
    }

    _returnCameraType() {
        switch (this.cameraType) {
            case CAMERA.PERSPECTIVE:
                return new PerspectiveCamera(90, this.sizes.width/this.sizes.height, 0.1, 1000);
            default:
                return null;
        }
    }

    setPosition(pos) {
        this.cameraInstance.position.set(pos.x, pos.y, pos.z);

        //need to do that so the orbitController could work
        const orbitController = Engine.instance.getRequiredObjectInstance(REQUIRED_OBJECTS_TYPE.ORBIT_CONTROLLER);
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