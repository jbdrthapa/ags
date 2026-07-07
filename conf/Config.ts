import GLib from 'gi://GLib';
import Gio from "gi://Gio";

let cachedConfig: any = null;
let monitor: Gio.FileMonitor | null = null;
let configPath = GLib.build_filenamev([
    GLib.get_home_dir(),
    ".config",
    "ags",
    "conf",
    "js-shell.json",
]);

function loadConfig() {
    const [ok, bytes] = GLib.file_get_contents(configPath);
    if (!ok) {
        cachedConfig = null;
        return;
    }

    try {
        cachedConfig = JSON.parse(new TextDecoder().decode(bytes));
    } catch (e) {
        print(`js-shell config parse error: ${e}`);
        cachedConfig = null;
    }
}

function setupWatcher() {
    const file = Gio.File.new_for_path(configPath);

    monitor = file.monitor_file(Gio.FileMonitorFlags.NONE, null);

    monitor.connect("changed", (_monitor, _file, _otherFile, eventType) => {
        // Only reload on actual content change
        if (eventType === Gio.FileMonitorEvent.CHANGES_DONE_HINT ||
            eventType === Gio.FileMonitorEvent.CHANGED ||
            eventType === Gio.FileMonitorEvent.CREATED) {

            print("js-shell.json changed, reloading...");
            loadConfig();
        }
    });
}

// Setup file monitor
setupWatcher();

// Load config in the beginning
loadConfig();


// Export functions

export function GetDockLaunchers() {
    if (!cachedConfig) return [];
    return Array.isArray(cachedConfig.dock_launchers)
        ? cachedConfig.dock_launchers
        : [];
}

const Config = {
    GetDockLaunchers
};

export default Config;