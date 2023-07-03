import WorldObjects from "./WorldObjects.js";
import {AmbientLight, DirectionalLight, PointLight} from "three";
import Engine from "../Engine.js";
import {LIGHT_TYPE} from "../constants/LIGHT_TYPE.js";
import {OBJECT_PROPERTIES} from "../constants/OBJECT_PROPERTIES.js";

class Light extends WorldObjects{
    constructor(name, lightType, props) {
        super(name, props);
        this.lightType = lightType;
        this._createLightBasedOnType();
    }

    initialize() {
        this._addInScene();
        this._setupDebugger();
    }

    _addInScene() {
        Engine.instance.addInScene(this.lightInstance);
    }

    _setupDebugger() {
        Engine.instance.createDebuggingFolder(this.name, this.properties, (key, value) => this.setProperty(key, value));
    }

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
}

export default Light