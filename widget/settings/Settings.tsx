import Gtk from "gi://Gtk?version=4.0";
import { Astal, Gdk } from "ags/gtk4"
import app from "ags/gtk4/app"
import { WindowName } from "../../constants";
import { DisplaySettings } from "./DisplaySettings";
import { AudioSettings } from "./AudioSettings";
import { WallpaperSettings } from "./WallpaperSettings";
import { WiredNetworkSettings, WirelessNetworkSettings } from "./NetworkSettings";
import { BluetoothSettings } from "./BluetoothSettings";
import { AboutSettings } from "./AboutSettings";
import PopupWindow from "../PopupWindow";

export function Settings() {
    const windowName = WindowName.settings;
    const displaySettings = DisplaySettings() as any;
    const audioSettings = AudioSettings() as any;
    const wallpaperSettings = WallpaperSettings() as any;
    const wiredNetworkSettings = WiredNetworkSettings() as any;
    const wirelessNetworkSettings = WirelessNetworkSettings() as any;
    const bluetoothSettings = BluetoothSettings() as any;
    const aboutSettings = AboutSettings() as any;

    let notebook = new Gtk.Notebook({
        tabPos: Gtk.PositionType.LEFT,
        cssName: "settings-notebook",
        hexpand: true,
        vexpand: true,
    });

    notebook.append_page(displaySettings, new Gtk.Label({ label: "Display" }));
    notebook.append_page(audioSettings, new Gtk.Label({ label: "Audio" }));
    notebook.append_page(wiredNetworkSettings, new Gtk.Label({ label: "Wired" }));
    notebook.append_page(wirelessNetworkSettings, new Gtk.Label({ label: "Wireless" }));
    notebook.append_page(bluetoothSettings, new Gtk.Label({ label: "Bluetooth" }));
    notebook.append_page(wallpaperSettings, new Gtk.Label({ label: "Wallpaper" }));
    notebook.append_page(aboutSettings, new Gtk.Label({ label: "About" }));

    const SettingsPopup = new PopupWindow({
        name: windowName,
        namespace: windowName,
        anchor: Astal.WindowAnchor.NONE,
        exclusivity: Astal.Exclusivity.IGNORE,
        layer: Astal.Layer.TOP,
        application: app,
        child: (
            <box cssName="settings-container">
                <box orientation={Gtk.Orientation.VERTICAL}>
                    <box cssName="settings-titlebar">
                        <label hexpand halign={Gtk.Align.CENTER} label="Settings"></label>
                        <button
                            halign={Gtk.Align.END}
                            onClicked={() => {
                                const window = app.get_window(windowName);
                                window?.close();
                            }}
                            cssName="settings-close-button"
                        >
                            <label label="" />
                        </button>
                    </box>
                    <box>
                        {notebook}
                    </box>
                </box>
            </box>
        )
    });

    return SettingsPopup;
}