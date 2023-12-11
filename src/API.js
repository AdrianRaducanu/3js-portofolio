import Engine from "./Engine.js";
import domManagement from "./domManagement.js";

export const API = {
    GAME: {
        freeze: function () {
            Engine.instance.freezeApp();
        },

        unfreeze: function () {
            Engine.instance.unfreezeApp();
        }
    },

    DOM: {
        hide: function () {
            domManagement.instance.hide();
        },

        show: function () {
            domManagement.instance.show();
        }
    }
}