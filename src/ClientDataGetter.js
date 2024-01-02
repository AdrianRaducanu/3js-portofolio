import { NIGHT_TIME, TIME } from "./constants/DATE_AND_LOCATION.js";
import {INVALID_WEATHER_CODE} from "./constants/WEAHTER_CODES.js";

/**
 * Manager used for getting the weather
 * @param latitude
 * @param longitude
 * @returns {`https://api.open-meteo.com/v1/forecast?latitude=${string}&longitude=${string}&daily=weather_code&forecast_days=1`}
 */
const returnUrl = (latitude, longitude) => {
    return `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=weather_code&forecast_days=1`
}

export default class ClientDataGetter {
    static setWeatherAndTime() {
        const time = getUserTime();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    fetchWeatherAPI(latitude, longitude).then(res => {
                        const weatherCode = getWeatherCode(res);
                        console.log("User's data: ", weatherCode, time)
                        Manager.setWeatherAndTime(weatherCode, time);
                    })
                },
                function(error) {
                    console.error(`Error getting location: ${error.message}`);
                    alert("Couldn't get your location, enjoy the clear scenario after you finish the game")
                    Manager.setWeatherAndTime(INVALID_WEATHER_CODE, time);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
            alert("Couldn't get your location, enjoy the clear scenario after you finish the game")
            Manager.setWeatherAndTime(INVALID_WEATHER_CODE, time);
        }
    }
}

/**
 * Fetch data from open-meteo api
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
const getUserTime = () => {
    const date = new Date().getHours();
    if(date > NIGHT_TIME.START || date < NIGHT_TIME.END) {
        return TIME.NIGHT;
    } else {
        return TIME.DAY;
    }
}

/**
 * Get just the weather code from the api
 * @param res
 * @returns {*}
 */
const getWeatherCode = (res) => {
    return res.daily.weather_code[0];
}

//https://api.open-meteo.com/v1/forecast?latitude=44.4323&longitude=26.1063&hourly=rain,snowfall,weather_code&daily=weather_code&forecast_days=1

//https://open-meteo.com/en/docs/dwd-api#latitude=44.4323&longitude=26.1063&hourly=rain,snowfall,weather_code&daily=weather_code&forecast_days=1 - de aici iau codurile pt weather