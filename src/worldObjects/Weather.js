import WorldObjects from "./objectClasses/WorldObjects.js";
import Engine from "../Engine.js";
import {AdditiveBlending, BufferAttribute, BufferGeometry, Points, ShaderMaterial} from "three";
import {NO_OF_WEATHER_PARTICLES} from "./constants/CONST.js";
import vertexShaderRain from "../shaders/weather/rain/vertex.glsl";
import fragmentShaderRain from "../shaders/weather/rain/fragment.glsl";
import vertexShaderSnow from "../shaders/weather/snow/vertex.glsl";
import fragmentShaderSnow from "../shaders/weather/snow/fragment.glsl";

class Weather extends WorldObjects {
    /**
     * Generate the weather based on type provided, snow or rain
     * @param name
     * @param weatherType
     */
    constructor(name, weatherType) {
        super(name);
        this._getWeatherType(weatherType);
        this._createWeather();
    }

    /**
     * Called from outside of this class
     */
    initialize() {
        this._addInScene();
    }

    /**
     * Add in scene
     * @private
     */
    _addInScene() {
        Engine.instance.addInScene(this.weather);
    }

    /**
     * Create weather
     *
     * The weather should affect only the outside area, not the cave
     * @private
     */
    _createWeather() {
        this.geometry = new BufferGeometry();

        const positions = new Float32Array(NO_OF_WEATHER_PARTICLES * 3);
        const randoms = new Float32Array(NO_OF_WEATHER_PARTICLES * 3);
        for(let i = 0; i < NO_OF_WEATHER_PARTICLES * 3; i = i + 3) {
            const theta = Math.random() * 2 * Math.PI;
            const radius = (Math.random() - 0.5) * 50 + 80; // Adjust the range for radius, e.g., from 80 to 100

            const x = radius * Math.cos(theta);
            const y = Math.random() * 40 - 1;
            const z = radius * Math.sin(theta);

            positions[i] = x;
            positions[i + 1] = y;
            positions[i + 2] = z;

            randoms[i] = (Math.random() - 0.5);
            randoms[i+1] = (Math.random() - 0.5);
            randoms[i+2] = (Math.random() - 0.5);
        }
        this.geometry.setAttribute('position', new BufferAttribute(positions, 3));
        this.geometry.setAttribute('aRandom', new BufferAttribute(randoms, 3));

        this.material = new ShaderMaterial({
            depthWrite: false,
            blending: AdditiveBlending,
            vertexColors: true,
            vertexShader: this.vertex,
            fragmentShader: this.fragment,
            uniforms: {
                uTime: { value: 0}
            }
        });

        this.weather = new Points(this.geometry, this.material);
    }

    /**
     * Get the shader files based on weather's type
     * @param type
     * @private
     */
    _getWeatherType(type) {
        if(type === "snow") {
            this.vertex = vertexShaderSnow;
            this.fragment = fragmentShaderSnow;
        } else {
            this.vertex = vertexShaderRain;
            this.fragment = fragmentShaderRain;
        }
    }

    /**
     * Update uniform uTime so that the particles will move
     * @param elapsedTime
     */
    update(elapsedTime) {
        this.material.uniforms.uTime.value = elapsedTime;
    }
}

export default Weather;