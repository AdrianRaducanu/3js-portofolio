import RequiredObjects from "./RequiredObjects.js";
import Engine from "../Engine.js";
import {REQUIRED_OBJECTS_TYPE} from "../constants/REQUIRED_OBJECTS_TYPE.js";

class Sizes extends RequiredObjects{

    constructor() {
        super();
        this.sizesInstance = {
            width: window.innerWidth,
            height: window.innerHeight
        };
    }

    initialize() {
        this._updateOnResize();
    }

    getInstance() {
        return this.sizesInstance;
    }

    _updateOnResize() {
        window.addEventListener("resize", ()=> {
            this.sizesInstance.height = window.innerHeight;
            this.sizesInstance.width = window.innerWidth;

            const camera = Engine.instance.getRequiredObject(REQUIRED_OBJECTS_TYPE.CAMERA);
            camera.update();

            const renderer = Engine.instance.getRequiredObject(REQUIRED_OBJECTS_TYPE.RENDERER);
            renderer.update();
        });
    }

}

export default Sizes