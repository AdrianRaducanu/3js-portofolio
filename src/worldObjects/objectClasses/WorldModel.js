import WorldObjects from "./WorldObjects.js";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";
import Engine from "../../Engine.js";
import {AnimationMixer} from "three";

class WorldModel extends WorldObjects {
    constructor(name, callbackAfterLoading, props) {
        super(name, props);
        this.url = `../../static/models/${this.name}/bin/Fox.glb`;
        this.modelInstance = {};
        this.modelAnimations = {};
        this.mixer = null;
    }

    initialize() {
    }

    _addInScene() {
        Engine.instance.addInScene(this.modelInstance);
    }

    _setupDebugger() {
    }

    setProperty(key, value) {
    }

    addShadow() {
        this.modelInstance.traverse((node) => {
            if(node.isMesh) {
                node.castShadow = true;
            }
        })
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
        // const clip = this.mixer.clipAction(gltf.animations[1]);
        // clip.play();
        gltf.animations.forEach(animation => {
            this.modelAnimations[animation.name] = this.mixer.clipAction(animation);
        })
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