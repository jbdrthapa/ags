import Gtk from "gi://Gtk?version=4.0";
import { AccordionController } from "./AccordionController";
import { PillWidget } from "./PillWidget";

export function DisplayWidget(controller: AccordionController) {
    const content = (
        <box orientation={Gtk.Orientation.VERTICAL} cssName="pill-content">
            <label label="Brightness: 75%" />
            <label label="Resolution: 2560x1440" />
        </box>
    ) as Gtk.Box;

    return PillWidget({
        id: "display",
        controller: controller,
        iconName: "󰍹",
        title: "Display",
        detail: "Display Detail",
        content,
    });
}
