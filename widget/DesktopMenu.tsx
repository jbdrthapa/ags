import Gtk from "gi://Gtk?version=4.0"
import PopupWindow from "../widget/PopupWindow"
import { Astal } from "ags/gtk4"
import { WindowName } from "../constants"
import app from "ags/gtk4/app";

const windowName = WindowName.desktopMenu;
const appsWindowName = WindowName.modulesLeft;
const settingsWindowName = WindowName.settings

export function DesktopMenu() {

    let desktopMenu = new PopupWindow({
        name: windowName,
        namespace: windowName,
        anchor: Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT,
        child: (
            <box orientation={Gtk.Orientation.VERTICAL}>

                <button cssName="desktop-menu-button" onClicked={() => {
                    app.toggle_window(windowName);
                    app.toggle_window(settingsWindowName);
                }}>Settings</button>

                <button cssName="desktop-menu-button" onClicked={() => {
                    var settingsWindow = app.get_window(settingsWindowName);

                    app.toggle_window(windowName);
                    app.toggle_window(settingsWindowName);
                }}>Wallpaper</button>

            </box>
        )
    });

    return desktopMenu;

}
