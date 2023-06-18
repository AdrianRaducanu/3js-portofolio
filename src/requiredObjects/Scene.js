import RequiredObjects from "./RequiredObjects.js";
import {Scene as ThreeScene} from "three";

class Scene extends RequiredObjects{
    constructor() {
        super();
    }

    initialize() {
        this.sceneInstance = new ThreeScene();
    }

    addInScene(obj) {
        this.sceneInstance.add(obj);
    }

    removeFromScene(obj) {
        this.sceneInstance.remove(obj);
    }

    getInstance() {
        return this.sceneInstance;
    }

}

export default Scene