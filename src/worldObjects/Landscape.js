import WorldModel from "./objectClasses/WorldModel.js";
import {LANDSCAPE_MESH} from "./constants/CONST.js";
import {ShaderMaterial} from "three";
import waterfallVertex from "../shaders/waterfall/vertex.glsl"
import waterfallFragment from "../shaders/waterfall/fragment.glsl"

class Landscape extends WorldModel{

    constructor(name, raycaster) {
        super(name);
        this.raycaster = raycaster;
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

        const waterfallMaterial = new ShaderMaterial({
            vertexShader: waterfallVertex,
            fragmentShader: waterfallFragment
        })

        node.material = waterfallMaterial;
    }

}

export default Landscape;