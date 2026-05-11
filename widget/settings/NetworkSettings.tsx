import Gtk from "gi://Gtk?version=4.0";
import Network from "gi://AstalNetwork"
import { createBinding } from "gnim";

function BindWiredProperty<prop_key extends keyof Network.Wired>(caption: string, object: Network.Wired, property: prop_key) {
    const binding = createBinding(object, property as any)

    return (
        <box orientation={Gtk.Orientation.HORIZONTAL}>
            <label label={caption} />
            <label label={binding.as(val => String(val))} />
        </box>
    );
}

function BindWifiProperty<prop_key extends keyof Network.Wifi>(caption: string, object: Network.Wifi, property: prop_key) {
    const binding = createBinding(object, property as any)

    return (
        <box orientation={Gtk.Orientation.HORIZONTAL}>
            <label label={caption} />
            <label label={binding.as(val => String(val))} />
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
            {BindWiredProperty("State", wired, "state")}
        </box>
    );
}

export function WirelessNetworkSettings() {

    const network = Network.get_default();

    const wifi = network.wifi;

    return (
        <box orientation={Gtk.Orientation.VERTICAL} spacing={10}>
            {BindWifiProperty("SSID", wifi, "ssid")}
            {BindWifiProperty("Strength", wifi, "strength")}
            {BindWifiProperty("State", wifi, "state")}
        </box>
    );
}



