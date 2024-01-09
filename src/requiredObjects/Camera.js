import {PerspectiveCamera} from "three";
import {CAMERA} from "../constants/CAMERA_TYPE.js";
import RequiredObjects from "./RequiredObjects.js";
import Engine from "../Engine.js";
import {REQUIRED_OBJECT_TYPES} from "../constants/OBJECT_TYPES.js";
import {AXIS} from "../constants/UNITS.js";
import {CAMERA_OFFSET} from "../worldObjects/constants/CONST.js";
import {Tween} from "@tweenjs/tween.js";
import {Easing} from "three/addons/libs/tween.module.js";

class Camera extends RequiredObjects{
    constructor(type) {
        super();
        this.cameraType = type;
        this.angle = 0;
        this.isInCave = false;
    }

    /**
     * Called from outside of this class
     */
    initialize() {
        this.sizes = Engine.instance.getRequiredObjectInstance(REQUIRED_OBJECT_TYPES.SIZES);
        this.cameraInstance = this._returnCameraType();
    }

    /**
     * Creates camera based on type provided
     * @returns {PerspectiveCamera|null}
     * @private
     */
    _returnCameraType() {
        switch (this.cameraType) {
            case CAMERA.PERSPECTIVE:
                return new PerspectiveCamera(60, this.sizes.width/this.sizes.height, 0.1, 1000);
            default:
                return null;
        }
    }

    /**
     * Set camera position
     * @param pos
     */
    setPosition(pos) {
        this.cameraInstance.position.set(pos.x, pos.y, pos.z);
    }

    /**
     * Move camera based on main obj
     * @param axis
     * @param value
     */
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

    /**
     * Update camera on resize
     */
    update() {
        this.cameraInstance.aspect = this.sizes.width / this.sizes.height;
        this.cameraInstance.updateProjectionMatrix();
    }

    /**
     * Return camera instance
     * @returns {*}
     */
    getInstance() {
        return this.cameraInstance;
    }

    /**
     * When camera is rotated, beside the rotation on Y, it should move (trigonometric stuff)
     * @param value
     * @param mainX
     * @param mainZ
     */
    rotate(value, mainX, mainZ) {
        this.angle +=value;
        this.cameraInstance.rotation.y += value;

        if(!this.isInCave) {
            this.cameraInstance.position.set(
                mainX + Math.sin(this.angle) * CAMERA_OFFSET.X,
                CAMERA_OFFSET.Y,
                mainZ + Math.cos(this.angle) * CAMERA_OFFSET.Z,
            );
        }
    }

    /**
     * Tween animation from 3rd person to first person
     *
     * Freeze the app until the tween animation is done
     * @private
     */
    _enterCave() {
        const tween = new Tween(this.cameraInstance.position)
            .to({
                x: this.cameraInstance.position.x - Math.sin(this.angle) * CAMERA_OFFSET.X,
                y: CAMERA_OFFSET.Y,
                z: this.cameraInstance.position.z - Math.cos(this.angle) * CAMERA_OFFSET.Z
            }, 500)
            .easing(Easing.Quadratic.In)
            .onComplete(() => {
                Engine.instance.unfreezeApp()
                Engine.instance.setCatVisible(false);
            })
        tween.start();
    }

    /**
     * Tween animation from 3rd person to first person
     *
     * Freeze the app until the tween animation is done
     * @private
     */
    _exitCave() {
        const tween = new Tween(this.cameraInstance.position)
            .to({
                x: this.cameraInstance.position.x + Math.sin(this.angle) * CAMERA_OFFSET.X,
                y: CAMERA_OFFSET.Y,
                z: this.cameraInstance.position.z + Math.cos(this.angle) * CAMERA_OFFSET.Z
            }, 500)
            .easing(Easing.Quadratic.Out)
            .onComplete(() => {
                Engine.instance.unfreezeApp();

            });
        tween.start();
        Engine.instance.setCatVisible(true);
    }

    //TODO: there is a small offset when exit the cave and rotate

    /**
     * Called from outside of this class
     * @param isInCave
     */
    tweenCamera(isInCave) {
        Engine.instance.freezeApp();
        if(isInCave) {
            this._enterCave();
        } else {
            this._exitCave();
        }
        this.isInCave = isInCave;
    }
}

export default Camera;