import Gtk from "gi://Gtk?version=4.0";
import GLib from 'gi://GLib';
import AstalNetwork from "gi://AstalNetwork"
import { For, With, createBinding } from "ags"
import { execAsync } from "ags/process"
import { WirelessPillWidget } from "./WirelessPillWidget";

export function PillWidgets() {

    const wirelessPillWidget = WirelessPillWidget();
    const wirelessPillWidget2 = WirelessPillWidget();
    const wirelessPillWidget3 = WirelessPillWidget();
    const wirelessPillWidget4 = WirelessPillWidget();
    const wirelessPillWidget5 = WirelessPillWidget();
    const wirelessPillWidget6 = WirelessPillWidget();
    const wirelessPillWidget7 = WirelessPillWidget();
    const wirelessPillWidget8 = WirelessPillWidget();



    return (
        <box orientation={Gtk.Orientation.VERTICAL} >
            <box orientation={Gtk.Orientation.HORIZONTAL} halign={Gtk.Align.CENTER} cssName="pill-container">
                {wirelessPillWidget}
                {wirelessPillWidget2}
            </box>
            <box orientation={Gtk.Orientation.HORIZONTAL} halign={Gtk.Align.CENTER} cssName="pill-container">
                {wirelessPillWidget3}
                {wirelessPillWidget4}
            </box>
            <box orientation={Gtk.Orientation.HORIZONTAL} halign={Gtk.Align.CENTER} cssName="pill-container">
                {wirelessPillWidget5}
                {wirelessPillWidget6}
            </box>
        </box>
    );
}