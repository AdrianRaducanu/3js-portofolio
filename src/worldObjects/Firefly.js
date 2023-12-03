import WorldObjects from "./objectClasses/WorldObjects.js";
import Engine from "../Engine.js";
import {
    AdditiveBlending,
    BufferAttribute,
    BufferGeometry,
    Group,
    PointLight, Points, ShaderMaterial
} from "three";
import vertexShader from '../shaders/fireflies/vertex.glsl'
import fragmentShader from '../shaders/fireflies/fragment.glsl'
import {STARTING_POSITION_FIREFLIES} from "./constants/CONST.js";

class Firefly extends WorldObjects {
    constructor(name) {
        super(name);
        this._createFireflies();
    }

    /**
     * Set initial position and add in scene
     *
     * Called from outside of this class
     */
    initialize() {
        this.firefly.position.set(
            STARTING_POSITION_FIREFLIES.X,
            STARTING_POSITION_FIREFLIES.Y,
            STARTING_POSITION_FIREFLIES.Z,
        );
        this._addInScene();
    }

    /**
     * Add in scene
     * @private
     */
    _addInScene() {
        Engine.instance.addInScene(this.firefly);
    }

    /**
     * Create fireflies, a group of 2 objects, light and particles
     * @private
     */
    _createFireflies() {
        this._createLight();
        this._createBody();
        this.firefly = new Group();
        this.firefly.add(this.fireflyLight, this.fireflyBody);
    }

    /**
     * Create point light
     * @private
     */
    _createLight() {
        this.fireflyLight = new PointLight(0xaa7132, 10, 10);
    }

    /**
     * Create particles
     * @private
     */
    _createBody() {
        this.geometry = new BufferGeometry();

        const positions = new Float32Array(10 * 3);
        const randoms = new Float32Array(10 * 3);
        for(let i = 0; i < 10 * 3; i = i + 3) {
            positions[i] = (Math.random() - 0.5);
            positions[i+1] = (Math.random() - 0.5);
            positions[i+2] = (Math.random() - 0.5);

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
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
                uTime: { value: 0},
                uX: {value: STARTING_POSITION_FIREFLIES.X},
                uY: {value: STARTING_POSITION_FIREFLIES.Y},
                uZ: {value: STARTING_POSITION_FIREFLIES.Z}
            }
        })

        this.fireflyBody = new Points(this.geometry, this.material)
    }

    /**
     * Update uniform uTime so that the particles will move
     * @param elapsedTime
     */
    update(elapsedTime) {
       this.material.uniforms.uTime.value = elapsedTime;
    }

    /**
     * Move point light and particles based on cat's position
     * @param z
     * @param x
     */
    updateFireflyPosition(z, x) {
        this.firefly.position.set(x, STARTING_POSITION_FIREFLIES.Y, z);
        this.material.uniforms.uX.value = x;
        this.material.uniforms.uZ.value = z;
    }
}

export default Firefly;