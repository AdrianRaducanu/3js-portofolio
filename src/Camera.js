import {PerspectiveCamera} from "three";
import {CAMERA} from "./constants/CAMERA_TYPE.js";

class Camera {
    constructor(type, sizes) {
        this.sizes = sizes;
        this.cameraInstance = this._returnCameraType(type);

    }

    _returnCameraType(type) {
        switch (type) {
            case CAMERA.PERSPECTIVE:
                return new PerspectiveCamera(85, this.sizes.width/this.sizes.height, 0.1, 100);
            default:
                return null;
        }
    }

    setPosition(pos) {
        this.cameraInstance.position.set(pos.x, pos.y, pos.z)
    }

    update() {
        this.cameraInstance.aspect = this.sizes.width / this.sizes.height;
        this.cameraInstance.updateProjectionMatrix();
    }
}

export default Camera;