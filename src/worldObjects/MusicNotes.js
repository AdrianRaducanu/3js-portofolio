import WorldObjects from "./objectClasses/WorldObjects.js";
import Engine from "../Engine.js";
import {
    BufferAttribute,
    BufferGeometry,
    NormalBlending,
    Points,
    ShaderMaterial,
    TextureLoader
} from "three";
import {NO_OF_NOTES, STARTING_POSITION_NOTES} from "./constants/CONST.js";
import vertexShader from "../shaders/musicNotes/vertex.glsl";
import fragmentShader from "../shaders/musicNotes/fragment.glsl";

class MusicNotes extends WorldObjects {
    constructor(name) {
        super(name);
        this.shouldPlay = false;
    }

    /**
     * Called from outside of this class
     */
    initialize() {
        this._importTexture();
        this._createMusicNotes();
        this.material.uniforms.uTexture.value = this.texture;
        this._addInScene();
    }

    /**
     * Add in scene
     * @private
     */
    _addInScene() {
        Engine.instance.addInScene(this.musicNotes);
    }

    /**
     * Import texture, no need to do this async
     * @private
     */
    _importTexture() {
        const textureLoader = new TextureLoader();
        this.texture = textureLoader.load("../static/textures/music-note.png");
    }

    /**
     * Will create the music notes using shaders
     * @private
     */
    _createMusicNotes() {
        this.geometry = new BufferGeometry();
        const positions = new Float32Array(NO_OF_NOTES * 3);
        const randoms = new Float32Array(NO_OF_NOTES * 3);

        for(let i = 0; i < NO_OF_NOTES * 3; i = i + 3) {
            positions[i] = 0;
            positions[i+1] = 3;
            positions[i+2] = 60;

            randoms[i] = Math.random() + 1;
            randoms[i+1] = (Math.random() - 0.5) * 1.5;
            randoms[i+2] = (Math.random() - 0.5) * 1.5;
        }
        this.geometry.setAttribute('position', new BufferAttribute(positions, 3));
        this.geometry.setAttribute('aRandom', new BufferAttribute(randoms, 3));

        this.material = new ShaderMaterial({
            transparent: true,
            depthWrite: false,
            blending: NormalBlending,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
                uTime: { value: 0},
                uX: {value: STARTING_POSITION_NOTES.X},
                uY: {value: STARTING_POSITION_NOTES.Y},
                uZ: {value: STARTING_POSITION_NOTES.Z},
                uTexture: {value: 0}
            }
        })

        this.musicNotes = new Points(this.geometry, this.material)
    }

    /**
     * Update uniform uTime so that the particles will move
     * @param elapsedTime
     */
    update(elapsedTime) {
        if(this.shouldPlay) {
            this.material.uniforms.uTime.value = elapsedTime;
        }
    }

    /**
     * Start playing music notes
     */
    startPlaying() {
        this.shouldPlay = true;
        this.material.visible = true;
    }

    /**
     * Stop playing music notes
     */
    stopPlaying() {
        this.shouldPlay = false;
        this.material.visible = false;
    }
}

export default MusicNotes