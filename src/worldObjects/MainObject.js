import UsualMesh from "./UsualMesh.js";
import {KEYBOARD_CODES} from "../constants/KEYBOARD_CODES.js";
import Engine from "../Engine.js";
import {AXIS, MOVING_UNIT, ROTATION_UNIT} from "../constants/UNITS.js";

class MainObject extends UsualMesh{
    constructor(name, geometry, material, props) {
        super(name, geometry, material, props);
        this.moveController = {
            up: false,
            down: false,
            left: false,
            right: false
        }
    }

    initialize() {
        super.initialize();
        this._keyListener();

        //set orbit controller to gravitate around the main object
        Engine.instance.setOrbitPosition(this.meshInstance.position);
    }

    _keyListener() {
        window.addEventListener('keydown', (event) => {
            switch (event.code) {
                case KEYBOARD_CODES.KEY_W:
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

    updatePosition() {
        if(this.moveController.up) {
            this.meshInstance.position.z -= Math.cos(this.meshInstance.rotation.y) * MOVING_UNIT;
            this.meshInstance.position.x -= Math.sin(this.meshInstance.rotation.y) * MOVING_UNIT;

            //update the camera
            Engine.instance.moveCamera(AXIS.Z, -Math.cos(this.meshInstance.rotation.y) * MOVING_UNIT);
            Engine.instance.moveCamera(AXIS.X, -Math.sin(this.meshInstance.rotation.y) * MOVING_UNIT);

            //update controller
            Engine.instance.setOrbitPosition(this.meshInstance.position);
        }
        if(this.moveController.down) {
            // here will put sit-down animation
        }
        if(this.moveController.left) {
            this.meshInstance.rotation.y += ROTATION_UNIT;
        }
        if(this.moveController.right) {
            this.meshInstance.rotation.y -= ROTATION_UNIT;
        }

    }
}

export default MainObject