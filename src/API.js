import Engine from "./Engine.js";
import DomManagement from "./DomManagement.js";
import {OBJECTIVES} from "./constants/DOM_CONSTANTS.js";
import SoundManagement from "./SoundManagement.js";
import {SOUND_NAMES} from "./constants/SOUND_CONSTANTS.js";

/**
 * Can be tested in console
 *
 * Combine the engine and the dom manipulation
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

    toggleMusic: function (music) {
        const {newMusic, oldMusic} = MusicManager.toggleMusic(music);
        console.log(newMusic, oldMusic)
        Engine.instance.setMusicNotesVisibility(newMusic);
        SoundManagement.instance.toggleMusic(newMusic, oldMusic);
    },

    unlockObjective: function(obj) {
        SoundManagement.instance.playSound(SOUND_NAMES.OBJECTIVE);
        DomManagement.instance.unlockObjective(obj);
        DomManagement.instance.openObjectiveModal(obj);
        if(obj === OBJECTIVES.MUSIC) {
            DomManagement.instance.unlockPuya();
        }
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
 * Used to manage the music (main vs puya)
 */
export class MusicManager {
    static music = SOUND_NAMES.MAIN;

    static toggleMusic(newMusic) {
        const oldMusic = this.music;
        this.music = newMusic;
        return {newMusic: this.music, oldMusic: oldMusic};
    }
}