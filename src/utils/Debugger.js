import {Pane} from "tweakpane";
import RequiredObjects from "../requiredObjects/RequiredObjects.js";

class Debugger extends RequiredObjects{
    constructor() {
        super();
        this.pane = new Pane();
    }

    initialize() {
    }

    getInstance() {
        return this.pane;
    }

    createFolder(folderTitle, props, callback) {
        const newPane = this.pane.addFolder({
            title: folderTitle
        });
        Object.keys(props).forEach(key => {
            newPane
                .addInput(props, key)
                .on('change', (event) => {
                    console.log(key, event.value)
                    callback(key, event.value);
                })
        });
        return props;
    }
}

export default Debugger