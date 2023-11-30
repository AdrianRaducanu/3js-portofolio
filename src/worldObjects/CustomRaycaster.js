import {Raycaster, Vector3} from "three";

/**
 * Used to create raycasters
 */
class CustomRaycaster {

    constructor(origin, direction, near = 0, far = 10) {
        this.raycastingOrigin = origin;
        this.raycastingDirection = direction;
        this.raycastingDirection.normalize();

        this.raycaster = new Raycaster(this.raycastingOrigin, this.raycastingDirection, 0, 10);

        this.objectToIntersect = {};
        this.objectsToIntersect = [];
    }

    /**
     * Add a single object to intersect (used to restrict walking)
     * @param mesh
     */
    addSingleObjectToIntersect(mesh) {
        this.objectToIntersect = mesh;
    }

    /**
     * Add multiple objects to intersect
     * Used for front facing raycaster
     * @param mesh
     */
    addMultipleObjectsToIntersect(mesh) {
        this.objectsToIntersect.push(mesh);
    }

    /**
     * Change origin of the raycast, used when the cat is moving
     * @param newOrigin
     */
    changeOrigin(newOrigin) {
        this.raycaster.set(newOrigin, this.raycastingDirection);
        this.raycastingOrigin = newOrigin;
    }

    /**
     * Change the direction of the raycast, used when the cat is rotating
     * To understand this, remember the trigonometric circle
     * @param angle
     */
    changeDirectionBasedOnAngle(angle) {
        const newDirection = new Vector3(-Math.sin(angle), 0, -Math.cos(angle));
        newDirection.normalize();
        this.raycaster.set(this.raycastingOrigin, newDirection);
        this.raycastingDirection = newDirection
    }

    /**
     * Verify if the raycast is intersecting the multiple objects, used with front facing raycaster
     * @returns {[]}
     */
    hasCollied() {
        if(this.raycaster.intersectObjects(this.objectsToIntersect).length) {
            return this.raycaster.intersectObjects(this.objectsToIntersect);
        }
    }

    /**
     * Verify if the cat can walk on a certain position
     * Creates a fake origin of the raycaster with the position that the cat should have.
     * If there is no collision with the valid area, return collision data and reset the raycast position
     * If there is collision with the valid area, the "fake" origin will be the real origin of the raycast
     * and the cat can update its position
     * @param posX
     * @param posZ
     * @returns {[]}
     */
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