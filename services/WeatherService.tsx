import GObject from "gi://GObject";
import { execAsync } from "ags/process";
import GLib from "gi://GLib";

const WeatherServiceProperties = {
    'temperature': GObject.ParamSpec.string(
        'temperature',
        'Temperature',
        'Temperature',
        GObject.ParamFlags.READWRITE,
        ' '
    ),
    'description': GObject.ParamSpec.string(
        'description',
        'Description',
        'Description',
        GObject.ParamFlags.READWRITE,
        ' '
    ),
    'icon': GObject.ParamSpec.string(
        'icon',
        'Icon',
        'Icon',
        GObject.ParamFlags.READWRITE,
        '?'
    ),
};

const updateTimer = 15 * 60 * 1000; // 15 minutes

class InternalWeatherService extends GObject.Object {
    static instance: InternalWeatherService;
    static get_default() {
        if (!this.instance) this.instance = new InternalWeatherService();
        return this.instance;
    }

    api_key = '';
    city_id = '5350734';
    units = 'imperial'; // metric | imperial

    temperature = '';
    description = '';
    icon = '?';


    constructor() {
        super();

        this.fetchWeather();

        GLib.timeout_add(GLib.PRIORITY_DEFAULT, updateTimer, () => {
            this.fetchWeather();
            return GLib.SOURCE_CONTINUE;
        });
    }

    private async fetchWeather() {
        if (this.api_key === "") {
            this.description = "Missing API Key";
            this.notify("description");
            return;
        }

        try {
            // Call the OpenWeather Current Weather Data API
            const url = `https://api.openweathermap.org/data/2.5/weather?id=${this.city_id}&units=${this.units}&appid=${this.api_key}`;
            const response = await execAsync(`curl -s "${url}"`);
            const data = JSON.parse(response);

            if (data.cod !== 200) {
                throw new Error(data.message || "API Error");
            }

            // Extract values using OpenWeather's JSON schema
            const unitSymbol = this.units === "metric" ? "°C" : "°F";
            this.temperature = `${Math.round(data.main.temp)}${unitSymbol}`;

            // Format description to Capital Case (e.g. "scattered clouds")
            const desc = data.weather[0].description;
            this.description = desc.charAt(0).toUpperCase() + desc.slice(1);

            // Map the OpenWeather icon code to custom emojis/glyphs
            this.icon = this.mapOpenWeatherIcon(data.weather[0].icon);

            // Notify GObject that properties changed to rebuild dependencies
            this.notify("temperature");
            this.notify("description");
            this.notify("icon");

        } catch (error) {
            console.error(`[OpenWeatherService] Error: ${error}`);
            this.temperature = "ERR";
            this.description = "Failed to update";
            this.notify("temperature");
            this.notify("description");
        }
    }

    // Maps OpenWeather's explicit icon string codes to emojis or Nerd Font glyphs
    private mapOpenWeatherIcon(iconCode: string): string {
        const iconMap: Record<string, string> = {
            "01d": "☀️",  // Clear sky day
            "01n": "🌙",  // Clear sky night
            "02d": "⛅",  // Few clouds day
            "02n": "☁️",  // Few clouds night
            "03d": "☁️",  // Scattered clouds
            "03n": "☁️",
            "04d": "☁️",  // Broken/overcast clouds
            "04n": "☁️",
            "09d": "🌧️",  // Shower rain
            "09n": "🌧️",
            "10d": "🌦️",  // Rain day
            "10n": "🌧️",  // Rain night
            "11d": "⛈️",  // Thunderstorm
            "11n": "⛈️",
            "13d": "❄️",  // Snow
            "13n": "❄️",
            "50d": "🌫️",  // Mist/Fog
            "50n": "🌫️",
        };
        return iconMap[iconCode] || "✨";
    }
}

const WeatherService = GObject.registerClass({ Properties: WeatherServiceProperties, }, InternalWeatherService);

export default WeatherService;