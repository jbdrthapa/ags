import Gtk from "gi://Gtk?version=4.0";
import { Astal, Gdk } from "ags/gtk4"
import app from "ags/gtk4/app"
import { WindowName } from "../constants";
import { WallpaperSettings } from "./settings/WallpaperSettings";

export default function Settings(gdkmonitor: Gdk.Monitor) {
    const windowName = WindowName.settings;

    const wallpaperSettings = new WallpaperSettings();

    let notebook = new Gtk.Notebook({
        tabPos: Gtk.PositionType.LEFT,
        cssName: "settings-notebook",
        hexpand: true,
        vexpand: true,
    });

    notebook.append_page(wallpaperSettings, new Gtk.Label({ label: "Wallpaper" }));
    notebook.append_page(new Gtk.Label({ label: "Personalization Settings" }), new Gtk.Label({ label: "Personalization" }));
    notebook.append_page(new Gtk.Label({ label: "Display Settings" }), new Gtk.Label({ label: "Display" }));
    notebook.append_page(new Gtk.Label({ label: "About the shell" }), new Gtk.Label({ label: "About" }));

    return (
        <window
            name={windowName}
            namespace={windowName}
            class={windowName}
            gdkmonitor={gdkmonitor}
            anchor={Astal.WindowAnchor.BOTTOM}
            exclusivity={Astal.Exclusivity.IGNORE}
            layer={Astal.Layer.TOP}
            application={app}
            visible={false}
            $={(self) => {
                const revealer = self.get_child() as Gtk.Revealer;

                self.connect("notify::visible", () => {
                    if (self.visible) {
                        revealer.reveal_child = true;
                    }
                });
            }}
        >
            <revealer
                transitionType={Gtk.RevealerTransitionType.FADE_SLIDE_UP}
                transitionDuration={200}
                $={(self) => {
                    self.connect("notify::child-revealed", () => {
                        if (!self.reveal_child && !self.child_revealed) {
                            (self.get_parent() as Astal.Window).visible = false;
                        }
                    });
                }}
            >
                <box cssName="settings-container">
                    <box orientation={Gtk.Orientation.VERTICAL}>
                        <box cssName="settings-titlebar">
                            <label hexpand halign={Gtk.Align.START} label="S E T T I N G S"></label>
                            <button
                                halign={Gtk.Align.END}
                                onClicked={() => {
                                    const window = app.get_window(windowName);
                                    const revealer = window?.get_child() as Gtk.Revealer;
                                    revealer.reveal_child = false;
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
            </revealer>
        </window>
    )
}