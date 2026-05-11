import Gtk from "gi://Gtk?version=4.0";
import AstalBluetooth from "gi://AstalBluetooth"
import { createBinding } from "gnim";

function BindBluetoothAdapterProperty<prop_key extends keyof AstalBluetooth.Adapter>(caption: string, object: AstalBluetooth.Adapter, property: prop_key) {
    const binding = createBinding(object, property as any)

    return (
        <box orientation={Gtk.Orientation.HORIZONTAL}>
            <label label={caption} />
            <label label={binding.as(val => String(val))} />
        </box>
    );
}

export function BluetoothSettings() {

    const bluetooth = AstalBluetooth.get_default();

    const adapter = bluetooth.adapter;

    const devices_binding = createBinding(bluetooth, "devices");

    return (
        <box orientation={Gtk.Orientation.VERTICAL} spacing={10}>
            {BindBluetoothAdapterProperty("Name", adapter, "name")}
            {BindBluetoothAdapterProperty("Address", adapter, "address")}
            {BindBluetoothAdapterProperty("Powered", adapter, "powered")}
            {BindBluetoothAdapterProperty("Pairable", adapter, "pairable")}
            {BindBluetoothAdapterProperty("Discoverable", adapter, "discoverable")}

            <Gtk.Separator />

            <label label="Devices" halign={Gtk.Align.START} />
            

        </box>
    );
}



