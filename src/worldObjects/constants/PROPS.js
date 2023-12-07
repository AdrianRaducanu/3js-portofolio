import {Vector3} from "three";

export const AMBIENT_LIGHT_PROPS = {
    color: "#f4e9db",
    intensity: 1
}

export const FIREFLY_LIGHT_PROPS = {
    color: "#ff0000",
    intensity: 10
}

export const DIRECTIONAL_LIGHT_PROPS = {
    color: "#bdbdbd",
    intensity: 1,
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
        x: -88,
        z: 20
    }
}

export const JOB_WSS_PROPS = {
    position: {
        x: -81,
        z: 37
    },
    rotation: {
        y: Math.PI / 3
    }
}

export const EASTER_EGG_PROP = {
    position: {
        z: 15,
        y: 0.6,
        x: -10
    },
    rotation: {
        y: 3 * Math.PI/4
    }
}
export const QUESTION_MARK_PROP = {
    position: {
        z: 14.7,
        x: -10.3
    },
    rotation: {
        y: 3 * Math.PI/4
    }
}





