import Engine from "./Engine.js";
import DomManagement from "./DomManagement.js";
import {OBJECTIVES} from "./constants/DOM_CONSTANTS.js";
import SoundManagement from "./SoundManagement.js";
import {SOUND_NAMES} from "./constants/SOUND_CONSTANTS.js";
import {getWeatherScenario, INVALID_WEATHER_CODE, WEATHER_SCENARIOS} from "./constants/WEAHTER_CODES.js";
import {TIME} from "./constants/DATE_AND_LOCATION.js";
import ClientDataGetter from "./ClientDataGetter.js";
import {MODAL_TEXT} from "./constants/MODAL_TEXT.js";

/**
 * Can be tested in console
 *
 * Combine the engine and management classes
 * @type {{openModal: Manager.openModal, closeModal: Manager.closeModal}}
 */
export const Manager = {

    /**
     * The game is already started, just unfreeze it and unmute sounds (after trainer)
     * User's data
     */
    startGameWithLocation: function() {
        ClientDataGetter.setWeatherAndTime();
        this.unmuteAllSounds();
        SoundManagement.instance.playSound(SOUND_NAMES.LAVA);
        Engine.instance.unfreezeApp();
    },

    /**
     * The game is already started, just unfreeze it and unmute sounds (after trainer)
     * Mockup data
     */
    startGameWithoutLocation: function() {
        this.setWeatherAndTime(INVALID_WEATHER_CODE, TIME.DAY);
        this.unmuteAllSounds();
        SoundManagement.instance.playSound(SOUND_NAMES.LAVA);
        Engine.instance.unfreezeApp();
    },

    /**
     * Will close the modal and restart the cat's movement
     */
    closeModal: function() {
        DomManagement.instance.hide();
        Engine.instance.unfreezeApp();
    },

    /**
     * Will open the modal and stop the cat's movement
     */
    openModal: function(text, callback) {
        Engine.instance.freezeApp();
        DomManagement.instance.showModal(text, callback);
    },

    /**
     * Play a sound
     * @param sound
     */
    playSound: function(sound) {
        SoundManagement.instance.playSound(sound);
    },

    /**
     * Stop a sound
     * @param sound
     */
    stopSound: function(sound) {
        SoundManagement.instance.stopSound(sound);
    },

    /**
     * Called when 3d models have been loaded
     */
    finishLoading: function() {
        DomManagement.instance.stopLoading();
    },

    /**
     * Mute all sounds
     */
    muteAllSounds: function() {
        SoundManagement.instance.muteAll();
    },

    /**
     * unmute all sounds
     */
    unmuteAllSounds: function() {
        SoundManagement.instance.unmuteAll();
    },

    /**
     * Change the main theme
     * @param music
     */
    toggleMainTheme: function (music) {
        const {newMusic, oldMusic} = MusicManager.toggleMainTheme(music);
        const puyaPlaying = MusicManager.getPuya();
        SoundManagement.instance.toggleMusic(newMusic, oldMusic, puyaPlaying);
    },

    /**
     * Play special song and show music notes shaders
     */
    playPuya: function() {
        const {newMusic, oldMusic} = MusicManager.playPuya();
        Engine.instance.setMusicNotesVisibility(true);
        SoundManagement.instance.toggleMusic(newMusic, oldMusic);
    },

    /**
     * Stop special song and stop music notes shaders
     */
    stopPuya: function() {
        const {newMusic, oldMusic} = MusicManager.stopPuya();
        Engine.instance.setMusicNotesVisibility(false);
        SoundManagement.instance.toggleMusic(newMusic, oldMusic);
    },

    /**
     * Verify if an objective is active
     * @param obj
     * @returns {boolean}
     */
    checkObjectiveActive: function (obj) {
        return ActivationManager.getIsActive(obj);
    },

    /**
     * Called when an objective is unlocked
     *
     * If the objective is Music => unlock Music modal (different from sound modal)
     *
     * Everytime an objective is unlocked, verify if all the objectives are unlocked so the game is finished
     * @param obj
     */
    unlockObjective: function(obj) {
        SoundManagement.instance.playSound(SOUND_NAMES.OBJECTIVE);
        DomManagement.instance.unlockObjective(obj);
        ActivationManager.setIsActive(obj);
        if(obj === OBJECTIVES.MUSIC) {
            DomManagement.instance.unlockPuya();
        }
        if(ActivationManager.checkAllObjectives()) {
            this.stopSound(SOUND_NAMES.LAVA);
            setTimeout(() => {
                this.playSound(SOUND_NAMES.WIN);
                this.openModal(MODAL_TEXT.WIN, () => this.onFinishObjectives());
            }, 1000);
        }
    },

    /**
     * Called when all the objectives are unlocked
     *
     * Change the scenario from Lava to the user's data
     */
    onFinishObjectives: function() {
        const {weather, time} = WeatherManager.getWeatherAndTime();
        ActivationManager.setGameFinished();
        if(time === TIME.DAY) {
            Manager.changeTimeScenario(TIME.DAY, true);
        } else {
            Manager.changeTimeScenario(TIME.NIGHT, true);
        }
        DomManagement.instance.changeWeatherScenario(weather);
        DomManagement.instance.unlockScenarios();
    },

    /**
     * Will change scenarios based on the weather and the theme
     *
     * Is in training -> used so the theme won't start before the user have finished the training
     * @param theme
     * @param scenario
     * @param isInTraining
     */
    changeWeatherScenario(theme, scenario, isInTraining = false) {
        const oldWeather = WeatherManager.getWeatherAndTime().weather;
        WeatherManager.setWeather(scenario);
        const {time, weather} = WeatherManager.getWeatherAndTime();
        const gameFinished = ActivationManager.getIsGameFinished();

        //called one time after the game is finished
        //must do that cuz when the api respond, will set the weather and the time and
        //the second if will not work since I don't change any attribute from WeatherManager
        if(gameFinished) {
            this.toggleMainTheme(theme)
            Engine.instance.manageScenario(weather, time);
            return;
        }

        //by doing that, I prevent clicking multiple times on the same scenario
        if(oldWeather !== weather) {
            !isInTraining? this.toggleMainTheme(theme) : null;
            Engine.instance.manageScenario(weather, time);
        }
    },

    /**
     * Will change the time scenario
     * @param dayTime
     * @param gameFinished
     */
    changeTimeScenario(dayTime, gameFinished = false) {
        const oldTime = WeatherManager.getWeatherAndTime().time;
        WeatherManager.setTime(dayTime);
        const {time, weather} = WeatherManager.getWeatherAndTime();

        //called one time after the game is finished
        //must do that cuz when the api respond, will set the weather and the time and
        //the second if will not work since I don't change any attribute from WeatherManager
        if(gameFinished) {
            Engine.instance.manageScenario(weather, time);
            DomManagement.instance.setDayTimeChecked(dayTime !== TIME.DAY);
            return;
        }

        //by doing that, I prevent clicking multiple times on the same scenario
        if(oldTime !== time) {
            Engine.instance.manageScenario(weather, time);
        }
    },

    /**
     * Used when the api will return data
     * Will store the client's weather and time
     * @param weather
     * @param time
     */
    setWeatherAndTime: function(weather, time) {
        WeatherManager.setWeather(getWeatherScenario(weather));
        WeatherManager.setTime(time);
    }
}

/**
 * Used to manage the activation process (first time when an objective is viewed)
 */
export class ActivationManager {
    static jobWSSActivated = false;
    static jobDBActivated = false;
    static eggActivated = false;
    static musicActivated = false;
    static gameFinished = false;

    static getIsActive(obj) {
        switch (obj) {
            case OBJECTIVES.DB:
                return this.jobDBActivated;
            case OBJECTIVES.WSS:
                return this.jobWSSActivated;
            case OBJECTIVES.EGG:
                return this.eggActivated;
            case OBJECTIVES.MUSIC:
                return this.musicActivated;
            default:
                break;
        }
    }

    static setIsActive(obj) {
        switch (obj) {
            case OBJECTIVES.DB:
                this.jobDBActivated = true;
                break;
            case OBJECTIVES.WSS:
                this.jobWSSActivated = true;
                break;
            case OBJECTIVES.EGG:
                this.eggActivated = true;
                break;
            case OBJECTIVES.MUSIC:
                this.musicActivated = true;
                break;
            default:
                break;
        }
    }

    static checkAllObjectives() {
        return this.musicActivated && this.eggActivated && this.jobDBActivated && this.jobWSSActivated;
    }

    static setGameFinished() {
        this.gameFinished = true;
    }

    static getIsGameFinished() {
        const flag = this.gameFinished;
        this.gameFinished = false;
        return flag;
    }
}

/**
 * Used to manage the music
 */
export class MusicManager {
    static mainTheme = SOUND_NAMES.LAVA;
    static playingPuya = false;

    static toggleMainTheme(newMusic) {
        const oldMusic = this.mainTheme;
        this.mainTheme = newMusic;
        return {newMusic: this.mainTheme, oldMusic: oldMusic};
    }

    static playPuya() {
        this.playingPuya = true;
        return {newMusic: SOUND_NAMES.PUYA, oldMusic: this.mainTheme};
    }

    static stopPuya() {
        this.playingPuya = false;
        return {newMusic: this.mainTheme, oldMusic: SOUND_NAMES.PUYA};
    }

    static getPuya() {
        return this.playingPuya;
    }
}

/**
 * Used to manage scenarios swap
 */
export class WeatherManager {
    static weather = WEATHER_SCENARIOS.CLEAR;
    static time = TIME.DAY;

    static setWeather(weather) {
        this.weather = weather;
    }

    static setTime(time) {
        this.time = time;
    }

    static getWeatherAndTime() {
        return {weather: this.weather, time: this.time}
    }
}