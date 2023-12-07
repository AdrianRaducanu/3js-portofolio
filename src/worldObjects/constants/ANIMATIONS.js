import {Tween} from "@tweenjs/tween.js";
import {Easing} from "three/addons/libs/tween.module.js";
import {LoopOnce} from "three";

/**
 * Animations related to the cat
 * @type {{WALK: string, HEAD_WALK: string, FLIP: string, HEAD_TURN: string}}
 */
export const MAIN_ANIMATIONS = {
    WALK: "walk",
    FLIP: "flip",
    HEAD_WALK: "head_walk",
    HEAD_TURN: "head_turn"
}

/**
 * Animations on tick fcn for animated objects
 * @type {{wss: rotateAnimatedNode, db: rotateAnimatedNode}}
 */
export const ANIMATED_OBJECT_ANIMATION = {
    "wss": rotateAnimatedNode,
    "db": rotateAnimatedNode
};

function rotateAnimatedNode(animatedNode) {
    animatedNode.rotation.y += 0.01;
}

/**
 * Initial props for animated node of animated objects
 * @type {{wss: setNodeScaleToZero, "question-mark": setNodeScaleToZero, db: setNodeScaleToZero}}
 */
export const ANIMATED_NODE_INITIAL_PROPS = {
    "wss": setNodeScaleToZero,
    "db": setNodeScaleToZero,
    "question-mark": setNodeScaleToZero
};

function setNodeScaleToZero(animatedNode) {
    animatedNode.scale.set(0, 0, 0);
}

/**
 * Tweens of animated objects that are played on activation (when the cats see them for the 1st time)
 * @type {{wss: (function(*, *): Tween<*>), "question-mark": (function(*, *): Tween<*>), db: (function(*, *): Tween<*>)}}
 */
export const ANIMATED_OBJECT_TWEEN = {
    "wss": createGrowingTweenDelayOptional(1, 1, 1),
    "db": createGrowingTweenDelayOptional(1, 1, 1),
    "question-mark": createGrowingTweenDelayOptional(1, 1, 1, 1000)
};

function createGrowingTweenDelayOptional(x, y, z, delay = 0) {
    return function (animatedNode, onComplete) {
        return new Tween(animatedNode.scale)
            .to({ x, y, z }, 1000)
            .easing(Easing.Bounce.Out)
            .delay(delay)
            .onComplete(onComplete());
    };
}

/**
 * Animation setup for easter egg
 * @type {{timeScale: number, loop: (number|*), clampWhenFinished: boolean}}
 */
const animationSetup = {
    loop: LoopOnce,
    clampWhenFinished: true,
    timeScale: 4
};

/**
 * Prepare external animations of animated objects
 * @type {{downAction: prepareAnimation, upAction: prepareAnimation}}
 */
export const ANIMATED_OBJECT_MODEL_ANIMATIONS_PREPARE = {
    "upAction": prepareAnimation,
    "downAction": prepareAnimation
};

function prepareAnimation(animation) {
    Object.assign(animation, animationSetup);
}
