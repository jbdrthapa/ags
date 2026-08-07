import Gtk from "gi://Gtk?version=4.0";
import { DisplayWidget } from "./DisplayWidget";
import { WirelessPillWidget } from "./WirelessPillWidget";


export function PillWidgets() {

    const displayWidget = DisplayWidget();
    const displayWidget2 = DisplayWidget();
    const displayWidget3 = DisplayWidget();
    const displayWidget4 = DisplayWidget();

    return (

        <box orientation={Gtk.Orientation.VERTICAL} spacing={10}>
            <box orientation={Gtk.Orientation.HORIZONTAL}>
                <box orientation={Gtk.Orientation.VERTICAL}>
                    {displayWidget}
                </box>

                <box orientation={Gtk.Orientation.VERTICAL}>
                    {displayWidget2}
                </box>
            </box>

            <box orientation={Gtk.Orientation.HORIZONTAL}>
                <box orientation={Gtk.Orientation.VERTICAL}>
                    {displayWidget3}
                </box>

                <box orientation={Gtk.Orientation.VERTICAL} vexpand={true}>
                    {displayWidget4}
                </box>
            </box>
        </box>

    );
}