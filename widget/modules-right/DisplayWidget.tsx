import Gtk from "gi://Gtk?version=4.0";
import { PillWidget } from "./PillWidget";

export function DisplayWidget() {
    const content = (
        <box orientation={Gtk.Orientation.VERTICAL}>
            <label label="Brightness: 75%" />
            <label label="Resolution: 2560x1440" />
        </box>
    ) as Gtk.Box;

    return PillWidget({
        title: "Display",
        detail: "Display Detail",
        content,
    });
}
