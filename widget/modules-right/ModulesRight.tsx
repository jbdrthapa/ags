import Gtk from "gi://Gtk?version=4.0"
import PopupWindow from "../PopupWindow"
import { Astal } from "ags/gtk4"
import { SystemInfoWidget } from "./SystemInfoWidget"
import { PillWidgets } from "./PillWidgets"
import { DisplayControlsWidget } from "./DisplayControlsWidget"
import { AudioControlsWidget } from "./AudioControlsWidget"
import { MprisWidget } from "./MprisWidget"
import { WindowName } from "../../constants"

const windowName = WindowName.modulesRight;

let ModulesRightPopup: any;

export function ModulesRight() {

    const systemInfoWidget = SystemInfoWidget();

    const pillWidgets = PillWidgets();

    const displayControlsWidget = DisplayControlsWidget();

    const audioControlsWidget = AudioControlsWidget();

    const mprisWidget = MprisWidget();

    const button = (
        <box cssName={"app-launcher-background-right"}>
            <button onClicked={() => ModulesRightPopup.toggle()} cssName={"bar-module-button-right"}>
                <label label={"󰣇"} />
            </button>
        </box>
    ) as any;

    ModulesRightPopup = new PopupWindow({
        name: windowName,
        namespace: windowName,
        anchor: Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT,
        margin: 0,
        child: (
            <box cssName="modules-right-container" orientation={Gtk.Orientation.VERTICAL} spacing={20}>
                <box orientation={Gtk.Orientation.VERTICAL} hexpand={false} halign={Gtk.Align.CENTER} cssName="system-info-pill-container">
                    {systemInfoWidget}
                    {pillWidgets}
                </box>
                {displayControlsWidget}
                {audioControlsWidget}
                {mprisWidget}
            </box>
        )
    });

    ModulesRightPopup.connect("notify::visible", () => {
        if (ModulesRightPopup.visible) {
            // Reset things on UI visible
        }
    });

    button.popup = ModulesRightPopup;

    return button;

}
