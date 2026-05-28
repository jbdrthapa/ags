import GObject from "gi://GObject";
import { execAsync } from "ags/process";
import GLib from "gi://GLib";

let displayDevice: null | string = null;

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

const checkTimer = 10 * 1000;

class InternalDisplayService extends GObject.Object {
    static instance: InternalDisplayService;
    static get_default() {
        if (!this.instance) this.instance = new InternalDisplayService();
        return this.instance;
    }

    brightness_percent = 0;
    brightness_icon = "\u{f0cb5}";

    constructor() {
        super();

        let result = this.init();

        result.then((value) => {
            if (!value) {
                return;
            }
        });
    }

    async init() {

        await this.resolveBrtCtlDevice();

        if (!displayDevice) {
            console.log("Brightness control device could not be resolved !!!");
            return false;
        }

        this.updateBrightnessPercent();

        GLib.timeout_add(GLib.PRIORITY_DEFAULT, checkTimer, () => {
            this.updateBrightnessPercent();
            return GLib.SOURCE_CONTINUE;
        });

        return true;
    }

    updateBrightnessPercent() {
        execAsync(['brightnessctl', '-d', `${displayDevice}`, 'g']).then((brightness) => {
            const current = Number(brightness.trim());

            execAsync(['brightnessctl', '-d', `${displayDevice}`, 'm']).then((max) => {
                const maxBrightness = Number(max.trim());
                if (maxBrightness > 0) {

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

    setBrightnessValue(value: number) {
        const target = Math.round(value);

        execAsync(['brightnessctl', '-d', `${displayDevice}`, 's', `${target}%`])
            .catch(print);
    }

    resolveBrtCtlDevice(): Promise<void> {

        return execAsync(['brightnessctl', '-l'])
            .then((output) => {
                const lines = output.split('\n');

                for (const line of lines) {
                    if (line.includes("of class 'backlight'")) {
                        const match = line.match(/'([^']+)'/);

                        if (match) {
                            const deviceName = match[1];

                            if (deviceName.startsWith('amd') || deviceName.startsWith('intel')) {
                                displayDevice = deviceName;
                                break;
                            }
                        }
                    }
                }

                if (displayDevice) {
                    console.log(`Found backlight device: ${displayDevice}`);
                } else {
                    console.log("No AMD or Intel backlight device found.");
                }
            })
            .catch(print);
    }
}

const DisplayService = GObject.registerClass({ Properties: DisplayServiceProperties, }, InternalDisplayService);

export default DisplayService;
