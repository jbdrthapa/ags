import Gtk from "gi://Gtk?version=4.0"
import GLib from "gi://GLib"
import PopupWindow from "./PopupWindow"
import { createPoll } from "ags/time"
import { Astal } from "ags/gtk4"



export function Launcher() {


    const popup = new PopupWindow({
        name: "launcher-detail-window",
        namespace: "js-launcher-detail-window",
        anchor: Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT,
        margin: 8,
        child: (
            <box cssName="launcher-detail-container" orientation={Gtk.Orientation.VERTICAL}>
                
            </box>
        )
    });


    return (
        <button onClicked={() => popup.toggle()} cssName={"bar-launcher-component"}>
            <box orientation={Gtk.Orientation.HORIZONTAL}>
                <button label={""} cssName={"launcher-button"} />
            </box>
        </button>
    );


}
