import {Manager} from "./src/Manager.js";
import DomManagement from "./src/DomManagement.js";
import SoundManagement from "./src/SoundManagement.js";
import Engine from "./src/Engine.js";

const startGame = () => {
    const engineCanvas = document.getElementById('canvas');
    Engine.instance.initialize(engineCanvas);

    DomManagement.instance.initialize();
    SoundManagement.instance.initialize();
}

startGame()

window.Manager = Manager;

export default Manager;








