import Engine from "./Engine.js";
import DomManagement from "./DomManagement.js";
import {OBJECTIVES} from "./constants/DOM_CONSTANTS.js";
import SoundManagement from "./SoundManagement.js";
import {SOUND_NAMES} from "./constants/SOUND_CONSTANTS.js";
import {WEATHER_SCENARIOS_CODE} from "./constants/WEAHTER_CODES.js";
import {TIME} from "./constants/DATE_AND_LOCATION.js";

/**
 * Can be tested in console
 *
 * Combine the engine and management classes
 * @type {{openModal: API.openModal, closeModal: API.closeModal}}
 */
export const API = {
    closeModal: function() {
        DomManagement.instance.hide();
        Engine.instance.unfreezeApp();
    },

    openModal: function() {
        Engine.instance.freezeApp();
        DomManagement.instance.show();
    },

    playSound: function(sound) {
        SoundManagement.instance.playSound(sound);
    },

    muteAllSounds: function() {
        SoundManagement.instance.muteAll();
    },

    unmuteAllSounds: function() {
        SoundManagement.instance.unmuteAll();
    },

    toggleMainTheme: function (music) {
        const {newMusic, oldMusic} = MusicManager.toggleMainTheme(music);
        console.log(newMusic, oldMusic)
        Engine.instance.setMusicNotesVisibility(newMusic);
        SoundManagement.instance.toggleMusic(newMusic, oldMusic);
    },

    playPuya: function() {
        const {newMusic, oldMusic} = MusicManager.playPuya();
        console.log(newMusic, oldMusic)
        Engine.instance.setMusicNotesVisibility(true);
        SoundManagement.instance.toggleMusic(newMusic, oldMusic);
    },

    stopPuya: function() {
        const {newMusic, oldMusic} = MusicManager.stopPuya();
        console.log(newMusic, oldMusic)
        Engine.instance.setMusicNotesVisibility(false);
        SoundManagement.instance.toggleMusic(newMusic, oldMusic);
    },

    unlockObjective: function(obj) {
        SoundManagement.instance.playSound(SOUND_NAMES.OBJECTIVE);
        DomManagement.instance.unlockObjective(obj);
        DomManagement.instance.openObjectiveModal(obj);
        if(obj === OBJECTIVES.MUSIC) {
            DomManagement.instance.unlockPuya();
        }
    },

    onRainScenario: function () {
        WeatherManager.changeWeather(WEATHER_SCENARIOS_CODE.RAIN);
        const {time, weather} = WeatherManager.getWeatherAndTime();
        Engine.instance.manageScenario(weather, time);
    },

    onClearScenario: function () {
        WeatherManager.changeWeather(WEATHER_SCENARIOS_CODE.CLEAR);
        const {time, weather} = WeatherManager.getWeatherAndTime();
        Engine.instance.manageScenario(weather, time);
    },

    onSnowScenario: function () {
        WeatherManager.changeWeather(WEATHER_SCENARIOS_CODE.SNOW);
        const {time, weather} = WeatherManager.getWeatherAndTime();
        Engine.instance.manageScenario(weather, time);
    },

    onLavaScenario: function () {
        WeatherManager.changeWeather(WEATHER_SCENARIOS_CODE.LAVA);
        const {time, weather} = WeatherManager.getWeatherAndTime();
        Engine.instance.manageScenario(weather, time);
    },

    onNightTime: function () {
        WeatherManager.changeTime(TIME.NIGHT);
        const {time, weather} = WeatherManager.getWeatherAndTime();
        Engine.instance.manageScenario(weather, time);
    },

    onDayTime: function () {
        WeatherManager.changeTime(TIME.DAY);
        const {time, weather} = WeatherManager.getWeatherAndTime();
        Engine.instance.manageScenario(weather, time);
    },
}

/**
 * Used to manage the activation process (first time when an objective is viewed)
 */
export class ActivationManager {
    static jobWSSActivated = false;
    static jobDBActivated = false;
    static eggActivated = false;
    static musicActivated = false;

    static getIsActive(obj) {
        let flag = false;
        switch (obj) {
            case OBJECTIVES.DB:
                flag = this.jobDBActivated;
                this.jobDBActivated = true;
                return flag;
            case OBJECTIVES.WSS:
                flag = this.jobWSSActivated;
                this.jobWSSActivated = true;
                return flag;
            case OBJECTIVES.EGG:
                flag = this.eggActivated;
                this.eggActivated = true;
                return flag;
            case OBJECTIVES.MUSIC:
                flag = this.musicActivated;
                this.musicActivated = true;
                return flag;
            default:
                break;
        }
    }
}

/**
 * Used to manage the music
 */
export class MusicManager {
    static mainTheme = SOUND_NAMES.MAIN;

    static toggleMainTheme(newMusic) {
        const oldMusic = this.mainTheme;
        this.mainTheme = newMusic;
        return {newMusic: this.mainTheme, oldMusic: oldMusic};
    }

    static playPuya() {
        return {newMusic: SOUND_NAMES.PUYA, oldMusic: this.mainTheme};
    }

    static stopPuya() {
        return {newMusic: this.mainTheme, oldMusic: SOUND_NAMES.PUYA};
    }
}

/**
 * Used to manage scenarios swap
 */
export class WeatherManager {
    static weather = WEATHER_SCENARIOS_CODE.CLEAR;
    static time = TIME.DAY;

    static changeWeather(weather) {
        this.weather = weather;
    }

    static changeTime(time) {
        this.time = time;
    }

    static getWeatherAndTime() {
        return {weather: this.weather, time: this.time}
    }
}