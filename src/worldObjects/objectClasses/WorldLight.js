import WorldObjects from "./WorldObjects.js";
import {AmbientLight, CameraHelper, DirectionalLight, PointLight} from "three";
import Engine from "../../Engine.js";
import {LIGHT_TYPE} from "../../constants/LIGHT_TYPE.js";
import {OBJECT_PROPERTIES} from "../../constants/OBJECT_PROPERTIES.js";

/**
 * Used to handle lights
 */
class WorldLight extends WorldObjects{

    constructor(name, lightType, props, hasHelper = false) {
        super(name, props);
        this.lightType = lightType;
        this.hasHelper = hasHelper;
        this._createLightBasedOnType();
    }

    /**
     * Called from outisde of this class
     */
    initialize() {
        this._addInScene();
    }

    /**
     * Add light to the scene
     * @private
     */
    _addInScene() {
        Engine.instance.addInScene(this.lightInstance);
    }

    /**
     * Optional, add shadow to a light
     * @param props
     */
    addShadow(props) {
        Object.keys(props).forEach(prop => {
            Object.keys(props[prop]).forEach(propKeys => {
                this.lightInstance.shadow[prop][propKeys] = props[prop][propKeys];
            })
        });
        this.lightInstance.castShadow = true;
        // normalBias and bias can solve shadow acnee
        this.lightInstance.shadow.normalBias = 0.1;

        this._createLightHelper();
    }

    /**
     * Used for debugger
     * @param key
     * @param value
     */
    setProperty(key, value) {
        this.properties[key] = value;
        switch (key) {
            case OBJECT_PROPERTIES.POSITION:
                this.lightInstance.position.set(value.x, value.y, value.z);
                break;
            case OBJECT_PROPERTIES.COLOR:
                this.lightInstance.color.set(value);
                break;
            default:
                this.lightInstance[key] = value;
                break;
        }
    }

    /**
     * Create the light instance based on its type
     * @private
     */
    _createLightBasedOnType() {
        switch (this.lightType) {
            case LIGHT_TYPE.AMBIENT:
                this.lightInstance = new AmbientLight(this.properties.color || "#ffffff", this.properties.intensity || 1);
                break;
            case LIGHT_TYPE.DIRECTIONAL:
                this.lightInstance = new DirectionalLight(this.properties.color || "#ffffff", this.properties.intensity || 1);
                break;
            case LIGHT_TYPE.POINT:
                this.lightInstance = new PointLight(this.properties.color || "#ffffff", this.properties.intensity || 1, this.properties.distance || 1, this.properties.decay || 0);
                break;
            default:
                throw new Error("light type not correct!");
        }
        if(this.properties.position) {
            this.lightInstance.position.set(this.properties.position.x, this.properties.position.y, this.properties.position.z);
        }
    }

    /**
     * Create light helper, dev purpose only
     * @private
     */
    _createLightHelper() {
        if(this.hasHelper) {
            this.lightHelper = new CameraHelper(this.lightInstance.shadow.camera);
            Engine.instance.addInScene(this.lightHelper);
        }
    }
}

export default WorldLight