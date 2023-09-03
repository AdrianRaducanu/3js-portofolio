export const AMBIENT_LIGHT_PROPS = {
    color: "#404040",
    intensity: 1
}

export const MODEL_PROPS = {
}

export const TERRAIN_PROPS = {
    color: "#5e9a8c"
}

export const DIRECTIONAL_LIGHT_PROPS = {
    color: "#cacaca",
    intensity: 2,
    position: {
        x: 20,
        y: 30,
        z: 5
    }
}

export const DIRECTIONAL_LIGHT_SHADOW_PROPS = {
    camera: {
        far: 100,
        near: 10,
        top: 50,
        right: 50,
        bottom: -50,
        left: -50,
    },
    mapSize: {
        width: 4096,
        height: 4096
    }
}

export const POINT_LIGHT_PROPS = {
    color: "#33ff11",
    intensity: 1,
    distance: 2,
    decay: 2,
    position: {
        x: 3,
        y: 1,
        z: -2
    }
}