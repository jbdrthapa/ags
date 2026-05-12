import Gtk from "gi://Gtk?version=4.0";
import AstalBluetooth from "gi://AstalBluetooth"
import { createBinding } from "gnim";

function BindBluetoothAdapterProperty<prop_key extends keyof AstalBluetooth.Adapter>(caption: string, object: AstalBluetooth.Adapter, property: prop_key, buttonVisible: boolean, buttonCaption: string, onButtonClick: () => void) {
    const binding = createBinding(object, property as any)

    return (
        <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
            <label label={caption} xalign={0} cssName="settings-param-caption" />
            <box cssName={"settings-param-value-box"}><label label={binding.as(val => String(val))} cssName="settings-param-value" hexpand={false} halign={Gtk.Align.START} /></box>
            <button visible={buttonVisible} onClicked={onButtonClick} cssName="settings-button">{buttonCaption}</button>
        </box>
    );
}

export function BluetoothSettings() {

    const bluetooth = AstalBluetooth.get_default();

    const adapter = bluetooth.adapter;

    const devices_binding = createBinding(bluetooth, "devices");

    return (
        <box orientation={Gtk.Orientation.VERTICAL} spacing={10}>

            <label label="Properties" halign={Gtk.Align.START} cssName="section-heading" />

            <box spacing={10} orientation={Gtk.Orientation.VERTICAL} cssName="section-background">
                {BindBluetoothAdapterProperty("Name", adapter, "name", false, "")}
                {BindBluetoothAdapterProperty("Address", adapter, "address", false, "")}
                {BindBluetoothAdapterProperty("Powered", adapter, "powered", true, "Toggle", () => { adapter?.set_powered(!adapter?.get_powered()); })}
                {BindBluetoothAdapterProperty("Pairable", adapter, "pairable", true, "Pair", () => { adapter?.set_pairable(!adapter?.get_pairable()); })}
                {BindBluetoothAdapterProperty("Discoverable", adapter, "discoverable", true, "Discover", () => { adapter?.set_discoverable(!adapter?.get_discoverable()); })}
            </box>

            <label label="Devices" halign={Gtk.Align.START} cssName="section-heading" />

            <box spacing={10} orientation={Gtk.Orientation.VERTICAL} cssName="section-background">

            </box>

        </box>
    );
}



