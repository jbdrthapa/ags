import GLib from 'gi://GLib';

export function GetHomeDirectory() {
    return GLib.get_home_dir();
}

export function GetUserConfigDirectory() {
    return GLib.get_user_config_dir();
}

const Utils = {
    GetHomeDirectory,
    GetUserConfigDirectory
};

export default Utils;