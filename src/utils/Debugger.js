import {Pane} from "tweakpane";
import {MEASUREMENT_UNITS} from "../constants/UNITS.js";

class Debugger {
    constructor() {
        this.pane = new Pane();
    }

    initialize() {
        this._createUnitsPane();
    }

    _createUnitsPane() {
        this.unitsPane = this.pane.addFolder({
            title: "Units"
        });
        this.unitsPane
            .addInput(MEASUREMENT_UNITS, "BASIC")
            .on("change", (ev) => {
                MEASUREMENT_UNITS.BASIC = ev.value;
            })

    }
}

export default Debugger