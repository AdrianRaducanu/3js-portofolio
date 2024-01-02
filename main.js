import {Manager} from "./src/Manager.js";
import DomManagement from "./src/DomManagement.js";
import SoundManagement from "./src/SoundManagement.js";
import ClientDataGetter from "./src/ClientDataGetter.js";
import Engine from "./src/Engine.js";


const engineCanvas = document.getElementById('canvas');
Engine.instance.initialize(canvas, () => {ClientDataGetter.setWeatherAndTime();});

DomManagement.instance.initialize();
SoundManagement.instance.initialize();

window.Manager = Manager;

export default Manager;








