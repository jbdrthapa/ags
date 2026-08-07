import Gtk from "gi://Gtk?version=4.0";
import { DisplayWidget } from "./DisplayWidget";
import { WiredNetworkWidget } from "./WiredNetworkWidget";
import { AccordionController } from "./AccordionController";

const accordion = new AccordionController();

export function PillWidgets() {

    const displayWidget = DisplayWidget(accordion);
    const wiredNetworkWidget = WiredNetworkWidget(accordion);

    return (

        <box orientation={Gtk.Orientation.VERTICAL} spacing={10}>
            <box orientation={Gtk.Orientation.HORIZONTAL}>
                <box orientation={Gtk.Orientation.VERTICAL}>
                    {displayWidget}
                </box>

                <box orientation={Gtk.Orientation.VERTICAL}>
                    {wiredNetworkWidget}
                </box>
            </box>

        </box>

    );
}