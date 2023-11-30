import WorldModel from "./WorldModel.js";

/**
 * Used to handle animated objects
 */
class WorldAnimatedObject extends WorldModel {

    /**
     * The raycaster passed is the front facing raycaster so the main object
     * @param name
     * @param raycaster
     * @param props
     */
    constructor(name, raycaster, props = null) {
        super(name);
        this.raycaster = raycaster;
        this.props = props;
    }

    /**
     * called from outside of this class
     */
    initialize() {
        super.initialize(() => this.callbackAfterLoading());
    }

    /**
     * Called after loading 3d model is done
     */
    callbackAfterLoading() {
        this._traverseModel();
        this.raycaster.addMultipleObjectsToIntersect(this.modelInstance)
        this.props ? this.updatePositionAndRotation(this.props) : null;
    }

    /**
     * Used to animate 3d model
     */
    rotateOnLoop() {
        if(this.animatedNode) {
            this.animatedNode.rotation.y += 0.01;
        }
    }

    /**
     * Used to pass through each mesh of the 3d model
     */
    _traverseModel() {
        this.modelInstance.traverse((node) => {
            if (node.isMesh) {
                if(node.name.includes("Cube")) {
                    this.animatedNode = node;
                }
            }
        });
    }

    /**
     * Update position and rotation based
     * @param props {object}
     */
    updatePositionAndRotation(props) {
        Object.keys(props).forEach(prop => {
            Object.keys(props[prop]).forEach(axis => {
                this.modelInstance[prop][axis] = props[prop][axis];
            })
        })
    }

}

export default WorldAnimatedObject;