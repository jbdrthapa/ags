import GObject from "gi://GObject";
import { execAsync } from "ags/process";
import GLib from "gi://GLib";

let displayDevice: null | string = null;
let devicePath: null | string = null;

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

const checkTimer = 0.5 * 1000;

class InternalDisplayService extends GObject.Object {
    static instance: InternalDisplayService;
    static get_default() {
        if (!this.instance) this.instance = new InternalDisplayService();
        return this.instance;
    }

    private max_brightness_value = 1;
    private last_brightness_percent = 0;
    private brightness_percent = 0;
    private brightness_icon = "\u{f0cb5}";

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

        // Cache file mapping paths and max value once to avoid reloading them
        devicePath = `/sys/class/backlight/${displayDevice}`;
        try {
            const [success, maxContent] = GLib.file_get_contents(`${devicePath}/max_brightness`);
            if (success) {
                this.max_brightness_value = Number(new TextDecoder().decode(maxContent).trim());
            }
        } catch (e) {
            print("Failed to read system max_brightness file", e);
        }

        this.updateBrightnessPercent();

        GLib.timeout_add(GLib.PRIORITY_DEFAULT, checkTimer, () => {
            this.updateBrightnessPercent();
            return GLib.SOURCE_CONTINUE;
        });

        return true;
    }

    updateBrightnessPercent() {

        if (!devicePath) return;

        try {
            // Natively read file contents synchronously (extremely low overhead for sysfs files)
            const [success, content] = GLib.file_get_contents(`${devicePath}/brightness`);
            if (!success) return;

            const current = Number(new TextDecoder().decode(content).trim());

            // Exit early before performing any object updates or math equations
            if (this.last_brightness_percent === current) {
                return;
            }
            this.last_brightness_percent = current;

            // Compute values and deploy to proxy getters/setters instantly
            this.brightness_percent = Math.round((current / this.max_brightness_value) * 100);
            this.notify("brightness-percent");
            this.updateBrightnessIcon();
        } catch (err) {
            print("Sysfs read crash: ", err);
        }
    }

    updateBrightnessIcon() {

        let icon;

        if (this.brightness_percent < 11) {
            icon = "\u{f06e9}";
        }
        else if (this.brightness_percent < 31) {
            icon = "\u{f1a4e}";
        }
        else if (this.brightness_percent < 61) {
            icon = "\u{f1a52}";
        }
        else if (this.brightness_percent < 86) {
            icon = "\u{f1a56}";
        }
        else {
            icon = "\u{f06e8}";
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
