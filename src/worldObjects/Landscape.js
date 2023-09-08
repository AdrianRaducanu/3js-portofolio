import WorldModel from "./objectClasses/WorldModel.js";
import {CAVE_MESH, GRASS_MESH, LEAF_MESH, ROAD_MESH, TREE_MESH} from "./constants/CONST.js";

class Landscape extends WorldModel{

    constructor(name, raycaster) {
        super(name);
        this.raycaster = raycaster;
    }

    initialize() {
        super.importModel(this.name, () => this.callbackAfterModelLoad());
    }

    callbackAfterModelLoad() {
        const road = this.modelInstance.children.filter(child => child.name === ROAD_MESH);
        this.raycaster.createObjectToIntersect(road[0]);

        this.addShadow();
    }

    addShadow() {
        this.modelInstance.traverse((node) => {
            switch (node.name) {
                case TREE_MESH:
                case LEAF_MESH:
                    node.castShadow = true;
                    break;
                case ROAD_MESH:
                case GRASS_MESH:
                case CAVE_MESH:
                    node.receiveShadow = true;
                    break;
                default:
                    break;
            }
        });
    }



}

export default Landscape;