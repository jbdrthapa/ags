import Gtk from "gi://Gtk?version=4.0";
import { WirelessPillWidget } from "./WirelessPillWidget";

export function PillWidgets() {

    const wirelessPillWidget1 = WirelessPillWidget();
    const wirelessPillWidget2 = WirelessPillWidget();
    const wirelessPillWidget3 = WirelessPillWidget();
    const wirelessPillWidget4 = WirelessPillWidget();



    return (
        <box orientation={Gtk.Orientation.VERTICAL} >
            <box orientation={Gtk.Orientation.HORIZONTAL} halign={Gtk.Align.CENTER} cssName="pill-container">
                {wirelessPillWidget1}
                {wirelessPillWidget2}
            </box>
            <box orientation={Gtk.Orientation.HORIZONTAL} halign={Gtk.Align.CENTER} cssName="pill-container">
                {wirelessPillWidget3}
                {wirelessPillWidget4}
            </box>
        </box>
    );
}