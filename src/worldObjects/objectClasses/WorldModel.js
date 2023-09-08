import WorldObjects from "./WorldObjects.js";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";
import Engine from "../../Engine.js";
import {AnimationMixer} from "three";

class WorldModel extends WorldObjects {
    constructor(name) {
        super(name);
        this.url = `../../static/models/bin/${this.name}.glb`;
        this.modelInstance = {};
        this.modelAnimations = {};
        this.mixer = null;
    }

    initialize() {
    }

    _addInScene() {
        Engine.instance.addInScene(this.modelInstance);
    }


    setProperty(key, value) {
    }

    addShadow() {
    }

    importModel(name, callbackAfterLoading) {
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

    _onLoad(gltf, callbackAfterLoading) {
        this.modelInstance = gltf.scene;

        //animation
        this._extractAnimations(gltf);

        //fcn to run
        callbackAfterLoading();
        this.addShadow();
        this._addInScene();
    }

    _onProgress(progress) {
        // console.log("progress ", progress );
    }

    _onError(error) {
        // console.log("error", error);
    }

    _extractAnimations(gltf) {
        this.mixer = new AnimationMixer(gltf.scene);
        gltf.animations.forEach(animation => {
            this.modelAnimations[animation.name] = this.mixer.clipAction(animation);
        });
    }

    updateMixer(delta) {
        if(this.mixer) {
            this.mixer.update(delta);
        }
    }

    playAnimationByName(name) {
        if(this.modelAnimations[name]) {
            this.modelAnimations[name].play();
        }
    }

    stopAnimationByName(name) {
        if(this.modelAnimations[name]) {
            this.modelAnimations[name].stop();
        }
    }

}

export default WorldModel;