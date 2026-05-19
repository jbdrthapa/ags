import { property, register } from 'gnim/gobject';
import GObject from "gnim/gobject";
import { execAsync } from "ags/process";
import GLib from 'gi://GLib';

@register({ GTypeName: 'DisplayService' })
export default class DisplayService extends GObject.Object {
    static instance: DisplayService;
    static get_default() {
        if (!this.instance) this.instance = new DisplayService();
        return this.instance;
    }

    @property(Number)
    brightness_percent = -1;

    constructor() {
        super();

        GLib.timeout_add(GLib.PRIORITY_DEFAULT, 1000, () => {
            this.updateBrightnessPercent();
            return GLib.SOURCE_CONTINUE;
        });
    }

    updateBrightnessPercent(): void {
        execAsync(['brightnessctl', '-d', 'amdgpu_bl2', 'g'])
            .then((brightness) => {
                const currentBrightness = Number(brightness.trim());

                execAsync(['brightnessctl', '-d', 'amdgpu_bl2', 'm'])
                    .then((max) => {
                        const maxBrightness = Number(max.trim());

                        if (maxBrightness > 0) {
                            this.brightness_percent = Math.round((currentBrightness / maxBrightness) * 100);
                        }
                    })
                    .catch(print);
            })
            .catch(print);
    }

    incBrightnessValue() {
        execAsync(['brightnessctl', '-d', 'amdgpu_bl2', 's +10%'])
            .catch(print);
    }

    decBrightnessValue() {
        execAsync(['brightnessctl', '-d', 'amdgpu_bl2', 's 10%-'])
            .catch(print);
    }
}
