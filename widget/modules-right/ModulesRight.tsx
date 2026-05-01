import Gtk from "gi://Gtk?version=4.0"
import GLib from "gi://GLib"
import PopupWindow from "../PopupWindow"
import { createPoll } from "ags/time"
import { Astal } from "ags/gtk4"
import { SystemInfoWidget } from "./SystemInfoWidget"
import { PillWidgets } from "./PillWidgets"
import { DisplayControlsWidget } from "./DisplayControlsWidget"
import { AudioControlsWidget } from "./AudioControlsWidget"
import { MprisWidget } from "./MprisWidget"

let popup: any;

export function ModulesRight() {

    const systemInfoWidget = SystemInfoWidget();

    const pillWidgets = PillWidgets();

    const displayControlsWidget = DisplayControlsWidget();

    const audioControlsWidget = AudioControlsWidget();

    const mprisWidget = MprisWidget();

    const button = (
        <button onClicked={() => popup.toggle()} cssName={"bar-module-button-right"}>
            <label label={""} />
        </button>
    ) as any;

    popup = new PopupWindow({
        name: "modules-right-container",
        namespace: "js-shell-modules-right",
        anchor: Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT,
        margin: 8,
        child: (
            <box spacing={20} cssName="modules-right-container" orientation={Gtk.Orientation.VERTICAL}>
                {systemInfoWidget}
                {/* {displayControlsWidget} */}
                {pillWidgets}
                {audioControlsWidget}
                {mprisWidget}
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
