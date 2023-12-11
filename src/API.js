import Engine from "./Engine.js";

export const API = {
    freeze: function () {
        Engine.instance.freezeApp();
    },

    unfreeze: function () {
        Engine.instance.unfreezeApp();
    }
}