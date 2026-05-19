import { createBinding } from "ags"
import WeatherService from "../../services/WeatherService";

export function WeatherBarWidget() {

    const weatherService = WeatherService.get_default();

    return (
        <box cssName="bar-weather" spacing={10}>
            <label label={createBinding(weatherService, "icon")} cssName="bar-weather-icon" />
            <label label={createBinding(weatherService, "temperature")} cssName="bar-weather-temperature" />
        </box>
    );
}