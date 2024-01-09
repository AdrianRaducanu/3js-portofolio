import WorldLight from "./objectClasses/WorldLight.js";
import {Tween} from "@tweenjs/tween.js";

class ObjectiveLight extends WorldLight{

    constructor(name, lightType, props) {
        super(name, lightType, props);
        this.isOn = false;
    }

    /**
     * Called from outside of this class
     */
    initialize() {
        super.initialize();
        this.lightInstance.intensity = 0;
    }

    changeVisibility(value) {
        this.lightInstance.visible = value;
    }

    /**
     * Verify distance between cat's position(pos) and light
     * @param pos
     */
    checkDistance(pos) {
        if(this.isOn) return;
        const distance = this.lightInstance.position.distanceTo(pos);
        if(distance < 40) {
            this._showLight();
            this.isOn = true;
        }
    }

    /**
     * Called when cat is getting closer to an objective
     * @private
     */
    _showLight() {
        const tween = new Tween(this.lightInstance)
            .to({
                intensity: 5,
                distance:200
            }, 500)
            .repeat(1)
            .yoyo(true)
            .delay(200)
            .onComplete(() => {
                this.lightInstance.intensity = 1;
            })
        tween.start();
    }
}

export default ObjectiveLight;