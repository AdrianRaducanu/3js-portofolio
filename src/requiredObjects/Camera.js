import {PerspectiveCamera} from "three";
import {CAMERA} from "../constants/CAMERA_TYPE.js";
import RequiredObjects from "./RequiredObjects.js";
import Engine from "../Engine.js";
import {REQUIRED_OBJECT_TYPES} from "../constants/OBJECT_TYPES.js";
import {AXIS} from "../constants/UNITS.js";

class Camera extends RequiredObjects{
    constructor(type) {
        super();
        this.cameraType = type;
    }

    initialize() {
        this.sizes = Engine.instance.getRequiredObjectInstance(REQUIRED_OBJECT_TYPES.SIZES);
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
        const orbitController = Engine.instance.getRequiredObjectInstance(REQUIRED_OBJECT_TYPES.ORBIT_CONTROLLER);
        orbitController.update();
    }

    moveCamera(axis, value) {
        switch (axis) {
            case AXIS.Z:
                this.cameraInstance.position.z += value;
                break;
            case AXIS.X:
                this.cameraInstance.position.x += value;
                break
            case AXIS.Y:
                this.cameraInstance.position.y += value;
                break;
            default:
                break;
        }
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