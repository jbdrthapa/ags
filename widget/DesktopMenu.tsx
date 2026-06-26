import Gtk from "gi://Gtk?version=4.0"
import PopupWindow from "../widget/PopupWindow"
import { Astal } from "ags/gtk4"
import { WindowName } from "../constants"

const windowName = WindowName.desktopMenu;

export function DesktopMenu() {

    let desktopMenu = new PopupWindow({
        name: windowName,
        namespace: windowName,
        anchor: Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT,
        child: (
            <box orientation={Gtk.Orientation.VERTICAL}>
                <button cssName="desktop-menu-button">Settings</button>
                <button cssName="desktop-menu-button">Apps</button>
            </box>
        )
    });

    return desktopMenu;

}
