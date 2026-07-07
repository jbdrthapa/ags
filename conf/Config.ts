import GLib from 'gi://GLib';

let configPath: string;

function loadConfig() {
    configPath = GLib.build_filenamev([
        GLib.get_home_dir(),
        ".config",
        "ags",
        "conf",
        "js-shell.json",
    ]);
}

export function GetDockLaunchers() {
    loadConfig();

    if (!configPath) {
        return [];
    }

    const [result, content] = GLib.file_get_contents(configPath)

    if (!result) {
        return [];
    }

    try {
        const json = JSON.parse(imports.byteArray.toString(content));
        return Array.isArray(json.dock_launchers) ? json.dock_launchers : [];
    }
    catch (e) {
        print(`js-shell prefs load dock_launchers error: ${e}`);
        return [];
    }
}

const Config = {
    GetDockLaunchers
};

export default Config;