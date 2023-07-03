
class Enforcer {

}

class EventHandler {
    static get instance() {
        if(!Enforcer._instance) {
            Enforcer._instance = new EventHandler(new Enforcer());
        }
        return Enforcer._instance;
    }

    constructor(enforcer) {
        if(!enforcer || !(enforcer instanceof Enforcer)) {
            throw new Error("Use EventHandler.instance!");
        }
        Enforcer._instance = this;
    }

    onKeyPress(key, prop, value) {
        window.addEventListener('keydown', (event) => {
            console.log(event)
        })
    }
}

export default EventHandler;