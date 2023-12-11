import {API} from "./src/API.js";
import Engine from "./src/Engine.js";
import DomManagement from "./src/domManagement.js";

Engine.instance.initialize();
DomManagement.instance.initialize();

window.API = API;

export default API;








