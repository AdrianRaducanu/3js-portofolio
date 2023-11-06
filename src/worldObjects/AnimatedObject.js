import WorldModel from "./objectClasses/WorldModel.js";

class AnimatedObject extends WorldModel {
    constructor(name, raycaster, props = null) {
        super(name);
        this.raycaster = raycaster;
        this.props = props;
    }

    initialize() {
        super.initialize(() => this.callbackAfterLoading());
    }

    callbackAfterLoading() {
        this.addShadow();
        this.props ? this.updatePositionAndRotation() : null;
    }

    rotateAnimatedNode() {
        this.animatedNode ?
            this.animatedNode.rotation.y += 0.01 :
            null;
    }

    addShadow() {
        this.modelInstance.traverse((node) => {
            if (node.isMesh) {
                //node.castShadow = true;
                if(node.name.includes("Cube")) {
                    this.animatedNode = node;
                }
                node.receiveShadow = true;
            }
        });
    }

    updatePositionAndRotation() {
        Object.keys(this.props).forEach(prop => {
            Object.keys(this.props[prop]).forEach(axis => {
                this.modelInstance[prop][axis] = this.props[prop][axis];
            })
        })
    }

}

export default AnimatedObject;