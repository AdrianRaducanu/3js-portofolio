import {API} from "./API.js";
import {IMG_IDS, OBJECTIVES} from "./constants/DOM_CONSTANTS.js";
import {SOUND_NAMES} from "./constants/SOUND_CONSTANTS.js";
import {WEATHER_SCENARIOS} from "./constants/WEAHTER_CODES.js";

class Enforcer {}

/**
 * Used to manipulate html and css outside the canvas
 *
 * Singleton
 */
class DomManagement {

    static get instance() {
        if (!Enforcer._instance) {
            Enforcer._instance = new DomManagement(new Enforcer());
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
        this.dbActive = false;
        this.wssActive = false;
        this.eggActive = false;
        this.musicActive = false;
        this._getElements();
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
     * Change the text for modal
     * @param text
     */
    changeModalText(text) {
        this.text.innerText = text;
        API.openModal();
    }

    /**
     * Get the dom elements
     * @private
     */
    _getElements() {
        this.textModal = document.getElementById("text-modal-id");
        this.closeBtn = document.getElementById("close-btn-id");
        this.text = document.getElementById("text-id");
        this.wssBtn = document.getElementById("wss-container");
        this.dbBtn = document.getElementById("db-container");
        this.eggBtn = document.getElementById("egg-container");
        this.musicBtn = document.getElementById("music-container");
        this.soundChecker = document.getElementById("sound-checker-id");
        this.soundStatus = document.getElementById("sound-status-id");
        this.musicChecker = document.getElementById("music-checker-id");
        this.musicStatus = document.getElementById("music-status-id");
        this.musicModal = document.getElementById("music-modal");
        this.daytimeChecker = document.getElementById("day-night-checker-id");
        this.daytimeDiv = document.getElementById("daytime-div");
        this.clearScenario = document.getElementById("weather-clear-id");
        this.rainScenario = document.getElementById("weather-rain-id");
        this.snowScenario = document.getElementById("weather-snow-id");
        this.lavaScenario = document.getElementById("weather-lava-id");
    }

    /**
     * Here are added on btn listeners
     * @private
     */
    _listenToBtns() {
        this.closeBtn.addEventListener('click', () => this._closeTextModal());

        this.wssBtn.addEventListener("click", () => this.openObjectiveModal(OBJECTIVES.WSS));
        this.dbBtn.addEventListener("click", () => this.openObjectiveModal(OBJECTIVES.DB));
        this.eggBtn.addEventListener("click", () => this.openObjectiveModal(OBJECTIVES.EGG));
        this.musicBtn.addEventListener("click", () => this.openObjectiveModal(OBJECTIVES.MUSIC));

        this.soundChecker.addEventListener("change", () => this._onChangeSoundChecker());
        this.musicChecker.addEventListener("change", () => this._onChangeMusicChecker());

        this.daytimeChecker.addEventListener("change", () => this._changeDaytimeScenario());
        this.clearScenario.addEventListener("click", () => this._changeWeatherScenario(WEATHER_SCENARIOS.CLEAR));
        this.rainScenario.addEventListener("click", () => this._changeWeatherScenario(WEATHER_SCENARIOS.RAIN));
        this.snowScenario.addEventListener("click", () => this._changeWeatherScenario(WEATHER_SCENARIOS.SNOW));
        this.lavaScenario.addEventListener("click", () => this._changeWeatherScenario(WEATHER_SCENARIOS.LAVA));
    }

    /**
     * Called on exit btn from text modal
     * @private
     */
    _closeTextModal() {
        API.closeModal();
    }

    /**
     * Used to unlock objectives
     * @param obj
     */
    unlockObjective(obj) {
        switch (obj) {
            case OBJECTIVES.DB:
                this._changeImg(IMG_IDS.DB, this.dbActive);
                this.dbActive = true;
                break;
            case OBJECTIVES.WSS:
                this._changeImg(IMG_IDS.WSS, this.wssActive);
                this.wssActive = true;
                break;
            case OBJECTIVES.EGG:
                this._changeImg(IMG_IDS.EGG, this.eggActive);
                this.eggActive = true;
                break;
            case OBJECTIVES.MUSIC:
                this._changeImg(IMG_IDS.MUSIC, this.musicActive);
                this.musicActive = true;
                break;
            default:
                break;
        }
    }

    /**
     * Used to change the images in header
     * Will be triggered just the first time the cat finds it
     * @param id
     * @param isActive
     * @private
     */
    _changeImg(id, isActive) {
        if(isActive) {
            return
        }
        const img = document.getElementById(id);
        const imgQuestion = document.getElementById(id + "-q");
        const blockToAnimate = document.getElementById(id + "-block");

        blockToAnimate.classList.add('play-animation')
        imgQuestion.classList.add('hidden');
        img.classList.remove('hidden');

    }

    /**
     * Change the text inside the modal based on the discovered objective
     * @param obj
     */
    openObjectiveModal(obj) {
        switch (obj) {
            case OBJECTIVES.DB:
                if(this.dbActive) {
                    this.changeModalText("1232");
                }
                break;
            case OBJECTIVES.WSS:
                if(this.wssActive) {
                    this.changeModalText("324354");
                }
                break;
            case OBJECTIVES.EGG:
                if(this.eggActive) {
                    this.changeModalText("3243567yhretgv");
                }
                break;
            case OBJECTIVES.MUSIC:
                if(this.musicActive) {
                    this.changeModalText("oinvo");
                }
                break;
            default:
                break;
        }
    }

    /**
     * Handles sounds (mute or unmute)
     * @private
     */
    _onChangeSoundChecker() {
        if(this.soundChecker.checked) {
            this.soundStatus.innerText = "Unmute";
            this.soundStatus.classList.add("sound-on");
            API.unmuteAllSounds();
        } else {
            this.soundStatus.innerText = "Mute";
            this.soundStatus.classList.remove("sound-on");
            API.muteAllSounds();
        }
    }

    /**
     * Handles sounds (mute or unmute)
     * @private
     */
    _onChangeMusicChecker() {
        if(this.musicChecker.checked) {
            this.musicStatus.innerText = "Puya";
            this.musicStatus.classList.add("music-on");
            this.musicStatus.classList.remove("default-name");
            API.playPuya();
        } else {
            this.musicStatus.innerText = "Default";
            this.musicStatus.classList.add("default-name");
            this.musicStatus.classList.remove("music-on");
            API.stopPuya();
        }
    }

    unlockPuya() {
        this.musicModal.classList.remove("hidden");
    }

    /**
     * Change daytime scenarios from html
     * @private
     */
    _changeDaytimeScenario() {
        if(this.daytimeChecker.checked) {
            API.onNightTime();
        } else {
            API.onDayTime();
        }
    }

    /**
     * Change weather scenarios from html
     * @param weather
     * @private
     */
    _changeWeatherScenario(weather) {
        this._onScenarioChange();
        switch (weather) {
            case WEATHER_SCENARIOS.CLEAR:
                API.onClearScenario();
                API.toggleMainTheme(SOUND_NAMES.MAIN);
                this.clearScenario.classList.add("weather-checked");
                break;
            case WEATHER_SCENARIOS.RAIN:
                API.onRainScenario();
                API.toggleMainTheme(SOUND_NAMES.RAIN);
                this.rainScenario.classList.add("weather-checked");
                break;
            case WEATHER_SCENARIOS.SNOW:
                API.onSnowScenario();
                API.toggleMainTheme(SOUND_NAMES.SNOW);
                this.snowScenario.classList.add("weather-checked");
                break;
            case WEATHER_SCENARIOS.LAVA:
                API.onLavaScenario();
                API.toggleMainTheme(SOUND_NAMES.LAVA);
                this.lavaScenario.classList.add("weather-checked");
                this.daytimeDiv.classList.add("unclickable");
                break;
            default:
                break;
        }
    }

    /**
     * Remove green border
     * @private
     */
    _onScenarioChange() {
        this.clearScenario.classList.remove("weather-checked");
        this.rainScenario.classList.remove("weather-checked");
        this.snowScenario.classList.remove("weather-checked");
        this.lavaScenario.classList.remove("weather-checked");
        this.daytimeDiv.classList.remove("unclickable");
    }

}

export default DomManagement;