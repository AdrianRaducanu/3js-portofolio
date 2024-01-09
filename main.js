import {Manager} from "./src/Manager.js";
import DomManagement from "./src/DomManagement.js";
import SoundManagement from "./src/SoundManagement.js";
import Engine from "./src/Engine.js";

const startGame = () => {
    DomManagement.instance.initialize();
    SoundManagement.instance.initialize();

    const engineCanvas = document.getElementById('canvas');
    Engine.instance.initialize(engineCanvas);
}

startGame()

window.Manager = Manager;

export default Manager;








