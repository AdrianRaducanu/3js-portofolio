import {KEYBOARD_CODES} from "../constants/KEYBOARD_CODES.js";
import Engine from "../Engine.js";
import {AXIS} from "../constants/UNITS.js";
import WorldModel from "./objectClasses/WorldModel.js";
import {LoopOnce, Vector3} from "three";
import {MAIN_ANIMATIONS} from "./constants/ANIMATIONS.js";
import {
    KEY_EVENTS, MOVING_UNIT, NECK_BONE_INITIAL_ROTATION, NECK_BONE_LEFT_LIMIT, NECK_BONE_RIGHT_LIMIT,
    NECK_BONE_ROTATION, ROTATION_UNIT,
    STANDING_TIME_INCREMENT,
    STANDING_TIME_INITIAL_VALUE,
    STANDING_TIME_LOOP_TIME
} from "./constants/CONST.js";

class MainObject extends WorldModel{
    constructor(name, props) {
        super(name, props);
        this.moveController = {
            up: false,
            down: false,
            left: false,
            right: false
        }
        this.standingTime = STANDING_TIME_INITIAL_VALUE;
    }

    initialize() {
        super.importModel(this.name, () => this.callbackAfterModelLoad());
    }

    callbackAfterModelLoad() {
        this._keyListener();
        this._unloopAnimations();

        //this can be different from model to model -> should find another solution
        this.neckBone = this.modelInstance["children"][0]["children"][1]["children"][1]["children"][0]["children"][0]["children"][0]["children"][0];

        //set orbit controller to gravitate around the main object
        Engine.instance.setOrbitPosition(new Vector3(0, 0, 0));
    }

    _keyListener() {
        window.addEventListener(KEY_EVENTS.KEY_DOWN, (event) => {
            //early return
            if(this.modelAnimations[MAIN_ANIMATIONS.FLIP].isRunning()) {
                return;
            }

            //this is regarding standby animation
            this.modelAnimations[MAIN_ANIMATIONS.HEAD_TURN].stop();

            switch (event.code) {
                case KEYBOARD_CODES.KEY_W:
                    this.neckBone.rotation[AXIS.Y] = NECK_BONE_INITIAL_ROTATION;
                    this.moveController.down = false;
                    this.moveController.up = true;
                    break;
                case KEYBOARD_CODES.KEY_S:
                    this.neckBone.rotation[AXIS.Y] = NECK_BONE_INITIAL_ROTATION;
                    //the animations that has no loop should be stop first in order to be played again
                    this.stopAnimationByName(MAIN_ANIMATIONS.FLIP);
                    this.playAnimationByName(MAIN_ANIMATIONS.FLIP);

                    this.moveController.up = false;
                    this.moveController.down = true;
                    break;
                case KEYBOARD_CODES.KEY_A:
                    this.stopAnimationByName(MAIN_ANIMATIONS.HEAD_WALK);
                    if(this.neckBone.rotation[AXIS.Y] < NECK_BONE_LEFT_LIMIT) {
                        this.neckBone.rotation[AXIS.Y] += NECK_BONE_ROTATION;
                    }
                    this.moveController.right = false;
                    this.moveController.left = true;
                    break;
                case KEYBOARD_CODES.KEY_D:
                    this.stopAnimationByName(MAIN_ANIMATIONS.HEAD_WALK);
                    if(this.neckBone.rotation[AXIS.Y] > NECK_BONE_RIGHT_LIMIT) {
                        this.neckBone.rotation[AXIS.Y] -= NECK_BONE_ROTATION;
                    }
                    this.moveController.left = false;
                    this.moveController.right = true;
                    break;
                default:
                    break;
            }
        });

        window.addEventListener(KEY_EVENTS.KEY_UP, (event) => {
            switch (event.code) {
                case KEYBOARD_CODES.KEY_W:
                    this.stopAnimationByName(MAIN_ANIMATIONS.WALK);
                    this.stopAnimationByName(MAIN_ANIMATIONS.HEAD_WALK);
                    this.moveController.up = false;
                    break;
                case KEYBOARD_CODES.KEY_S:
                    this.moveController.down = false;
                    break;
                case KEYBOARD_CODES.KEY_A:
                    this.neckBone.rotation[AXIS.Y] = NECK_BONE_INITIAL_ROTATION;
                    this.stopAnimationByName(MAIN_ANIMATIONS.WALK);
                    this.moveController.left = false;
                    break;
                case KEYBOARD_CODES.KEY_D:
                    this.neckBone.rotation[AXIS.Y] = NECK_BONE_INITIAL_ROTATION;
                    this.stopAnimationByName(MAIN_ANIMATIONS.WALK);
                    this.moveController.right = false;
                    break;
                default:
                    break;
            }
        })
    }

    update(delta) {
        this.standingTime += STANDING_TIME_INCREMENT;

        this._updatePosition();
        this.updateMixer(delta);

        if(Math.round(this.standingTime) % STANDING_TIME_LOOP_TIME === 0 && !this.modelAnimations[MAIN_ANIMATIONS.HEAD_TURN]?.isRunning()) {
            this.modelAnimations[MAIN_ANIMATIONS.HEAD_TURN]?.stop();
            this.modelAnimations[MAIN_ANIMATIONS.HEAD_TURN]?.play();
        }
    }

    _updatePosition() {
        if(this.moveController.up) {
            this.playAnimationByName(MAIN_ANIMATIONS.WALK);
            this.playAnimationByName(MAIN_ANIMATIONS.HEAD_WALK);
            this._move();
            this.standingTime = STANDING_TIME_INITIAL_VALUE;
        }
        if(this.moveController.down) {
            this.standingTime = STANDING_TIME_INITIAL_VALUE;

            // here will put sit-down animation -> idk if i ll do it
        }
        if(this.moveController.left) {
            this.modelInstance.rotation.y += ROTATION_UNIT;

            this.standingTime = STANDING_TIME_INITIAL_VALUE;
        }
        if(this.moveController.right) {
            this.modelInstance.rotation.y -= ROTATION_UNIT;

            this.standingTime = STANDING_TIME_INITIAL_VALUE;
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

    _unloopAnimations() {
        Object.keys(this.modelAnimations).forEach(key => {
            if(key === MAIN_ANIMATIONS.FLIP || key === MAIN_ANIMATIONS.HEAD_TURN) {
                this.modelAnimations[key].setLoop(LoopOnce);
            }
        })
    }
}

export default MainObject