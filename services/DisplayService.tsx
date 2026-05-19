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
};

class InternalDisplayService extends GObject.Object {
    static instance: InternalDisplayService;
    static get_default() {
        if (!this.instance) this.instance = new InternalDisplayService();
        return this.instance;
    }

    // This holds the actual current number
    brightness_percent = 0;

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

                    // Tell AGS/GObject that the value changed
                    this.notify("brightness-percent");
                }
            }).catch(print);
        }).catch(print);
    }

    // Add this inside your class alongside incBrightnessValue/decBrightnessValue
    setBrightnessValue(value: number) {
        const target = Math.round(value);

        // Tell the hardware to change to this exact percentage
        execAsync(['brightnessctl', '-d', 'amdgpu_bl2', 's', `${target}%`])
            .then(() => {
                // Instantly update the local state and notify the UI
                // this.updateBrightnessPercent();
                // this.brightness_percent = target;
                // this.notify("brightness-percent");
            })
            .catch(print);
    }

}

// Wrap it so GObject registers it cleanly without decorators crashing
const DisplayService = GObject.registerClass({
    Properties: DisplayServiceProperties,
}, InternalDisplayService);

export default DisplayService;
