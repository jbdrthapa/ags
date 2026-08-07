import Gtk from "gi://Gtk?version=4.0";
import { PillWidget } from "./PillWidget";

export function DisplayWidget() {
    const content = (
        <box orientation={Gtk.Orientation.VERTICAL} cssName={"pill-content"}>
            <label label="󰍹: 75%" />
            <label label="󰍹: 2560x1440" />
        </box>
    ) as Gtk.Box;

    return PillWidget({
        iconName: "󰍹",
        title: "Display",
        detail: "Display Detail",
        content,
    });
}
