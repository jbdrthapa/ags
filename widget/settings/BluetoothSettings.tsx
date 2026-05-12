import Gtk from "gi://Gtk?version=4.0";
import AstalBluetooth from "gi://AstalBluetooth"
import { For, createBinding } from "gnim";

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

            <box spacing={10}>
                <label label="Discover" />

                <button onClicked={() => {
                    if (!adapter?.discovering) {
                        console.log("Starting discovery");
                        adapter?.start_discovery();
                    }
                    else {
                        console.log("Stopping discovery");
                        adapter?.stop_discovery();
                    }
                }
                }
                    cssName="settings-button">Toggle
                </button>

                <button onClicked={() => { console.log("Stopping discovery"); adapter?.stop_discovery() }} cssName="settings-button">Stop</button>
            </box>

            <box orientation={Gtk.Orientation.HORIZONTAL} spacing={20}>
                <box orientation={Gtk.Orientation.VERTICAL}>
                    <label label="Discovery" halign={Gtk.Align.START} cssName="section-heading" />

                    <box spacing={10} orientation={Gtk.Orientation.VERTICAL} cssName="section-background">
                        <scrolledwindow
                            vexpand={true}
                            hexpand={false}
                            hscrollbarPolicy={Gtk.PolicyType.NEVER}
                            vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
                        >
                            <box spacing={10} orientation={Gtk.Orientation.VERTICAL}>
                                <For each={createBinding(bluetooth, "devices")}>
                                    {(device) => {
                                        return (
                                            <box spacing={10} orientation={Gtk.Orientation.VERTICAL}>
                                                <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
                                                    <label
                                                        label={createBinding(device, "name").as(name => name || device.address || "Unknown Device")}
                                                        cssName="settings-param-value-compact"
                                                        halign={Gtk.Align.START}
                                                    />
                                                    <label
                                                        label={createBinding(device, "name").as(name => name || device.address || "Unknown Device")}
                                                        cssName="settings-param-value-compact"
                                                        halign={Gtk.Align.START}
                                                    />
                                                </box>
                                            </box>
                                        );
                                    }}
                                </For>
                            </box>
                        </scrolledwindow>

                    </box>
                </box>
                <box orientation={Gtk.Orientation.VERTICAL}>
                    <label label="Paired" halign={Gtk.Align.START} cssName="section-heading" />

                    <box spacing={10} orientation={Gtk.Orientation.VERTICAL} cssName="section-background">

                    </box>
                </box>

            </box>



        </box>
    );
}



