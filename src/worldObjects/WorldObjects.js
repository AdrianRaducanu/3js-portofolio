class WorldObjects {
    constructor() {
    }

    initialize() {

    }

    _addInScene() {
        throw new Error("Must implement addInScene");
    }

    _createInitialProperties() {
        throw new Error("Must implement createInitialProperties");
    }

    _setupDebugger() {
        throw new Error("Must implement setupDebugger");
    }

    _setProperty() {
        throw new Error("Must implement setProperty");
    }
}

export default WorldObjects;