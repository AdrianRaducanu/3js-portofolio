import {API} from "./src/API.js";
import Engine from "./src/Engine.js";
import DomManagement from "./src/DomManagement.js";
import SoundManagement from "./src/SoundManagement.js";

const engineCanvas = document.getElementById('canvas');

Engine.instance.initialize(engineCanvas);
DomManagement.instance.initialize();
SoundManagement.instance.initialize();

window.API = API;

export default API;








