import {API} from "./API.js";

class Enforcer {}

/**
 * Used to manipulate html and css outside the canvas
 *
 * Singleton
 */
class domManagement {

    static get instance() {
        if (!Enforcer._instance) {
            Enforcer._instance = new domManagement(new Enforcer());
        }
        return Enforcer._instance;
    }

    constructor(enforcer) {
        if (!enforcer || !(enforcer instanceof Enforcer)) {
            throw new Error("Use Engine.instance!");
        }
        Enforcer._instance = this;
    }

    /**
     * Called in main.js, will get the html elements that are gonna be manipulated
     * and will start listening to events
     */
    initialize() {
        this.textModal = document.getElementById("text-modal-id");
        this.closeBtn = document.getElementById("close-btn-id");
        this.text = document.getElementById("text-id");
        this._listenToBtns();
    }

    /**
     * Called in API to hide the modal
     */
    hide() {
        this.textModal.classList.add('hidden');
    }

    /**
     * Called in API to display the modal
     */
    show() {
        this.textModal.classList.remove('hidden');
    }

    /**
     *
     * @param text
     */
    changeText(text) {
        console.log(text)
        console.log(this.text)
        this.text.innerText = text.textDescription;
        this.closeBtn.innerText = text.textBtn;
        API.openModal();
    }

    /**
     * Here are added on btn listeners
     * @private
     */
    _listenToBtns() {
        this.closeBtn.addEventListener('click', () => this._closeTextModal());
    }

    /**
     * Called on exit btn from text modal
     * @private
     */
    _closeTextModal() {
        API.closeModal();
    }

}

export default domManagement;