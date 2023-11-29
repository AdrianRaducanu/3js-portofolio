import {Raycaster, Vector3} from "three";

class CustomRaycaster {
    constructor(origin, direction, near = 0, far = 10) {
        this.raycastingOrigin = origin;
        this.raycastingDirection = direction;
        this.raycastingDirection.normalize();

        this.raycaster = new Raycaster(this.raycastingOrigin, this.raycastingDirection, 0, 10);

        this.objectToIntersect = {};
        this.objectsToIntersect = [];
    }

    addSingleObjectToIntersect(mesh) {
        this.objectToIntersect = mesh;
    }

    addMultipleObjectsToIntersect(mesh) {
        this.objectsToIntersect.push(mesh);
    }

    changeOrigin(newOrigin) {
        this.raycaster.set(newOrigin, this.raycastingDirection);
        this.raycastingOrigin = newOrigin;
    }

    changeDirectionBasedOnAngle(angle) {
        const newDirection = new Vector3(-Math.sin(angle), 0, -Math.cos(angle));
        newDirection.normalize();
        this.raycaster.set(this.raycastingOrigin, newDirection);
        this.raycastingDirection = newDirection
    }

    hasCollied() {
        if(this.raycaster.intersectObjects(this.objectsToIntersect).length) {
            return this.raycaster.intersectObjects(this.objectsToIntersect);
        }
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

export default CustomRaycaster;