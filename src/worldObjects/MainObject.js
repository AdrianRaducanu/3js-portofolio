import {KEYBOARD_CODES} from "../constants/KEYBOARD_CODES.js";
import Engine from "../Engine.js";
import {AXIS} from "../constants/UNITS.js";
import WorldModel from "./objectClasses/WorldModel.js";
import {LoopOnce, Vector3} from "three";
import {MAIN_ANIMATIONS} from "./constants/ANIMATIONS.js";
import {
    DOWN_FACING_RAYCASTER_POS, FRONT_FACING_RAYCASTER_OBJECTS,
    FRONT_FACING_RAYCASTER_POS,
    KEY_ACTION,
    KEY_EVENTS, LANDSCAPE_MESH, MOVING_UNIT, NECK_BONE_INITIAL_ROTATION, NECK_BONE_LEFT_LIMIT, NECK_BONE_RIGHT_LIMIT,
    NECK_BONE_ROTATION, OUTSIDE_CAVE_TIME_INCREMENT, OUTSIDE_CAVE_TIME_INITIAL_VALUE, ROTATION_UNIT, SPINE_TO_ROTATE,
    STANDING_TIME_INCREMENT,
    STANDING_TIME_INITIAL_VALUE,
    STANDING_TIME_LOOP_TIME, STARTING_POSITION,
} from "./constants/CONST.js";
import {OBJECTIVES} from "../constants/DOM_CONSTANTS.js";
import {SOUND_NAMES} from "../constants/SOUND_CONSTANTS.js";
import {ActivationManager} from "../API.js";

class MainObject extends WorldModel {

    /**
     * Passing all the raycasters that are related to the cat.
     *
     * Moving controller is used in order to move in more than one direction
     *
     * standingTime -> used to trigger standing animation (head rotation) once every 20sec
     * outsideCaveTime -> counter used to trigger the return in initial position of the fireflies
     * isInCave -> check if the down facing raycast intersects cave-roof mesh
     * @param name
     * @param downFacingRaycaster
     * @param frontFacingRaycaster
     * @param otherObjects
     */
    constructor(name, downFacingRaycaster, frontFacingRaycaster, otherObjects) {
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
        this.otherObjects = otherObjects;
        this.outsideCaveTime = OUTSIDE_CAVE_TIME_INITIAL_VALUE;
        this.isInCave = false;

        this.isFrozen = false;
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

        this.modelInstance.position.z = STARTING_POSITION.Z;

        //set orbit controller to gravitate around the main object
        Engine.instance.setOrbitPosition(new Vector3(0, 0, 0));
    }

    /**
     * Used to listen to keys pressed/released
     *
     * Early returns:
     * While is doing flip animation, don't move
     * While is frozen, don't move
     * @private
     */
    _keyListener() {
        window.addEventListener(KEY_EVENTS.KEY_DOWN, (event) => {
            if(this.modelAnimations[MAIN_ANIMATIONS.FLIP].isRunning()) {
                return;
            }

            if(this.isFrozen) {
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
                    API.playSound(SOUND_NAMES.JUMP);
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
     *
     * While is frozen, don't move
     * @param delta
     */
    update(delta) {
        this.standingTime += STANDING_TIME_INCREMENT;

        if(!this.isInCave) {
            this._handleOutsideCaveLogic();
        }

        if(!this.isFrozen) {
            this._updatePosition();
        }

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
        const roadCollision = this.downFacingRaycaster.verifyNextStep(
            this.modelInstance.position.x - incrementalX,
            DOWN_FACING_RAYCASTER_POS.Y,
            this.modelInstance.position.z - incrementalZ
        );

        //this means that next position would be on restricted area
        if(!roadCollision.find(el => el.object.name === LANDSCAPE_MESH.ROAD_MESH)) {
            return;
        }

        //check if is in cave
        this.isInCave = !!roadCollision.find(el => el.object.name === LANDSCAPE_MESH.CAVE_ROOF_MESH);

        //change position
        this.modelInstance.position.z -= incrementalZ;
        this.modelInstance.position.x -= incrementalX;

        this._moveOtherObjects(incrementalZ, incrementalX);
    }

    /**
     * Move other objects based on cat's position
     *
     * Camera will always follow the cat
     * TODO: when oribtController is gonna be deleted, should fix camera rotation
     *
     * Raycasters:
     * -> downFacing raycaster is already updated using .verifyNextStep()
     * -> frontFacing raycaster will always follow the cat
     *
     * Fireflies will follow the cat only if:
     * - on daytime: the cat is in cave AND the cat made a flip
     * - on nighttime: always follow the cat (TODO: nighttime to be implemented)
     * @private
     */
    _moveOtherObjects(z, x) {
        //change other objects
        this._moveCamera(z, x);
        this.frontFacingRaycaster.changeOrigin(new Vector3(this.modelInstance.position.x, FRONT_FACING_RAYCASTER_POS.Y ,this.modelInstance.position.z));
        this._detectFrontalCollision();
        this._moveFireFlies(this.modelInstance.position.z, this.modelInstance.position.x);

        //update controller
        Engine.instance.setOrbitPosition(this.modelInstance.position);
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
        });
    }

    /**
     * Will go through each node of the model
     * @private
     */
    _traverseModel() {
        this.modelInstance.traverse((node) => {
            if (node.name === SPINE_TO_ROTATE) {
                this.neckBone = node;
            }
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
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
     * that will trigger to fireflies to follow her in cave only on nighttime
     * @private
     */
    _onMovingBack() {
        this.standingTime = STANDING_TIME_INITIAL_VALUE;

        if(this.isInCave) {
            this.otherObjects.fireflies.goToPosition(this.modelInstance.position.z, this.modelInstance.position.x);
        }
    }

    /**
     * Called when moveController.up is true, meaning that the cat should walk left-forward, turning its head
     *
     * Also, change raycaster direction
     * @private
     */
    _onMovingLeft() {
        this.modelInstance.rotation.y += ROTATION_UNIT;
        this.frontFacingRaycaster.changeDirectionBasedOnAngle(this.modelInstance.rotation.y, FRONT_FACING_RAYCASTER_POS);
        this._detectFrontalCollision();
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
        this.frontFacingRaycaster.changeDirectionBasedOnAngle(this.modelInstance.rotation.y, FRONT_FACING_RAYCASTER_POS);
        this._detectFrontalCollision();
        this.standingTime = STANDING_TIME_INITIAL_VALUE;
    }

    /**
     * Move camera based on cat's position
     * @param z
     * @param x
     * @private
     */
    _moveCamera(z,x) {
        Engine.instance.moveCamera(AXIS.Z, -z);
        Engine.instance.moveCamera(AXIS.X, -x);
    }

    /**
     * Move front facing raycaster position based on cat's position
     *
     * If frontal raycaster detects something, activate that animated object
     *
     * First time when the cat finds some objective, it will be unlocked
     * @private
     */
    _detectFrontalCollision() {
        const frontCollision = this.frontFacingRaycaster.hasCollied();
        if(frontCollision) {
            switch (frontCollision[0].object.name) {
                case FRONT_FACING_RAYCASTER_OBJECTS.JOB_WSS:
                    if(!ActivationManager.getIsActive(OBJECTIVES.WSS)) {
                        this.otherObjects.jobWSS.onActivation();
                        API.unlockObjective(OBJECTIVES.WSS);
                    }
                    break;
                case FRONT_FACING_RAYCASTER_OBJECTS.JOB_DB:
                    if(!ActivationManager.getIsActive(OBJECTIVES.DB)) {
                        this.otherObjects.jobDB.onActivation();
                        API.unlockObjective(OBJECTIVES.DB);
                    }
                    break;
                case FRONT_FACING_RAYCASTER_OBJECTS.PICK_UP:
                    if(!ActivationManager.getIsActive(OBJECTIVES.MUSIC)) {
                        this.otherObjects.pickup.onActivation();
                        API.unlockObjective(OBJECTIVES.MUSIC);
                    }
                    break
                case FRONT_FACING_RAYCASTER_OBJECTS.EASTER_EGG:
                    if(!ActivationManager.getIsActive(OBJECTIVES.EGG)) {
                        this.otherObjects.easterEgg.onActivation();
                        this.otherObjects.questionMark.onActivation();
                        API.unlockObjective(OBJECTIVES.EGG);
                    }
                    break;
                default:
                    break;
            }
        }
    }

    /**
     * Will move fireflies based on cat's position
     * @param z
     * @param x
     * @private
     */
    _moveFireFlies(z, x) {
        if(this.isInCave) {
            this.outsideCaveTime = OUTSIDE_CAVE_TIME_INITIAL_VALUE;
            this.otherObjects.fireflies.updateFireflyPosition(z, x);
        }
    }

    /**
     * Used to trigger return of the fireflies
     *
     * If the fireflies are in their initial position and the cat is outside the cave,
     * no need to increment outsideCaveTime
     *
     * If the cat is outside the cave for less than 5 sec, just increment outsideCaveTime
     *
     * If the cat is outside the cave for more than 5 sec, fireflies will return to their initial position
     * @private
     */
    _handleOutsideCaveLogic() {
        if(this.otherObjects.fireflies.isInInitialPosition()) {
            return;
        }
        this.outsideCaveTime += OUTSIDE_CAVE_TIME_INCREMENT;
        if(this.outsideCaveTime > 5000) {
            this.otherObjects.fireflies.returnToInitialPosition();
        }
    }

    /**
     * Make the cat stop walking and set flag to true
     */
    onFreeze() {
        this.isFrozen = true;

        this.moveController.left = false;
        this.moveController.right = false;
        this.moveController.up = false;
        this.moveController.down = false;
    }

    /**
     * Set flag to false
     */
    onUnfreeze() {
        this.isFrozen = false;
    }
}

export default MainObject