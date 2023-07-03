class WorldObjects {
    constructor(name, props) {
        this.name = name;
        this.properties = props;
    }

    initialize() {

    }

    _addInScene() {
        throw new Error("Must implement addInScene");
    }
    _setupDebugger() {
        throw new Error("Must implement setupDebugger");
    }

    setProperty(key, value) {
        throw new Error("Must implement setProperty");
    }
}

export default WorldObjects;