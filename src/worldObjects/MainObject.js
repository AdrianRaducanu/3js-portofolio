import {KEYBOARD_CODES} from "../constants/KEYBOARD_CODES.js";
import Engine from "../Engine.js";
import {AXIS, MOVING_UNIT, ROTATION_UNIT} from "../constants/UNITS.js";
import WorldModel from "./objectClasses/WorldModel.js";
import {Vector3} from "three";

class MainObject extends WorldModel{
    constructor(name, props) {
        super(name, props);
        this.moveController = {
            up: false,
            down: false,
            left: false,
            right: false
        }
    }

    initialize() {
        super.importModel(this.name, () => this.callbackAfterModelLoad())
    }

    callbackAfterModelLoad() {
        this._keyListener();

        //set orbit controller to gravitate around the main object
        Engine.instance.setOrbitPosition(new Vector3(0, 0, 0));
    }

    _keyListener() {
        window.addEventListener('keydown', (event) => {
            switch (event.code) {
                case KEYBOARD_CODES.KEY_W:
                    this.playAnimationByName("Run");
                    this.moveController.down = false;
                    this.moveController.up = true;
                    break;
                case KEYBOARD_CODES.KEY_S:
                    this.moveController.up = false;
                    this.moveController.down = true;
                    break;
                case KEYBOARD_CODES.KEY_A:
                    this.moveController.right = false;
                    this.moveController.left = true;
                    break;
                case KEYBOARD_CODES.KEY_D:
                    this.moveController.left = false;
                    this.moveController.right = true;
                    break;
                default:
                    break;
            }
        });

        window.addEventListener('keyup', (event) => {
            switch (event.code) {
                case KEYBOARD_CODES.KEY_W:
                    this.stopAnimationByName("Run");
                    this.moveController.up = false;
                    break;
                case KEYBOARD_CODES.KEY_S:
                    this.moveController.down = false;
                    break;
                case KEYBOARD_CODES.KEY_A:
                    this.moveController.left = false;
                    break;
                case KEYBOARD_CODES.KEY_D:
                    this.moveController.right = false;
                    break;
                default:
                    break;
            }
        })
    }

    update(delta) {
        this._updatePosition();
        this.updateMixer(delta);
    }

    _updatePosition() {
        if(this.moveController.up) {
            this._move();
        }
        if(this.moveController.down) {
            // here will put sit-down animation
        }
        if(this.moveController.left) {
            this.modelInstance.rotation.y += ROTATION_UNIT;
        }
        if(this.moveController.right) {
            this.modelInstance.rotation.y -= ROTATION_UNIT;
        }
    }

    _move() {
        const incrementalX = Math.sin(this.modelInstance.rotation.y) * MOVING_UNIT;
        const incrementalZ = Math.cos(this.modelInstance.rotation.y) * MOVING_UNIT;

        //early return
        if((this.modelInstance.position.x - incrementalX >= 2) || (this.modelInstance.position.z - incrementalZ >= 10)) {
            console.log(this.modelInstance.position);
            return
        }

        //change position
        this.modelInstance.position.z -= incrementalZ;
        this.modelInstance.position.x -= incrementalX;

        //update the camera
        Engine.instance.moveCamera(AXIS.Z, -incrementalZ);
        Engine.instance.moveCamera(AXIS.X, -incrementalX);

        //update controller
        Engine.instance.setOrbitPosition(this.modelInstance.position);
    }
}

export default MainObject