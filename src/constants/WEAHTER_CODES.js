export const WEATHER_CODES = {
    SNOW: [
        71, // Snow fall: Slight intensity
        73, // Snow fall: Moderate intensity
        75, // Snow fall: Heavy intensity
        77, // Snow grains
        85, // Snow showers slight
        86  // Snow showers heavy
    ],
    RAIN: [
        45, 48, // Fog and Rime Fog
        51, 53, 55, // Drizzle
        56, 57, // Freezing Drizzle
        61, 63, 65, // Rain
        66, 67, // Freezing Rain
        80, 81, 82, // Rain showers
        85, 86, // Snow showers
        95, 96, 99 // Thunderstorm
    ],
    CLEAR: [
        0, // Clear sky
        1, 2, 3 // Mainly clear, overcast but no rain
    ]
};

export const INVALID_WEATHER_CODE = -1;
export const WEATHER_SCENARIOS = {
    CLEAR: "CLEAR",
    RAIN: "RAIN",
    SNOW: "SNOW",
    LAVA: "LAVA",
    INVALID: "INVALID"
}

export const getWeatherScenario = (code) => {
    for (const [weatherType, weatherCodes] of Object.entries(WEATHER_CODES)) {
        if (weatherCodes.includes(code)) {
            return weatherType;
        }
    }
    return WEATHER_SCENARIOS.INVALID;
};

