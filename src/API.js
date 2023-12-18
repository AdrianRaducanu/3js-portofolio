import Engine from "./Engine.js";
import DomManagement from "./DomManagement.js";

/**
 * Can be tested in console
 *
 * Combine the engine and the dom manipulation
 * @type {{openModal: API.openModal, closeModal: API.closeModal}}
 */
export let API = {
    closeModal: function() {
        DomManagement.instance.hide();
        Engine.instance.unfreezeApp();
    },

    openModal: function() {
        Engine.instance.freezeApp();
        DomManagement.instance.show();
    },

    unlockObjective: function(obj) {
        DomManagement.instance.unlockObjective(obj);
    }
}