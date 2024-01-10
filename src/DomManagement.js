import {Manager} from "./Manager.js";
import {IMG_IDS, OBJECTIVES} from "./constants/DOM_CONSTANTS.js";
import {SOUND_NAMES} from "./constants/SOUND_CONSTANTS.js";
import {WEATHER_SCENARIOS} from "./constants/WEAHTER_CODES.js";
import {TIME} from "./constants/DATE_AND_LOCATION.js";
import {MODAL_TEXT} from "./constants/MODAL_TEXT.js";

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
        this.callbackOnCloseModal = null;
        this._getElements();
        this._listenToBtns();
    }

    /**
     * Called in Manager to hide the modal
     */
    hide() {
        this.textModal.classList.add('hidden');
    }

    /**
     * Change the text for modal and show it
     *
     * Can add a callback that will be played one time after closing the modal
     * @param text
     * @param callback
     */
    showModal(text, callback = null) {
        this.text.innerText = text;
        this.textModal.classList.remove('hidden');
        if(callback) {
            this.callbackOnCloseModal = callback;
        }
    }

    /**
     * Get the dom elements
     * @private
     */
    _getElements() {
        // Loader and main page elements
        this.loadPage = document.getElementById("loader-page");
        this.mainPage = document.getElementById("main-page");

        //Loading Text
        this.itemsLoaded = document.getElementById("items-loaded");
        this.itemsTotal = document.getElementById("items-loaded");
        this.loadingText = document.getElementById("loading-text-id");
        this.loadingReady = document.getElementById("loading-ready");
        // Modal elements
        this.textModal = document.getElementById("text-modal-id");
        this.closeBtn = document.getElementById("close-btn-id");
        this.text = document.getElementById("text-id");

        // Button containers
        this.wssBtn = document.getElementById("wss-container");
        this.dbBtn = document.getElementById("db-container");
        this.eggBtn = document.getElementById("egg-container");
        this.musicBtn = document.getElementById("music-container");

        // Sound and music elements
        this.soundChecker = document.getElementById("sound-checker-id");
        this.soundStatus = document.getElementById("sound-status-id");
        this.musicChecker = document.getElementById("music-checker-id");
        this.musicStatus = document.getElementById("music-status-id");
        this.musicModal = document.getElementById("music-modal");

        // Daytime and weather elements
        this.daytimeChecker = document.getElementById("day-night-checker-id");
        this.daytimeDiv = document.getElementById("daytime-div");
        this.clearScenario = document.getElementById("weather-clear-id");
        this.rainScenario = document.getElementById("weather-rain-id");
        this.snowScenario = document.getElementById("weather-snow-id");
        this.lavaScenario = document.getElementById("weather-lava-id");
        this.scenarios = document.getElementById("scenarios-id");

        // Control buttons
        this.beginBtn = document.getElementById("begin-btn");
        this.returnBtn = document.getElementById("return-btn-id");
        this.loadBtn = document.getElementById("load-btn");

        // Training elements
        this.acceptBtn = document.getElementById("accept-btn-id");
        this.declineBtn = document.getElementById("decline-btn-id");
        this.training = document.getElementById("training-id");
    }


    /**
     * Here are added on btn listeners
     * @private
     */
    _listenToBtns() {
        this.closeBtn.addEventListener('click', () => this._closeTextModal());
        this.beginBtn.addEventListener('click', () => this._exitLoaderPage());
        this.returnBtn.addEventListener('click', () => this._exitMainPage());

        this.acceptBtn.addEventListener('click', () => this._startGameWithLocation());
        this.declineBtn.addEventListener('click', () => this._startGameWithoutLocation());

        this.wssBtn.addEventListener("click", () => this.openObjectiveModal(OBJECTIVES.WSS));
        this.dbBtn.addEventListener("click", () => this.openObjectiveModal(OBJECTIVES.DB));
        this.eggBtn.addEventListener("click", () => this.openObjectiveModal(OBJECTIVES.EGG));
        this.musicBtn.addEventListener("click", () => this.openObjectiveModal(OBJECTIVES.MUSIC));

        this.soundChecker.addEventListener("change", () => this._onChangeSoundChecker());
        this.musicChecker.addEventListener("change", () => this._onChangeMusicChecker());

        this.daytimeChecker.addEventListener("change", () => this._changeDaytimeScenario());
        this.clearScenario.addEventListener("click", () => this.changeWeatherScenario(WEATHER_SCENARIOS.CLEAR));
        this.rainScenario.addEventListener("click", () => this.changeWeatherScenario(WEATHER_SCENARIOS.RAIN));
        this.snowScenario.addEventListener("click", () => this.changeWeatherScenario(WEATHER_SCENARIOS.SNOW));
        this.lavaScenario.addEventListener("click", () => this.changeWeatherScenario(WEATHER_SCENARIOS.LAVA));
    }

    /**
     * Called on exit btn from text modal
     *
     * If the modal was opened with callback option, trigger it then clean the attribute
     * @private
     */
    _closeTextModal() {
        Manager.closeModal();
        this._removeModalChecked();
        if(this.callbackOnCloseModal) {
            this.callbackOnCloseModal();
            this.callbackOnCloseModal = null;
        }
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
        this._removeModalChecked();
        switch (obj) {
            case OBJECTIVES.DB:
                if(this.dbActive) {
                    Manager.openModal(MODAL_TEXT.DB);
                    this.dbBtn.classList.add("modal-checked");
                }
                break;
            case OBJECTIVES.WSS:
                if(this.wssActive) {
                    Manager.openModal(MODAL_TEXT.WSS);
                    this.wssBtn.classList.add("modal-checked");
                }
                break;
            case OBJECTIVES.EGG:
                if(this.eggActive) {
                    Manager.openModal(MODAL_TEXT.EGG);
                    this.eggBtn.classList.add("modal-checked");
                }
                break;
            case OBJECTIVES.MUSIC:
                if(this.musicActive) {
                    Manager.openModal(MODAL_TEXT.MUSIC);
                    this.musicBtn.classList.add("modal-checked");
                }
                break;
            default:
                break;
        }
    }

    /**
     * Remove check style from all objectives
     * @private
     */
    _removeModalChecked() {
        this.dbBtn.classList.remove("modal-checked");
        this.wssBtn.classList.remove("modal-checked");
        this.eggBtn.classList.remove("modal-checked");
        this.musicBtn.classList.remove("modal-checked");
    }

    /**
     * Handles sounds (mute or unmute)
     * @private
     */
    _onChangeSoundChecker() {
        if(this.soundChecker.checked) {
            this.soundStatus.innerText = "Unmute";
            this.soundStatus.classList.add("sound-on");
            Manager.unmuteAllSounds();
        } else {
            this.soundStatus.innerText = "Mute";
            this.soundStatus.classList.remove("sound-on");
            Manager.muteAllSounds();
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
            Manager.playPuya();
        } else {
            this.musicStatus.innerText = "Default";
            this.musicStatus.classList.add("default-name");
            this.musicStatus.classList.remove("music-on");
            Manager.stopPuya();
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
            Manager.changeTimeScenario(TIME.NIGHT);
        } else {
            Manager.changeTimeScenario(TIME.DAY);
        }
    }

    /**
     * Change weather scenarios from html
     * @param weather
     */
    changeWeatherScenario(weather) {
        this._onScenarioChange();
        switch (weather) {
            case WEATHER_SCENARIOS.CLEAR:
                Manager.changeWeatherScenario(SOUND_NAMES.MAIN, WEATHER_SCENARIOS.CLEAR);
                this.clearScenario.classList.add("weather-checked");
                break;
            case WEATHER_SCENARIOS.RAIN:
                Manager.changeWeatherScenario(SOUND_NAMES.RAIN, WEATHER_SCENARIOS.RAIN);
                this.rainScenario.classList.add("weather-checked");
                break;
            case WEATHER_SCENARIOS.SNOW:
                Manager.changeWeatherScenario(SOUND_NAMES.SNOW, WEATHER_SCENARIOS.SNOW);
                this.snowScenario.classList.add("weather-checked");
                break;
            case WEATHER_SCENARIOS.LAVA:
                Manager.changeWeatherScenario(SOUND_NAMES.LAVA, WEATHER_SCENARIOS.LAVA);
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

    /**
     * Used to set dayTime input checker
     * @param flag
     */
    setDayTimeChecked(flag) {
        this.daytimeChecker.checked = flag;
    }

    /**
     * Show scenarios modal
     */
    unlockScenarios() {
        this.scenarios.classList.remove("hidden");
    }

    /**
     * Remove the loading btn
     */
    stopLoading() {
        this.loadBtn.classList.add("hidden");
        this.beginBtn.classList.remove("hidden");

        this.loadingText.classList.add("hidden");
        this.loadingReady.classList.remove("hidden");
    }

    /**
     * Exit loader page (move it to the left)
     * @private
     */
    _exitLoaderPage() {
        this.loadPage.classList.add("translated-left");
        this.mainPage.classList.remove("translated-right");
    }

    /**
     * Exit main page (move it to the right)
     * @private
     */
    _exitMainPage() {
        this.loadPage.classList.remove("translated-left");
        this.mainPage.classList.add("translated-right");
    }

    /**
     * Get user's info
     * @private
     */
    _startGameWithLocation() {
        Manager.startGameWithLocation();
        this.training.classList.add("hidden");
    }

    /**
     * No user's info
     * @private
     */
    _startGameWithoutLocation() {
        Manager.startGameWithoutLocation();
        this.training.classList.add("hidden");
    }

    /**
     * Update no of items loaded
     * @param itemsLoaded
     * @param totalItems
     */
    updateLoadingInfo(itemsLoaded, totalItems) {
        this.loadingText.classList.remove("hidden")
        this.itemsLoaded.innerText = itemsLoaded;
        this.itemsTotal.innerText = totalItems;
    }

}

export default DomManagement;