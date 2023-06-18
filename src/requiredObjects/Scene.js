import RequiredObjects from "./RequiredObjects.js";
import {Scene as ThreeScene} from "three";

class Scene extends RequiredObjects{
    constructor() {
        super();
        this.sceneInstance = new ThreeScene();
    }

    initialize() {

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