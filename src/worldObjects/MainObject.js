import {KEYBOARD_CODES} from "../constants/KEYBOARD_CODES.js";
import Engine from "../Engine.js";
import {AXIS} from "../constants/UNITS.js";
import WorldModel from "./objectClasses/WorldModel.js";
import {LoopOnce, Vector3} from "three";
import {MAIN_ANIMATIONS} from "./constants/ANIMATIONS.js";
import {
    KEY_ACTION,
    KEY_EVENTS, MOVING_UNIT, NECK_BONE_INITIAL_ROTATION, NECK_BONE_LEFT_LIMIT, NECK_BONE_RIGHT_LIMIT,
    NECK_BONE_ROTATION, ROTATION_UNIT,
    STANDING_TIME_INCREMENT,
    STANDING_TIME_INITIAL_VALUE,
    STANDING_TIME_LOOP_TIME
} from "./constants/CONST.js";

class MainObject extends WorldModel {

    /**
     * Passing all the raycasters that are related to the cat.
     *
     * Moving controller is used in order to move in more than one direction
     * @param name
     * @param downFacingRaycaster
     * @param frontFacingRaycaster
     */
    constructor(name, downFacingRaycaster, frontFacingRaycaster) {
        super(name);
        this.moveController = {
            up: false,
            down: false,
            left: false,
            right: false
        }
        this.standingTime = STANDING_TIME_INITIAL_VALUE;
        this.downFacingRaycaster = downFacingRaycaster;
        this.frontFacingRaycaster = frontFacingRaycaster;
    }

    /**
     * Called from outside of this method
     */
    initialize() {
        super.initialize(() => this.callbackAfterModelLoad())
    }

    /**
     * Called after model is loaded
     */
    callbackAfterModelLoad() {
        this._keyListener();
        this._unloopAnimations();
        this._traverseModel();

        this.modelInstance.position.z = 70;

        //set orbit controller to gravitate around the main object
        Engine.instance.setOrbitPosition(new Vector3(0, 0, 0));
    }

    /**
     * Used to listen to keys pressed/released
     * @private
     */
    _keyListener() {
        window.addEventListener(KEY_EVENTS.KEY_DOWN, (event) => {
            if(this.modelAnimations[MAIN_ANIMATIONS.FLIP].isRunning()) {
                return;
            }

            //this is regarding standby animation
            this.modelAnimations[MAIN_ANIMATIONS.HEAD_TURN].stop();

            switch (event.code) {
                case KEYBOARD_CODES.KEY_W:
                    this._onW(KEY_ACTION.DOWN)
                    break;
                case KEYBOARD_CODES.KEY_S:
                    this._onS(KEY_ACTION.DOWN)
                    break;
                case KEYBOARD_CODES.KEY_A:
                    this._onA(KEY_ACTION.DOWN)
                    break;
                case KEYBOARD_CODES.KEY_D:
                    this._onD(KEY_ACTION.DOWN)
                    break;
                default:
                    break;
            }
        });

        window.addEventListener(KEY_EVENTS.KEY_UP, (event) => {
            switch (event.code) {
                case KEYBOARD_CODES.KEY_W:
                    this._onW(KEY_ACTION.UP)
                    break;
                case KEYBOARD_CODES.KEY_S:
                    this._onS(KEY_ACTION.UP)
                    break;
                case KEYBOARD_CODES.KEY_A:
                    this._onA(KEY_ACTION.UP)
                    break;
                case KEYBOARD_CODES.KEY_D:
                    this._onD(KEY_ACTION.UP)
                    break;
                default:
                    break;
            }
        })
    }

    /**
     * Used to update the main object and its animations
     * @param delta
     */
    update(delta) {
        this.standingTime += STANDING_TIME_INCREMENT;

        this._updatePosition();
        this.updateMixer(delta);

        if(Math.round(this.standingTime) % STANDING_TIME_LOOP_TIME === 0 && !this.modelAnimations[MAIN_ANIMATIONS.HEAD_TURN]?.isRunning()) {
            this.modelAnimations[MAIN_ANIMATIONS.HEAD_TURN]?.stop();
            this.modelAnimations[MAIN_ANIMATIONS.HEAD_TURN]?.play();
        }
    }

    /**
     * Update position based on moving controller
     * @private
     */
    _updatePosition() {
        if(this.moveController.up) {
            this._onMovingUp();
        }
        if(this.moveController.down) {
            this._onMovingBack();
        }
        if(this.moveController.left) {
            this._onMovingLeft();
        }
        if(this.moveController.right) {
            this._onMovingRight();
        }

    }

    /**
     * Used to handle movement.
     *
     * Before taking the next step, verify if the next position is outside restricted area
     *
     * The position is calculated based on model's rotation
     * @private
     */
    _move() {
        const incrementalX = Math.sin(this.modelInstance.rotation.y) * MOVING_UNIT;
        const incrementalZ = Math.cos(this.modelInstance.rotation.y) * MOVING_UNIT;
        const roadCollision = this.downFacingRaycaster.verifyNextStep(this.modelInstance.position.x - incrementalX, this.modelInstance.position.z - incrementalZ);

        //this means that next position would be on restricted area
        if(!roadCollision.length) {
            return;
        }

        //change position
        this.modelInstance.position.z -= incrementalZ;
        this.modelInstance.position.x -= incrementalX;

        //moving the raycaster
        this.frontFacingRaycaster.changeOrigin(new Vector3(this.modelInstance.position.x, 0.5 ,this.modelInstance.position.z));

        //update the camera
        Engine.instance.moveCamera(AXIS.Z, -incrementalZ);
        Engine.instance.moveCamera(AXIS.X, -incrementalX);

        //update controller
        Engine.instance.setOrbitPosition(this.modelInstance.position);

        //verify frontal collision
        const frontCollision = this.frontFacingRaycaster.hasCollied();
        if(frontCollision) {
            console.log(frontCollision)
        }
    }

    /**
     * Used for model animations
     * @private
     */
    _unloopAnimations() {
        Object.keys(this.modelAnimations).forEach(key => {
            if(key === MAIN_ANIMATIONS.FLIP || key === MAIN_ANIMATIONS.HEAD_TURN) {
                this.modelAnimations[key].setLoop(LoopOnce);
            }
        })
    }

    /**
     * Will go through each node of the model
     * @private
     */
    _traverseModel() {
        this.modelInstance.traverse((node) => {
            if (node.name === "spine005") {
                this.neckBone = node;
            }
            if (node.isMesh) {
                node.castShadow = true;
                // node.receiveShadow = true;
            }
        });
    }

    /**
     * Handle interaction with W key
     * @param action
     * @private
     */
    _onW(action) {
        if (action === KEY_ACTION.DOWN) {
            this.neckBone.rotation[AXIS.Y] = NECK_BONE_INITIAL_ROTATION;
            this.moveController.down = false;
            this.moveController.up = true;
        } else {
            this.stopAnimationByName(MAIN_ANIMATIONS.WALK);
            this.stopAnimationByName(MAIN_ANIMATIONS.HEAD_WALK);
            this.moveController.up = false;
        }
    }

    /**
     * Handle interaction with S key
     * @param action
     * @private
     */
    _onS(action) {
        if (action === KEY_ACTION.DOWN) {
            this.neckBone.rotation[AXIS.Y] = NECK_BONE_INITIAL_ROTATION;
            //the animations that has no loop should be stop first in order to be played again
            this.stopAnimationByName(MAIN_ANIMATIONS.FLIP);
            this.playAnimationByName(MAIN_ANIMATIONS.FLIP);
            this.moveController.up = false;
            this.moveController.down = true;
        } else {
            this.moveController.down = false;
        }
    }

    /**
     * Handle interaction with A key
     * @param action
     * @private
     */
    _onA(action) {
        if (action === KEY_ACTION.DOWN) {
            this.stopAnimationByName(MAIN_ANIMATIONS.HEAD_WALK);
            if(this.neckBone.rotation[AXIS.Y] < NECK_BONE_LEFT_LIMIT) {
                this.neckBone.rotation[AXIS.Y] += NECK_BONE_ROTATION;
            }
            this.moveController.right = false;
            this.moveController.left = true;
        } else {
            this.neckBone.rotation[AXIS.Y] = NECK_BONE_INITIAL_ROTATION;
            this.stopAnimationByName(MAIN_ANIMATIONS.WALK);
            this.moveController.left = false;
        }
    }

    /**
     * Handle interaction with D key
     * @param action
     * @private
     */
    _onD(action) {
        if (action === KEY_ACTION.DOWN) {
            this.stopAnimationByName(MAIN_ANIMATIONS.HEAD_WALK);
            if(this.neckBone.rotation[AXIS.Y] > NECK_BONE_RIGHT_LIMIT) {
                this.neckBone.rotation[AXIS.Y] -= NECK_BONE_ROTATION;
            }
            this.moveController.left = false;
            this.moveController.right = true;
        } else {
            this.neckBone.rotation[AXIS.Y] = NECK_BONE_INITIAL_ROTATION;
            this.stopAnimationByName(MAIN_ANIMATIONS.WALK);
            this.moveController.right = false;
        }
    }

    /**
     * Called when moveController.up is true, meaning that the cat should walk forward
     * @private
     */
    _onMovingUp() {
        this.playAnimationByName(MAIN_ANIMATIONS.WALK);
        this.playAnimationByName(MAIN_ANIMATIONS.HEAD_WALK);
        this._move();
        this.standingTime = STANDING_TIME_INITIAL_VALUE;
    }

    /**
     * Called when moveController.up is true, meaning that the cat should make flip animation
     * @private
     */
    _onMovingBack() {
        this.standingTime = STANDING_TIME_INITIAL_VALUE;
    }

    /**
     * Called when moveController.up is true, meaning that the cat should walk left-forward, turning its head
     *
     * Also, change raycaster direction
     * @private
     */
    _onMovingLeft() {
        this.modelInstance.rotation.y += ROTATION_UNIT;
        this.frontFacingRaycaster.changeDirectionBasedOnAngle(this.modelInstance.rotation.y)
        this.standingTime = STANDING_TIME_INITIAL_VALUE;
    }

    /**
     * Called when moveController.up is true, meaning that the cat should walk right-forward, turning its head
     *
     * Also, change raycaster direction
     * @private
     */
    _onMovingRight() {
        this.modelInstance.rotation.y -= ROTATION_UNIT;
        this.frontFacingRaycaster.changeDirectionBasedOnAngle(this.modelInstance.rotation.y)
        this.standingTime = STANDING_TIME_INITIAL_VALUE;
    }
}

export default MainObject