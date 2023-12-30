import {API} from "./src/API.js";
import DomManagement from "./src/DomManagement.js";
import SoundManagement from "./src/SoundManagement.js";
import Starter from "./src/Starter.js";

const engineCanvas = document.getElementById('canvas');
//Right now start the engine based on user location and time
Starter.startEngineBasedOnWeatherAndTime(engineCanvas);

DomManagement.instance.initialize();
SoundManagement.instance.initialize();

window.API = API;

export default API;








