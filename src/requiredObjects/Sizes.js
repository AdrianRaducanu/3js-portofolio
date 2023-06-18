import RequiredObjects from "./RequiredObjects.js";
import Engine from "../Engine.js";

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

            const camera = Engine.instance.getCamera();
            camera.update();

            const renderer = Engine.instance.getRenderer();
            renderer.update();
        });
    }

}

export default Sizes