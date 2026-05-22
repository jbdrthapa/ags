import GObject from "gi://GObject";
import { execAsync } from "ags/process";
import GLib from "gi://GLib";

const TimeServiceProperties = {
    'timezone': GObject.ParamSpec.string(
        'timezone',
        'Timezone',
        'Timezone',
        GObject.ParamFlags.READWRITE,
        '?'
    )
};

const updateTimer = 20 * 60 * 1000; // 20 minutes

class InternalTimeService extends GObject.Object {
    static instance: InternalTimeService;
    static get_default() {
        if (!this.instance) this.instance = new InternalTimeService();
        return this.instance;
    }

    constructor() {
        super();

        this.UpdateTimezone();

        GLib.timeout_add(GLib.PRIORITY_DEFAULT, updateTimer, () => {

            this.UpdateTimezone();

            return GLib.SOURCE_CONTINUE;
        });
    }

    private async UpdateTimezone() {
        let timezoneData = await this.getTimezone();

        if (timezoneData) {
            console.log("Timezone:", timezoneData.timezone);
            console.log("Latitude:", timezoneData.latitude);
            console.log("Longitude:", timezoneData.longitude);
        }

        this.setTimezone(timezoneData?.timezone);
    }

    private async getLocalTimezone() {
        try {
            console.log("Checking local timezone");

            const timeZone = await execAsync("bash -c \"timedatectl status | awk '/Time zone:/ {print \\$3}'\"")

            console.log("Local timezone received as : ", timeZone);

            return timeZone;
        }
        catch {
            console.log("Unable to get local timezone");
        }
    }

    private async setTimezone(timezone: string) {
        try {

            let localTimezone = await this.getLocalTimezone();

            if (localTimezone === timezone) {
                console.log("No update required, timezone is already set correctly.")
                return;
            }

            console.log("Setting timezone as : ", timezone)

            const result = await execAsync(`sudo timedatectl set-timezone ${timezone}`);

            console.log(`Successfully changed the timezone from : ${localTimezone} to : ${timezone}`);

        }
        catch {
            console.log("Unable to set timezone");
        }
    }

    private async getTimezone() {

        try {
            const jsonStr = await execAsync("curl -s https://ipapi.co/json");
            const data = JSON.parse(jsonStr);

            if (data.timezone && data.timezone && data.longitude) {
                return { timezone: data.timezone, latitude: data.latitude, longitude: data.longitude };
            }
        }
        catch {
            console.log("Get timezone failed");
        }
    }

}


const TimeService = GObject.registerClass({ Properties: TimeServiceProperties, }, InternalTimeService);

export default TimeService;