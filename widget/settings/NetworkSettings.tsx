import Gtk from "gi://Gtk?version=4.0";
import Network from "gi://AstalNetwork"
import { createBinding } from "gnim";

function BindWiredProperty<prop_key extends keyof Network.Wired>(caption: string, object: Network.Wired, property: prop_key) {
    const binding = createBinding(object, property as any)

    return (
        <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
            <label label={caption} xalign={0} cssName="settings-param-caption" />
            <label label={binding.as(val => String(val))} cssName="settings-param-value" halign={Gtk.Align.START} />
        </box>
    );
}

function BindWifiProperty<prop_key extends keyof Network.Wifi>(caption: string, object: Network.Wifi, property: prop_key) {
    const binding = createBinding(object, property as any)

    return (
        <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
            <label label={caption} xalign={0} cssName="settings-param-caption" />
            <label label={binding.as(val => String(val))} cssName="settings-param-value" halign={Gtk.Align.START} />
        </box>
    );
}

export function WiredNetworkSettings() {

    const network = Network.get_default();

    const wired = network.wired;

    if (!wired) {
        return <box />;
    }

    return (
        <box orientation={Gtk.Orientation.VERTICAL} spacing={10}>

            <label label="Properties" halign={Gtk.Align.START} cssName="section-heading" />

            <box spacing={10} orientation={Gtk.Orientation.VERTICAL} cssName="section-background">
                {BindWiredProperty("State", wired, "state")}
            </box>
        </box>
    );
}

export function WirelessNetworkSettings() {

    const network = Network.get_default();

    const wifi = network.wifi;

    return (
        <box orientation={Gtk.Orientation.VERTICAL} spacing={10}>
            
            <label label="Properties" halign={Gtk.Align.START} cssName="section-heading" />

            <box spacing={10} orientation={Gtk.Orientation.VERTICAL} cssName="section-background">
                {BindWifiProperty("SSID", wifi, "ssid")}
                {BindWifiProperty("Strength", wifi, "strength")}
                {BindWifiProperty("State", wifi, "state")}
            </box>
        </box>
    );
}



