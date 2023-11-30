import RequiredObjects from "./RequiredObjects.js";
import Engine from "../Engine.js";
import {REQUIRED_OBJECT_TYPES} from "../constants/OBJECT_TYPES.js";

class Sizes extends RequiredObjects{

    constructor() {
        super();
        this.sizesInstance = {
            width: window.innerWidth,
            height: window.innerHeight
        };
    }

    /**
     * Called from outside of this class
     */
    initialize() {
        this._updateOnResize();
    }

    /**
     * return sizesInstance
     * @returns {*|{width: number, height: number}}
     */
    getInstance() {
        return this.sizesInstance;
    }

    /**
     * Handle resize event
     * @private
     */
    _updateOnResize() {
        window.addEventListener("resize", ()=> {
            this.sizesInstance.height = window.innerHeight;
            this.sizesInstance.width = window.innerWidth;

            const camera = Engine.instance.getRequiredObject(REQUIRED_OBJECT_TYPES.CAMERA);
            camera.update();

            const renderer = Engine.instance.getRequiredObject(REQUIRED_OBJECT_TYPES.RENDERER);
            renderer.update();
        });
    }

}

export default Sizes