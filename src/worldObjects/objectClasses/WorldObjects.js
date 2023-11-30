/**
 * Base class, used to handle world objects
 */
class WorldObjects {
    constructor(name, props = null) {
        this.name = name;
        this.properties = props;
    }

    initialize() {
    }

    _addInScene() {
        throw new Error("Must implement addInScene");
    }
}

export default WorldObjects;