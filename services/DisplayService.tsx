import GObject from "gi://GObject";
import { execAsync } from "ags/process";
import GLib from "gi://GLib";

// Define the property standard GObject way
const DisplayServiceProperties = {
    'brightness-percent': GObject.ParamSpec.int(
        'brightness-percent',
        'Brightness',
        'Brightness Percent',
        GObject.ParamFlags.READWRITE,
        0,
        100,
        0
    ),
    'brightness-icon': GObject.ParamSpec.string(
        'brightness-icon',
        'Brightness Icon',
        'The Nerd Font character string for the icon',
        GObject.ParamFlags.READWRITE,
        '\u{f0cb5}'
    )
};

class InternalDisplayService extends GObject.Object {
    static instance: InternalDisplayService;
    static get_default() {
        if (!this.instance) this.instance = new InternalDisplayService();
        return this.instance;
    }

    // This holds the actual current number
    brightness_percent = 0;
    brightness_icon = "\u{f0cb5}";

    constructor() {
        super();

        this.updateBrightnessPercent();

        // 1. Run the loop to check your hardware brightness
        GLib.timeout_add(GLib.PRIORITY_DEFAULT, 1000, () => {
            this.updateBrightnessPercent();
            return GLib.SOURCE_CONTINUE;
        });
    }

    // Check system brightness and update the variable
    updateBrightnessPercent() {
        execAsync(['brightnessctl', '-d', 'amdgpu_bl2', 'g']).then((brightness) => {
            const current = Number(brightness.trim());

            execAsync(['brightnessctl', '-d', 'amdgpu_bl2', 'm']).then((max) => {
                const maxBrightness = Number(max.trim());
                if (maxBrightness > 0) {

                    // Force it into a simple whole integer
                    this.brightness_percent = Math.round((current / maxBrightness) * 100);

                    this.notify("brightness-percent");

                    this.updateBrightnessIcon();

                }
            }).catch(print);
        }).catch(print);
    }

    updateBrightnessIcon() {

        let icon;

        if (this.brightness_percent < 11) {
            icon = "󰛩";
        }
        else if (this.brightness_percent < 21) {
            icon = "󱩎";
        }
        else if (this.brightness_percent < 31) {
            icon = "󱩏";
        }
        else if (this.brightness_percent < 41) {
            icon = "󱩐";
        }
        else if (this.brightness_percent < 51) {
            icon = "󱩑";
        }
        else if (this.brightness_percent < 61) {
            icon = "󱩒";
        }
        else if (this.brightness_percent < 71) {
            icon = "󱩓";
        }
        else if (this.brightness_percent < 81) {
            icon = "󱩔";
        }
        else if (this.brightness_percent < 91) {
            icon = "󱩖";
        }
        else {
            icon = "󰛨";
        }

        this.brightness_icon = icon;

        this.notify("brightness-icon");
    }

    // Add this inside your class alongside incBrightnessValue/decBrightnessValue
    setBrightnessValue(value: number) {
        const target = Math.round(value);

        execAsync(['brightnessctl', '-d', 'amdgpu_bl2', 's', `${target}%`])
            .catch(print);
    }

}

// Wrap it so GObject registers it cleanly without decorators crashing
const DisplayService = GObject.registerClass({
    Properties: DisplayServiceProperties,
}, InternalDisplayService);

export default DisplayService;
