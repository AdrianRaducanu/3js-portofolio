import WorldModel from "./WorldModel.js";
import {ANIMATED_NODE} from "../constants/CONST.js";
import {
    ANIMATED_OBJECT_TWEEN,
    ANIMATED_OBJECT_ANIMATION, ANIMATED_NODE_INITIAL_PROPS, ANIMATED_OBJECT_MODEL_ANIMATIONS_PREPARE,
} from "../constants/ANIMATIONS.js";

/**
 * Used to handle animated objects
 */
class WorldAnimatedObject extends WorldModel {

    /**
     * The raycaster passed is the front facing raycaster so the main object
     * @param name
     * @param raycaster
     * @param props
     */
    constructor(name, props, raycaster = null) {
        super(name);
        this.raycaster = raycaster;
        this.props = props;
        this.isActive = false;
    }

    /**
     * called from outside of this class
     */
    initialize() {
        super.initialize(() => this.callbackAfterLoading());
    }

    /**
     * Called after loading 3d model is done
     */
    callbackAfterLoading() {
        this._traverseModel();
        this._prepareAnimations();
        this.updatePositionAndRotation(this.props);
        if(this.raycaster) {
            this.raycaster.addInObjectsToIntersect(this.modelInstance);
        }
    }

    /**
     * Used to animate 3d model
     *
     * It may have a simple loop animation (e.g. rotate.y += 1)
     * or external animations so the mixer should be updated
     */
    update(delta) {
        if(this.animatedNode && this.isActive && ANIMATED_OBJECT_ANIMATION[this.name]) {
            ANIMATED_OBJECT_ANIMATION[this.name](this.animatedNode);
        }

        if(Object.keys(this.modelAnimations).length) {
            this.mixer.update(delta)
        }
    }

    /**
     * Used to pass through each node of the 3d model
     *
     * Assign initial props for the animated node if needed
     */
    _traverseModel() {
        this.modelInstance.traverse((node) => {
            if(node.name.includes(ANIMATED_NODE[this.name])) {
                this.animatedNode = node;
                if (ANIMATED_NODE_INITIAL_PROPS[this.name]) {
                    ANIMATED_NODE_INITIAL_PROPS[this.name](this.animatedNode);
                }
            }
        });
    }

    /**
     * Update position and rotation based
     * @param props {object}
     */
    updatePositionAndRotation(props) {
        Object.keys(props).forEach(prop => {
            Object.keys(props[prop]).forEach(axis => {
                this.modelInstance[prop][axis] = props[prop][axis];
            })
        })
    }

    /**
     * When an animated object is seen for the first time, play its external animation
     *
     * If there is no external animation, play its tween
     */
    activateAnimationFlag() {
        if(!this.isActive) {
            if(Object.keys(this.modelAnimations).length) {
                this._playModelAnimationOnActivate();
            }  else {
                this._playTweenAnimationOnActivate();
            }
        }

    }

    /**
     * Prepare external animations if needed (set animationSpeed, looping etc.)
     * @private
     */
    _prepareAnimations() {
        Object.keys(this.modelAnimations).forEach(key => {
            ANIMATED_OBJECT_MODEL_ANIMATIONS_PREPARE[key](this.modelAnimations[key])
        });
    }

    /**
     * Play all the external animations
     * @private
     */
    _playModelAnimationOnActivate() {
        Object.keys(this.modelAnimations).forEach(anim => {
            this.playAnimationByName(anim)
        });
        this.isActive = true;
    }

    /**
     * Play the activation tween
     * @private
     */
    _playTweenAnimationOnActivate() {
        this.tween = ANIMATED_OBJECT_TWEEN[this.name](this.animatedNode, () => { this.isActive = true; });
        this.tween.start();
    }

}

export default WorldAnimatedObject;