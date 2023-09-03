import WorldModel from "./objectClasses/WorldModel.js";

class Landscape extends WorldModel{

    constructor(name, props) {
        super(name, props);

    }

    initialize() {
        super.importModel(this.name, () => this.callbackAfterModelLoad());
    }

    callbackAfterModelLoad() {

    }


}

export default Landscape;