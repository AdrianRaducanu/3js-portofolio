import {SOUNDS_ARRAY} from "./constants/SOUND_CONSTANTS.js";
import {Howl, Howler} from 'howler';

class Enforcer {}

/**
 * Used to manipulate html and css outside the canvas
 *
 * Singleton
 */
class SoundManagement {

    static get instance() {
        if (!Enforcer._instance) {
            Enforcer._instance = new SoundManagement(new Enforcer());
        }
        return Enforcer._instance;
    }

    constructor(enforcer) {
        if (!enforcer || !(enforcer instanceof Enforcer)) {
            throw new Error("Use SoundManagement.instance!");
        }
        Enforcer._instance = this;

        this.isMuted = true;
    }

    initialize() {
        //TODO: must resolve AudioContext => means that the user should click something before the sounds start
        this.sounds = {};
        this._createSounds();
    }

    /**
     * For each element in SOUNDS_ARRAY create a new Howl
     * @private
     */
    _createSounds() {
        SOUNDS_ARRAY.forEach(sound => {
            this.sounds[sound.name] = new Howl({
                src: [`../static/sounds/mp3/${sound.name}.mp3`],
                volume: sound.volume,
                autoplay: false,
                loop: sound.loop,
                onloaderror: (err) => {
                    console.log("Sound " + sound.name + " has a problem while trying to load " + err);
                },
                onplay: () => {
                    // console.log("Sound " + sound.name + " has started");
                },
                onend: () => {
                    // console.log("Sound " + sound.name + " has ended");
                },
                onstop: () => {
                    // console.log("Sound " + sound.name + " has stopped");
                },
                onplayerror: (err) => {
                    console.log("Sound " + sound.name + " has a problem while trying to play " + err);
                }
            });
        });
    }

    /**
     * Mute all = set volume to 0
     */
    muteAll() {
        Howler.volume(0.0);
        this.isMuted = true;
    }

    /**
     * Unmute all = set volume to 1
     *
     * Sounds that are created with a base volume below 1 will keep that volume
     */
    unmuteAll() {
        Howler.volume(1.0);
        this.isMuted = false;
    }

    /**
     * Stop all sounds
     */
    stopAll() {
        Howler.stop();
    }

    /**
     * Mute a sound based on name
     * @param soundName
     */
    muteSound(soundName) {
        this.sounds[soundName].volume(0.0);
    }

    /**
     * Unmute a sound based on name
     * @param soundName
     */
    unmuteSound(soundName) {
        this.sounds[soundName].volume(1.0);

    }

    /**
     * Play a sound based on name
     * @param soundName
     */
    playSound(soundName) {
        this.sounds[soundName].play();
    }

    /**
     * Toggle music (puya vs default theme)
     * @param newMusic
     * @param oldMusic
     */
    toggleMusic(newMusic, oldMusic) {
        this.sounds[oldMusic].stop();
        this.sounds[newMusic].play();
    }
}

export default SoundManagement;