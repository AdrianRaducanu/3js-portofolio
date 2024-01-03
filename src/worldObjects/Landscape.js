import WorldModel from "./objectClasses/WorldModel.js";
import {LANDSCAPE_MESH} from "./constants/CONST.js";

class Landscape extends WorldModel{

    /**
     * The raycaster that the landscape interacts with (down facing raycaster)
     * @param name
     * @param raycaster
     */
    constructor(name, raycaster) {
        super(name);
        this.raycaster = raycaster;
        this.waterfallUniforms = {
            uTime: {value: 0}
        };
        this.defaultColors = {}
    }

    /**
     * Called from outside of this class
     */
    initialize() {
        super.initialize(() => this.callbackAfterModelLoad())
    }

    /**
     * Called after model is loaded
     */
    callbackAfterModelLoad() {
        this.modelInstance.traverse((node) => {
            if(node.name === LANDSCAPE_MESH.WATERFALL) {
                this.waterfall = node;
                this.defaultColors.waterfall = {...node.material.color};
                this._modifyWaterMaterial(node);
            }
            if(node.name === LANDSCAPE_MESH.SNOW) {
                this.snow = node;
            }
            if(node.name === LANDSCAPE_MESH.ROAD_MESH) {
                this.defaultColors.road = {...node.material.color};
                this.road = node;
            }
            if(node.name === LANDSCAPE_MESH.CAVE_ROOF_MESH) {
                this.caveRoof = node;
            }
            if(node.name === LANDSCAPE_MESH.GRASS_MESH) {
                this.defaultColors.grass = {...node.material.color};
                this.grass = node;
            }
            if(node.name === LANDSCAPE_MESH.LEAF_MESH) {
                this.defaultColors.leaf = {...node.material.color};
                this.leaf = node;
            }
            this._addShadow(node);
        })

        this.raycaster.addInObjectsToIntersect(this.road);
        this.raycaster.addInObjectsToIntersect(this.caveRoof);
    }

    /**
     * Add shadow based on node
     * @param node
     * @private
     */
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

    /**
     * Used to modify waterfall material
     * @param node
     * @private
     */
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


    /**
     * Update uTime uniform in order to add movement to the waterfall
     * @param elapsed
     */
    update(elapsed) {
        this.waterfallUniforms.uTime.value = elapsed;
    }

    /**
     * Show snow on the ground
     */
    showSnow() {
        this.snow.visible = true;

        this.road.material.color.set("#9ead84");
        this.grass.material.color.set("#b7c0a4");
        this.leaf.material.color.set("#99b7a1");
    }

    /**
     * Hide snow on the ground
     */
    hideSnow() {
        this.snow.visible = false;
        this.road.material.color.set(this.defaultColors.road);
        this.grass.material.color.set(this.defaultColors.grass);
        this.leaf.material.color.set(this.defaultColors.leaf);
    }

    /**
     * Show tree's leaf
     */
    showLeaf() {
        this.leaf.visible = true;
    }

    /**
     * Hide tree's leaf
     */
    hideLeaf() {
        this.leaf.visible = false;
    }

    /**
     * Change material on rain
     */
    onRainMaterial() {
        this.road.material.metalness = 1;

        this.grass.material.metalness = 1;

        this.leaf.material.metalness = 1;
    }

    /**
     * Set default material when there is no rain
     */
    offRainMaterial() {
        this.road.material.metalness = 0;

        this.grass.material.metalness = 0;

        this.leaf.material.metalness = 0;
    }

    /**
     * Change waterfall to Lava
     */
    onLava() {
        this.waterfall.material.color.set("#ff0000");
    }

    /**
     * Change lava to waterfall
     */
    offLava() {
        this.waterfall.material.color.set(this.defaultColors.waterfall);
    }

}

export default Landscape;