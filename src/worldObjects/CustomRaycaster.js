import {Raycaster, Vector3} from "three";

/**
 * Used to create raycasters
 */
class CustomRaycaster {

    constructor(name, origin, direction) {
        this.name = name;
        this.raycastingOrigin = origin;
        this.raycastingDirection = direction;
        this.raycastingDirection.normalize();

        this.raycaster = new Raycaster(this.raycastingOrigin, this.raycastingDirection, 0, 10);

        this.objectsToIntersect = [];
    }

    /**
     * Add multiple objects to intersect
     * Used for front facing raycaster
     * @param obj
     */
    addInObjectsToIntersect(obj) {
        this.objectsToIntersect.push(obj);
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
     * @param raycasterPos
     */
    changeDirectionBasedOnAngle(angle, raycasterPos) {
        const newDirection = new Vector3(-Math.sin(angle), raycasterPos.Y, -Math.cos(angle));
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
     * @param posY
     * @param posZ
     * @returns {[]}
     */
    verifyNextStep(posX, posY, posZ) {
        const fakeOrigin = new Vector3(posX, posY, posZ);
        this.raycaster.set(fakeOrigin, this.raycastingDirection);
        const fakeCollision = this.raycaster.intersectObjects(this.objectsToIntersect);
        if(!fakeCollision.length) {
            this.raycastingOrigin = fakeOrigin;
        } else {
            this.raycaster.set(this.raycastingOrigin, this.raycastingDirection);
        }
        return fakeCollision;
    }
}

export default CustomRaycaster;