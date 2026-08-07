import Gtk from "gi://Gtk?version=4.0";
import { DisplayWidget } from "./DisplayWidget";
import { WirelessPillWidget } from "./WirelessPillWidget";


export function PillWidgets() {

    const displayWidget = DisplayWidget();
    const wirelessPillWidget2 = WirelessPillWidget();
    const wirelessPillWidget3 = WirelessPillWidget();
    const wirelessPillWidget4 = WirelessPillWidget();

    return (
        <box orientation={Gtk.Orientation.VERTICAL} >
            <box orientation={Gtk.Orientation.HORIZONTAL} halign={Gtk.Align.CENTER} valign={Gtk.Align.START} vexpand={false} cssName="pill-container">
                <box valign={Gtk.Align.START}>
                    {displayWidget}
                </box>
                <box valign={Gtk.Align.START}>
                    {wirelessPillWidget2}
                </box>
            </box>
            <box orientation={Gtk.Orientation.HORIZONTAL} halign={Gtk.Align.CENTER} valign={Gtk.Align.START} vexpand={false} cssName="pill-container">
                <box valign={Gtk.Align.START}>
                    {wirelessPillWidget3}
                </box>
                <box valign={Gtk.Align.START}>
                    {wirelessPillWidget4}
                </box>
            </box>
        </box>
    );
}