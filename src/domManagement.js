
class Enforcer {}

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

    initialize() {
        this.textModule = document.getElementById("text-module-id");
    }

    hide() {
        this.textModule.classList.add('hidden');
    }

    show() {
        this.textModule.classList.remove('hidden');
    }

}

export default domManagement;