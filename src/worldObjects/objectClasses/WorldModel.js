import WorldObjects from "./WorldObjects.js";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";
import Engine from "../../Engine.js";
import {AnimationMixer} from "three";

/**
 * Used to handle 3d models
 */
class WorldModel extends WorldObjects {

    constructor(name) {
        super(name);
        this.url = `../../static/models/bin/${this.name}.glb`;
        this.modelInstance = {};
        this.modelAnimations = {};
        this.mixer = null;
    }

    /**
     * Called from outside of this class
     * @param callback {function}
     */
    initialize(callback) {
        this.importModel(() => callback());
    }

    /**
     * Add the 3d model into the scene
     * @private
     */
    _addInScene() {
        Engine.instance.addInScene(this.modelInstance);
    }

    /**
     * Set position based on axis and value
     * @param axis
     * @param value
     */
    setPosition(axis, value) {
        this.modelInstance.position[axis] = value
    }

    /**
     * Set rotation based on axis and value
     * @param axis
     * @param value
     */
    setRotation(axis, value) {
        this.modelInstance.rotation[axis] = value;
    }

    /**
     * Used to import 3d model
     * @param callbackAfterLoading {function}
     */
    importModel(callbackAfterLoading) {
        const loader = new GLTFLoader();
        loader.load(
            this.url,
            (gltf) => {
                this._onLoad(gltf, callbackAfterLoading);
            },
            (progress)=> {
                this._onProgress(progress);
            },
            (error) => {
                this._onError(error);
            }
        )
    }

    /**
     * Called after 3d model is loaded
     * @param gltf
     * @param callbackAfterLoading
     * @private
     */
    _onLoad(gltf, callbackAfterLoading) {
        this.modelInstance = gltf.scene;

        //animation
        this._extractAnimations(gltf);

        //fcn to run
        callbackAfterLoading();
        this._addInScene();
    }

    /**
     * Called while 3d model is loading
     * @param progress
     * @private
     */
    _onProgress(progress) {
        // console.log("progress ", progress );
    }

    /**
     * Called when 3d model throw error
     * @param error
     * @private
     */
    _onError(error) {
        // console.log("error", error);
    }

    /**
     * If there are any animation in the 3d model, extract them into modelAnimation
     * @param gltf
     * @private
     */
    _extractAnimations(gltf) {
        this.mixer = new AnimationMixer(gltf.scene);
        gltf.animations.forEach(animation => {
            this.modelAnimations[animation.name] = this.mixer.clipAction(animation);
        });
    }

    /**
     * Used to run 3d model animations, connected to the tick fcn
     * @param delta
     */
    updateMixer(delta) {
        if(this.mixer) {
            this.mixer.update(delta);
        }
    }

    /**
     * Play animation based on name
     * @param name
     */
    playAnimationByName(name) {
        if(this.modelAnimations[name]) {
            this.modelAnimations[name].play();
        }
    }

    /**
     * Stop animation based on name
     * @param name
     */
    stopAnimationByName(name) {
        if(this.modelAnimations[name]) {
            this.modelAnimations[name].stop();
        }
    }

    _traverseModel() {
        throw new Error("Must implement this method")
    }

}

export default WorldModel;