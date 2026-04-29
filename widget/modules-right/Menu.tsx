import Gtk from "gi://Gtk?version=4.0"
import GLib from "gi://GLib"
import PopupWindow from "../PopupWindow"
import { createPoll } from "ags/time"
import { Astal } from "ags/gtk4"

let popup: any;

export function Menu() {

    
    const button = (
        <button onClicked={() => popup.toggle()} cssName={"bar-menu-component"}>
            <label label={"M"} />
        </button>
    ) as any;

    popup = new PopupWindow({
        name: "menu-detail-window",
        namespace: "js-shell-menu",
        anchor: Astal.WindowAnchor.TOP| Astal.WindowAnchor.RIGHT,
        margin: 8,
        child: (
            <box cssName="menu-detail-container" orientation={Gtk.Orientation.VERTICAL}>
                
            </box>
        )
    });

    popup.connect("notify::visible", () => {
        if (popup.visible) {
            // Reset things on UI visible
        }
    });

    button.popup = popup;

    return button;

}
