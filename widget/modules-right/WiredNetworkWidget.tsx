import Gtk from "gi://Gtk?version=4.0";
import { AccordionController } from "./AccordionController";
import { PillWidget } from "./PillWidget";
import { createBinding, createComputed } from "gnim";
import Network from "gi://AstalNetwork"

export function WiredNetworkWidget(controller: AccordionController) {

    let detail = "";

    const network = Network.get_default();

    const wired = network.wired;

    if (!wired) {
        detail = "Unavailable"
        return;
    }

    const device = createBinding(wired, "device");

    const iconName = createBinding(wired, "iconName");

    const deviceInterface = createComputed(() => {
        return device().interface;
    });

    const macAddress = createComputed(() => {
        return device().hwAddress;
    });

    const content = (
        <box orientation={Gtk.Orientation.VERTICAL} cssName="pill-content">
            <box orientation={Gtk.Orientation.HORIZONTAL}>
                <image iconSize={Gtk.IconSize.NORMAL} iconName={iconName} />
                <label label={deviceInterface} halign={Gtk.Align.START} />
            </box>
            <box orientation={Gtk.Orientation.HORIZONTAL}>
                <label label="MAC" halign={Gtk.Align.START} />
                <label label={macAddress} halign={Gtk.Align.START} />
            </box>
        </box>
    ) as Gtk.Box;

    return PillWidget({
        id: "wired-network",
        controller: controller,
        iconName: "󰈀",
        title: "Wired",
        detail: deviceInterface,
        content,
    });
}
