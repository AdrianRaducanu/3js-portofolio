import {Vector3} from "three";

export const AMBIENT_LIGHT_PROPS = {
    color: "#f4e9db",
    intensity: 0.4
}


export const DIRECTIONAL_LIGHT_PROPS = {
    color: "#ffffff",
    intensity: 0.9,
    position: {
        x: 30,
        y: 50,
        z: 30
    }
}
export const DIRECTIONAL_LIGHT_PROPS_2 = {
    color: "#aa7132",
    intensity: 1,
    position: {
        x: -80,
        y: 50,
        z: 20
    }
}


export const DIRECTIONAL_LIGHT_SHADOW_PROPS = {
    camera: {
        far: 130,
        near: 0,
        top: 100,
        right: 100,
        bottom: -100,
        left: -100,
    },
    mapSize: {
        width: 4096,
        height: 4096
    }
}

export const DB_LIGHT_PROPS = {
    color: "#ffffff",
    intensity: 1,
    distance: 10,
    decay: 2,
    position: {
        x: -10,
        y: 4,
        z: 15
    }
}

export const WSS_LIGHT_PROPS = {
    color: "#ffffff",
    intensity: 1,
    distance: 10,
    decay: 2,
    position: {
        x: 78,
        y: 4,
        z: 60
    },
}

export const EGG_LIGHT_PROPS = {
    color: "#ffffff",
    intensity: 1,
    distance: 10,
    decay: 2,
    position: {
        x: -81,
        y: 2,
        z: 36
    },
}

export const MUSIC_LIGHT_PROPS = {
    color: "#ffffff",
    intensity: 1,
    distance: 10,
    decay: 2,
    position: {
        z: -75,
        y: 2,
        x: -1
    },
}


export const DOWN_FACING_RAYCASTER = {
    ORIGIN: new Vector3(0, 1, 0),
    DIRECTION: new Vector3(0, -10, 0)
}

export const FRONT_FACING_RAYCASTER = {
    ORIGIN: new Vector3(0, 0, 0),
    DIRECTION: new Vector3(0, 0, -1)
}

export const JOB_DB_PROPS = {
    position: {
        x: -10,
        z: 15
    }
}

export const JOB_WSS_PROPS = {
    position: {
        x: 81,
        z: 60
    },
    rotation: {
        y: Math.PI / 3
    }
}

export const EASTER_EGG_PROP = {
    position: {
        x: -81,
        y: 0.6,
        z: 37
    },
    rotation: {
        y: 3 * Math.PI/4
    }
}
export const QUESTION_MARK_PROP = {
    position: {
        z: 36.5,
        x: -81.2
    },
    rotation: {
        y: 3 * Math.PI/4
    }
}

export const PICKUP_PROP = {
    position: {
        z: -71,
        x: 3
    },
    rotation: {
        y: 3 * Math.PI / 4
    }
}






