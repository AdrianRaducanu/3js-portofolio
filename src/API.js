import Engine from "./Engine.js";
import domManagement from "./domManagement.js";

/**
 * Can be tested in console
 *
 * Combine the engine and the dom manipulation
 * @type {{openModal: API.openModal, closeModal: API.closeModal}}
 */
export let API = {
    closeModal: function () {
        domManagement.instance.hide();
        Engine.instance.unfreezeApp();
    },

    openModal: function () {
        Engine.instance.freezeApp();
        domManagement.instance.show();
    }
}