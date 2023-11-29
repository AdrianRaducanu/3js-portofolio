import WorldModel from "./objectClasses/WorldModel.js";
import {LANDSCAPE_MESH} from "./constants/CONST.js";

class Landscape extends WorldModel{

    constructor(name, raycaster) {
        super(name);
        this.raycaster = raycaster;
        this.waterfallUniforms = {
            uTime: {value: 0}
        };
    }

    initialize() {
        super.initialize(() => this.callbackAfterModelLoad())
    }

    callbackAfterModelLoad() {
        const road = this.modelInstance.children.filter(child => child.name === LANDSCAPE_MESH.ROAD_MESH);
        this.raycaster.addSingleObjectToIntersect(road[0]);

        this.modelInstance.traverse((node) => {
            if(node.name === LANDSCAPE_MESH.WATERFALL) {
                this._modifyWaterMaterial(node)
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

    _modifyWaterMaterial(node) {
        node.material.onBeforeCompile = (shader) => {
            shader.uniforms.uTime = this.waterfallUniforms.uTime;

            //modify <common>
            shader.vertexShader = shader.vertexShader.replace(
                "#include <common>",
                `
                    #include <common>
                    uniform float uTime;
                `
            );

            //modify <begin_vertex>
            shader.vertexShader = shader.vertexShader.replace(
                "#include <begin_vertex>",
                `
                    #include <begin_vertex>
                    float elevation = (sin(abs(transformed.z) * 3.5 + uTime) * cos(abs(transformed.x) * 3.5 + uTime) * 0.1);
                    transformed.y += elevation * (0.5 + transformed.y) * 0.7;
                `
            );
        }
    }


    update(elapsed) {
        this.waterfallUniforms.uTime.value = elapsed;
    }

}

export default Landscape;