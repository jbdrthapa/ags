import GObject from "gi://GObject";
import { execAsync } from "ags/process";
import GLib from "gi://GLib";

const SystemInfoServiceProperties = {
    'host-info': GObject.ParamSpec.string(
        'host-info',
        'HostInfo',
        'Host Info',
        GObject.ParamFlags.READWRITE,
        ' '
    ),
    'uptime-info': GObject.ParamSpec.string(
        'uptime-info',
        'UptimeInfo',
        'Uptime Info',
        GObject.ParamFlags.READWRITE,
        ' '
    )
};

const hostnameTimer = 15 * 60 * 1000;   // 15 minutes
const uptimeTimer = 1 * 60 * 1000;      // 1 minute

class InternalSystemInfoService extends GObject.Object {
    static instance: InternalSystemInfoService;
    static get_default() {
        if (!this.instance) this.instance = new InternalSystemInfoService();
        return this.instance;
    }

    host_info = '';
    uptime_info = '';

    constructor() {
        super();

        this.updateHostname();

        this.updateUptime();

        GLib.timeout_add(GLib.PRIORITY_DEFAULT, hostnameTimer, () => {
            this.updateHostname();
            return GLib.SOURCE_CONTINUE;
        });

        GLib.timeout_add(GLib.PRIORITY_DEFAULT, uptimeTimer, () => {
            this.updateUptime();
            return GLib.SOURCE_CONTINUE;
        });
    }

    updateHostname() {
        execAsync(['hostnamectl', 'hostname']).then((hostname) => {
            this.host_info = hostname;
        }).catch(print);
    }

    updateUptime() {
        execAsync(['uptime', '-p']).then((uptime) => {
            this.uptime_info = uptime;
        }).catch(print);
    }

}

const SystemInfoService = GObject.registerClass({ Properties: SystemInfoServiceProperties, }, InternalSystemInfoService);

export default SystemInfoService;