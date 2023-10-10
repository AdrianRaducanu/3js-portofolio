import WorldModel from "./objectClasses/WorldModel.js";
import {LANDSCAPE_MESH} from "./constants/CONST.js";
import {Color, ShaderMaterial} from "three";
import waterfallVertex from "../shaders/waterfall/vertex.glsl"
import waterfallFragment from "../shaders/waterfall/fragment.glsl"
import {WATER_COLOR} from "./constants/MODEL_PROPERTIES.js";

class Landscape extends WorldModel{

    constructor(name, raycaster) {
        super(name);
        this.raycaster = raycaster;
        this._createShaderMaterials();
    }

    initialize() {
        super.importModel(this.name, () => this.callbackAfterModelLoad());
    }

    callbackAfterModelLoad() {
        const road = this.modelInstance.children.filter(child => child.name === LANDSCAPE_MESH.ROAD_MESH);
        this.raycaster.createObjectToIntersect(road[0]);

        this.modelInstance.traverse((node) => {
            // console.log(node)
            if(node.name === LANDSCAPE_MESH.WATERFALL) {
                this._changeWaterfall(node)
            }
            this._addShadow(node);
        })
    }

    _addShadow(node) {
        switch (node.name) {
            case LANDSCAPE_MESH.TREE_MESH:
            case LANDSCAPE_MESH.LEAF_MESH:
            case LANDSCAPE_MESH.CAVE_ROOF_MESH:
                node.castShadow = true;
                break;
            case LANDSCAPE_MESH.ROAD_MESH:
            case LANDSCAPE_MESH.GRASS_MESH:
            case LANDSCAPE_MESH.CAVE_MESH:
                node.receiveShadow = true;
                break;
            default:
                break;
            }
    }

    _changeWaterfall(node) {
        console.log(node);

        node.material = this.waterfallMaterial;
    }

    _createShaderMaterials() {
        const waterColor = new Color(WATER_COLOR);
        this.waterfallMaterial = new ShaderMaterial({
            vertexShader: waterfallVertex,
            fragmentShader: waterfallFragment,
            uniforms: {
                uTime: {value: 0},
                uWavesAmpl: {value: 0.5},
                uWaterColor: {value: waterColor},
            }
        })
    }

    update(elapsed) {
        this.waterfallMaterial.uniforms.uTime.value = elapsed;
    }

}

export default Landscape;