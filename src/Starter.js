import { NIGHT_TIME, TIME } from "./constants/DATE_AND_LOCATION.js";
import { INVALID_WEATHER_CODE } from "./constants/WEAHTER_CODES.js";
import Engine from "./Engine.js";

/**
 * API used for getting the weather
 * @param latitude
 * @param longitude
 * @returns {`https://api.open-meteo.com/v1/forecast?latitude=${string}&longitude=${string}&daily=weather_code&forecast_days=1`}
 */
const returnUrl = (latitude, longitude) => {
    return `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code&forecast_days=1`
}

//TODO will change this, the game will begin with lava scenario and after all objectives are complemted => go to the user scenario
// No need to call Engine.initialize here, will have something like Engine.setUserScenario
export default class Starter {
    static startEngineBasedOnWeatherAndTime(canvas) {
        const time = getTime();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    fetchWeatherAPI(latitude, longitude).then(res => {
                        const weather = getWeatherCode(res);
                        Engine.instance.initialize(canvas, weather, time);
                    })
                },
                function(error) {
                    console.error(`Error getting location: ${error.message}`);
                    Engine.instance.initialize(canvas, INVALID_WEATHER_CODE, time);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
            Engine.instance.initialize(canvas, INVALID_WEATHER_CODE, time);
        }
    }
}

/**
 * Fetch data from open-meteo API
 * @param latitude
 * @param longitude
 * @returns {Promise<number|any>}
 */
const fetchWeatherAPI = async (latitude, longitude) => {
    const url = returnUrl(latitude, longitude);

    try {
        const response = await fetch(url);

        if (!response.ok) {
            console.log(`HTTP error! Status: ${response.status}`);
            return INVALID_WEATHER_CODE;
        }

        return await response.json();

    } catch (error) {
        console.error('Fetch error:', error);
        return INVALID_WEATHER_CODE;
    }
};

/**
 * Get user's time of the day (day or night)
 * @returns {string}
 */
const getTime = () => {
    const date = new Date().getHours();
    if(date > NIGHT_TIME.START || date < NIGHT_TIME.END) {
        return TIME.NIGHT;
    } else {
        return TIME.DAY;
    }
}

/**
 * Get just the weather code from the API
 * @param res
 * @returns {*}
 */
const getWeatherCode = (res) => {
    return res.daily.weather_code[0];
}

//https://api.open-meteo.com/v1/forecast?latitude=44.4323&longitude=26.1063&hourly=rain,snowfall,weather_code&daily=weather_code&forecast_days=1

//https://open-meteo.com/en/docs/dwd-api#latitude=44.4323&longitude=26.1063&hourly=rain,snowfall,weather_code&daily=weather_code&forecast_days=1 - de aici iau codurile pt weather