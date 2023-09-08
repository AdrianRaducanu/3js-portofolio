import {Raycaster, Vector3} from "three";

class RaycasterPoint {
    constructor() {
        this.raycastingOrigin = new Vector3(0, 1, 0);
        this.raycastingDirection = new Vector3(0, -10, 0);
        this.raycastingDirection.normalize();

        this.raycaster = new Raycaster(this.raycastingOrigin, this.raycastingDirection, 0, 2);
    }

    createObjectToIntersect(mesh) {
        this.objectToIntersect = mesh;
    }

    verifyNextStep(posX, posZ) {
        const fakeOrigin = new Vector3(posX, 1, posZ);
        this.raycaster.set(fakeOrigin, this.raycastingDirection);
        const fakeCollision = this.raycaster.intersectObject(this.objectToIntersect);
        if(fakeCollision) {
            this.raycastingOrigin = fakeOrigin;
        } else {
            this.raycaster.set(this.raycastingOrigin, this.raycastingDirection);
        }
        return fakeCollision;
    }
}

export default RaycasterPoint;