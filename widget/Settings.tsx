import Gtk from "gi://Gtk?version=4.0";
import { Astal, Gdk } from "ags/gtk4"
import app from "ags/gtk4/app"
import { WindowName } from "../constants";

export default function Settings(gdkmonitor: Gdk.Monitor) {
    const windowName = WindowName.settings;

    let notebook = new Gtk.Notebook({
        tabPos: Gtk.PositionType.LEFT,
        cssName: "settings-notebook",
        hexpand: true,
        vexpand: true,
    });

    notebook.append_page(new Gtk.Label({ label: "General" }), new Gtk.Label({ label: "General" }));
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
        >
            <box cssName="settings-container">
                <box orientation={Gtk.Orientation.VERTICAL}>
                    <box cssName="settings-titlebar">
                        <label hexpand halign={Gtk.Align.START} label="S E T T I N G S"></label>
                        <button halign={Gtk.Align.END} onClicked={() => { app.toggle_window(windowName) }} cssName="settings-close-button">
                            <label label="" />
                        </button>
                    </box>
                    <box>
                        {notebook}
                    </box>
                </box>
            </box>
        </window>
    )
}