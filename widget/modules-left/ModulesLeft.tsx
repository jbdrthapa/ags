import Gtk from "gi://Gtk?version=4.0"
import Apps from "gi://AstalApps"
import PopupWindow from "../PopupWindow"
import { Astal } from "ags/gtk4"
import { AppListing } from "./AppListing"

export function ModulesLeft() {

    const appListingWindow = AppListing();

    const button = (
        <box cssName={"app-launcher-background-left"}>
            <button onClicked={() => appListingWindow.toggle()} cssName={"bar-module-button-left"}>
                <label label="" />
            </button>
        </box>

    ) as any;



    button.popup = appListingWindow;

    return button;
}
