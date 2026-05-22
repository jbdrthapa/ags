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
    ),
    'hour': GObject.ParamSpec.string(
        'hour',
        'Hour',
        'Hour',
        GObject.ParamFlags.READWRITE,
        '?'
    ),
    'minute': GObject.ParamSpec.string(
        'minute',
        'Minute',
        'Minute',
        GObject.ParamFlags.READWRITE,
        '?'
    )
};
const delay = (ms: number) => new Promise(resolve => GLib.timeout_add(GLib.PRIORITY_DEFAULT, ms, () => { resolve(null); return GLib.SOURCE_REMOVE; }));
let retryDelay = 1000; // 2 seconds
const retryAttempts = 5; // 5 attempts
const updateTimeTimer = 1 * 60 * 1000; // 1 minute
const updateTimezoneTimer = 20 * 60 * 1000; // 20 minutes

class InternalTimeService extends GObject.Object {
    static instance: InternalTimeService;
    static get_default() {
        if (!this.instance) this.instance = new InternalTimeService();
        return this.instance;
    }

    timezone = '';
    hour = '';
    minute = '';

    constructor() {
        super();

        this.UpdateTimezone();
        this.RefreshTime();

        GLib.timeout_add(GLib.PRIORITY_DEFAULT, updateTimeTimer, () => {
            this.RefreshTime();
            return GLib.SOURCE_CONTINUE;
        });

        GLib.timeout_add(GLib.PRIORITY_DEFAULT, updateTimezoneTimer, () => {
            this.UpdateTimezone();
            return GLib.SOURCE_CONTINUE;
        });
    }

    private async RefreshTime() {
        try {
            console.log("Checking local time");

            this.hour = await execAsync("bash -c 'date +%I'");
            this.notify("hour");

            this.minute = await execAsync("bash -c 'date +%M'");
            this.notify("minute");

            console.log(`Local time received as : ${this.hour} : ${this.minute}`);
        }
        catch {
            console.log("Unable to refresh local time");
        }
    }


    private async UpdateTimezone() {

        let timezoneData = null;
        let attempt = 0;
        while (!timezoneData && attempt < retryAttempts) {
            timezoneData = await this.getTimezone();
            if (!timezoneData) {
                attempt++;
                console.log("Timezone data retrieve failed, retry attempt: ", attempt);
                await delay(retryDelay);
                retryDelay *=2;
            }
        }

        if (timezoneData) {

            this.setTimezone(timezoneData?.timezone);

            this.timezone = await this.getLocalTimezone();

            this.notify("timezone");

            this.RefreshTime();
        }
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