import WorldLight from "./worldObjects/objectClasses/WorldLight.js";
import {LIGHT_TYPE} from "./constants/LIGHT_TYPE.js";
import {
    AMBIENT_LIGHT_PROPS, DB_LIGHT_PROPS,
    DIRECTIONAL_LIGHT_PROPS,
    DIRECTIONAL_LIGHT_SHADOW_PROPS,
    DOWN_FACING_RAYCASTER,
    EASTER_EGG_PROP, EGG_LIGHT_PROPS,
    FRONT_FACING_RAYCASTER,
    JOB_DB_PROPS,
    JOB_WSS_PROPS, MUSIC_LIGHT_PROPS, PICKUP_PROP, QUESTION_MARK_PROP, WSS_LIGHT_PROPS
} from "./worldObjects/constants/PROPS.js";
import MainObject from "./worldObjects/MainObject.js";
import Landscape from "./worldObjects/Landscape.js";
import CustomRaycaster from "./worldObjects/CustomRaycaster.js";
import {JOBS_NAME, WEATHER} from "./worldObjects/constants/CONST.js";
import WorldAnimatedObject from "./worldObjects/objectClasses/WorldAnimatedObject.js";
import Firefly from "./worldObjects/Firefly.js";
import MusicNotes from "./worldObjects/MusicNotes.js";
import Weather from "./worldObjects/Weather.js";
import {OBJECT_PROPERTIES} from "./constants/OBJECT_PROPERTIES.js";
import {SCENARIOS, TIME_SCENARIOS} from "./constants/SCENARIOS.js";
import Engine from "./Engine.js";
import ObjectiveLight from "./worldObjects/ObjectiveLight.js";

class World {

    /**
     * hasWeather = is Raining or Snowing
     */
    constructor() {
        this.hasWeather = false;
    }

    /**
     * Initialize world related objects
     */
    initialize() {
        this._addLights();

        this._addRaycaster();

        this._addLandscape();

        this._addFireFlies();

        this._addJobs();

        this._addEasterEgg();

        this._addMusicObjects();

        this._addMainObject();
    }

    start() {}

    /**
     * Based on tick fnc in engine, animate world objects
     * @param delta
     * @param elapsedTime
     */
    updateWorld(delta, elapsedTime) {
        this.mainObject.update(delta);
        this.landscape.update(elapsedTime);
        this.jobWSS.update(delta);
        this.jobDB.update(delta);
        this.easterEgg.update(delta);
        this.questionMark.update(delta);
        this.fireflies.update(elapsedTime);
        this.musicNotes.update(elapsedTime);
        if(this.hasWeather) {
            this.weather.update(elapsedTime);
        }
    }

    /**
     * Create and add lights to the scene
     * @private
     */
    _addLights() {
        this.ambientLight = new WorldLight("World ambient light", LIGHT_TYPE.AMBIENT, AMBIENT_LIGHT_PROPS);
        this.ambientLight.initialize();

        this.directionalLight = new WorldLight("World directional light", LIGHT_TYPE.DIRECTIONAL, DIRECTIONAL_LIGHT_PROPS);
        this.directionalLight.initialize();
        this.directionalLight.addShadow(DIRECTIONAL_LIGHT_SHADOW_PROPS);
    }

    /**
     * Will create and add landscape
     * @private
     */
    _addLandscape() {
        this.landscape = new Landscape("landscape-snow", this.downFacingRaycaster);
        this.landscape.initialize();
    }

    /**
     * Will create and add the cat
     *
     * Being the main objects, the cat should contain multiple raycasters in order to be aware of
     * the interation with other objects
     * @private
     */
    _addMainObject() {
        const otherObjects = {
            fireflies: this.fireflies,
            jobWSS: this.jobWSS,
            jobDB: this.jobDB,
            easterEgg: this.easterEgg,
            questionMark: this.questionMark,
            musicNotes: this.musicNotes,
            pickup: this.pickup,
            lightDB: this.lightDB,
            lightWSS: this.lightWSS,
            lightEgg: this.lightEgg,
            lightMusic: this.lightMusic,
        }
        this.mainObject = new MainObject("dora", this.downFacingRaycaster, this.frontFacingRaycaster, otherObjects);
        this.mainObject.initialize();
    }

    /**
     * Creates all the raycasters
     *
     * DownFacing - used in order to constrain the area of walking
     * FrontFacing - used in order to be aware of the objects that the cat is looking at
     * @private
     */
    _addRaycaster() {
        this.downFacingRaycaster = new CustomRaycaster("down-facing-raycaster", DOWN_FACING_RAYCASTER.ORIGIN, DOWN_FACING_RAYCASTER.DIRECTION);
        this.frontFacingRaycaster = new CustomRaycaster("front-facing-raycaster", FRONT_FACING_RAYCASTER.ORIGIN, FRONT_FACING_RAYCASTER.DIRECTION);
    }

    /**
     * Will create and add other world objects (only jobs for now)
     * @private
     */
    _addJobs() {
        //db
        this.jobDB = new WorldAnimatedObject(JOBS_NAME.DB, JOB_DB_PROPS, this.frontFacingRaycaster);
        this.jobDB.initialize();
        this.lightDB = new ObjectiveLight("db light", LIGHT_TYPE.POINT, DB_LIGHT_PROPS);
        this.lightDB.initialize();

        //wss
        this.jobWSS = new WorldAnimatedObject(JOBS_NAME.WSS, JOB_WSS_PROPS, this.frontFacingRaycaster);
        this.jobWSS.initialize();
        this.lightWSS = new ObjectiveLight("wss light", LIGHT_TYPE.POINT, WSS_LIGHT_PROPS);
        this.lightWSS.initialize();
    }

    /**
     * Will create and add fireflies
     * @private
     */
    _addFireFlies() {
        this.fireflies = new Firefly("firefly");
        this.fireflies.initialize();
    }

    /**
     * Add easter egg and its question mark
     * @private
     */
    _addEasterEgg() {
        this.easterEgg = new WorldAnimatedObject("easter-egg", EASTER_EGG_PROP, this.frontFacingRaycaster);
        this.easterEgg.initialize();
        this.lightEgg = new ObjectiveLight("egg light", LIGHT_TYPE.POINT, EGG_LIGHT_PROPS);
        this.lightEgg.initialize();

        this.questionMark = new WorldAnimatedObject("question-mark", QUESTION_MARK_PROP, this.frontFacingRaycaster);
        this.questionMark.initialize();
    }

    /**
     * Add pick up and its music notes
     * @private
     */
    _addMusicObjects() {
        this.pickup = new WorldAnimatedObject("pickup", PICKUP_PROP, this.frontFacingRaycaster);
        this.pickup.initialize();
        this.lightMusic = new ObjectiveLight("music light", LIGHT_TYPE.POINT, MUSIC_LIGHT_PROPS);
        this.lightMusic.initialize();

        this.musicNotes = new MusicNotes("notes");
        this.musicNotes.initialize();
    }

    /**
     * Used to add weather based on scenario
     * RAIN/SNOW -> has weather
     * LAVA/CLEAR -> no weather
     *
     * Everytime the scenario is changed, the old this.weather must be removed from the scene
     * and recreated and added (this way I wont have snow and rain at the same time on screen)
     * @param value
     * @private
     */
    _addWeather(value) {
        if(this.weather) {
            this.weather.remove();
        }
        if(value === WEATHER.CLEAR) {
            this.hasWeather = false;
            return
        }
        this.hasWeather = true;
        this.weather = new Weather("weather", value);
        this.weather.initialize();
    }

    /**
     * Freeze the main object
     */
    onFreeze() {
        this.mainObject.onFreeze();
    }

    /**
     * Unfreeze the main object
     */
    onUnfreeze() {
        this.mainObject.onUnfreeze();
    }

    /**
     * Used to manage the music notes (based on theme picked)
     * @param flag
     */
    setMusicNotesVisibility(flag) {
        if(flag) {
            this.musicNotes.startPlaying();
        } else {
            this.musicNotes.stopPlaying();
        }
    }

    /**
     * Modify scene based on night scenario
     */
    onNightTime() {
        this.isNight = true;
        this._modifySceneBasedOnScenario(
            TIME_SCENARIOS.NIGHT.background,
            TIME_SCENARIOS.NIGHT.directionalLight,
            TIME_SCENARIOS.NIGHT.ambientLight
        );

        this.mainObject.setIsNight(true);
    }

    /**
     * Modify scene based on day scenario
     */
    onDayTime() {
        this.isNight = false
        this._modifySceneBasedOnScenario(
            TIME_SCENARIOS.DAY.background,
            TIME_SCENARIOS.DAY.directionalLight,
            TIME_SCENARIOS.DAY.ambientLight
        );

        this.mainObject.setIsNight(false);
    }

    /**
     * Modify scene based on rain scenario only for daytime
     *
     * If night -> don't modify it, just add rain
     */
    onRain() {
        this._beforeChangeScenario();
        if(!this.isNight) {
            this._modifySceneBasedOnScenario(
                SCENARIOS.RAIN.background,
                SCENARIOS.RAIN.directionalLight,
                SCENARIOS.RAIN.ambientLight
            );
        }
        //Todo modify landscape material so it looks wet
        this._addWeather(WEATHER.RAIN);

        this.landscape.onRainMaterial();
    }

    /**
     * Modify scene based on snow scenario only for daytime
     *
     * If night -> don't modify it, just add snow
     */
    onSnow() {
        this._beforeChangeScenario();

        if(!this.isNight) {
            this._modifySceneBasedOnScenario(
                SCENARIOS.SNOW.background,
                SCENARIOS.SNOW.directionalLight,
                SCENARIOS.SNOW.ambientLight
            );
        }
        //Todo modify snow on landscape and color of glass + modify color of shaders (they're too white rn)
        this._addWeather(WEATHER.SNOW);
        this.landscape.showSnow();
    }

    /**
     * Don't modify the changes made by TIME_SCENARIO, just clear the weather
     */
    onClear() {
        this._beforeChangeScenario();

        if(this.isNight) {
            this.onNightTime();
        } else {
            this.onDayTime();
        }
        this._addWeather(WEATHER.CLEAR);
    }

    /**
     * Modify scene based on lava scenario
     *
     * There is no night nor day here, just some dark-redish scene and the
     * fireflies can move all over the map
     */
    onLava() {
        this._beforeChangeScenario();

        this.isNight = true;
        this._modifySceneBasedOnScenario(
            SCENARIOS.LAVA.background,
            SCENARIOS.LAVA.directionalLight,
            SCENARIOS.LAVA.ambientLight
        );
        this._addWeather(WEATHER.CLEAR);
        this.mainObject.setIsNight(true);
        this.landscape.onLava();
        this.landscape.hideLeaf();
    }

    /**
     * Used to modify scene props based on scenario input
     * @param background
     * @param directionalLightProps
     * @param ambientLightProps
     * @private
     */
    _modifySceneBasedOnScenario(background, directionalLightProps, ambientLightProps) {
        Engine.instance.changeBackground(background);

        this.directionalLight.setProperty(OBJECT_PROPERTIES.COLOR, directionalLightProps.color);
        this.directionalLight.setProperty(OBJECT_PROPERTIES.INTENSITY, directionalLightProps.intensity);

        this.ambientLight.setProperty(OBJECT_PROPERTIES.COLOR, ambientLightProps.color);
        this.ambientLight.setProperty(OBJECT_PROPERTIES.INTENSITY, ambientLightProps.intensity);
    }

    /**
     * Reset the landscape to the default properties
     * @private
     */
    _beforeChangeScenario() {
        this.landscape.hideSnow();
        this.landscape.showLeaf();
        this.landscape.offRainMaterial();
        this.landscape.offLava();
    }

    /**
     * Change cat's visibility
     * @param bool
     */
    setCatVisible(bool) {
        this.mainObject.setVisible(bool);
    }
}

export default World;