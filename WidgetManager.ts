import { Settings } from "./widget/settings/Settings"

let settingsInstance: any | undefined;

export function GetSettingsWindow() {
    if (settingsInstance === undefined) {
        settingsInstance = Settings();
    }
    return settingsInstance;
}

const WidgetManager = {
    GetSettingsWindow,
};

export default WidgetManager;
