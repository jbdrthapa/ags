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

    if (!adapter)
        return (
            <box orientation={Gtk.Orientation.VERTICAL} spacing={10}>
                <label label="Properties" halign={Gtk.Align.START} cssName="section-heading" />
                <box spacing={10} orientation={Gtk.Orientation.VERTICAL} cssName="section-background">
                    <label label="Unable to query the bluetooth adapter, make sure bluetooth is available on the system." xalign={0} cssName="settings-param-caption"/>
                </box>
            </box>);

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



            <box orientation={Gtk.Orientation.HORIZONTAL} spacing={20}>

                {/* Devices */}

                <box orientation={Gtk.Orientation.VERTICAL} widthRequest={800}>
                    <label label="Devices" halign={Gtk.Align.START} cssName="section-heading" />

                    <box spacing={20} orientation={Gtk.Orientation.VERTICAL} cssName="section-background">

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
                                                        label={createBinding(device, "paired").as(p => String(p))}
                                                        cssName="settings-param-value-compact"
                                                        halign={Gtk.Align.START}
                                                    />

                                                    <button
                                                        onClicked={async () => { // 1. Mark the callback context as async
                                                            if (!device) return;

                                                            try {
                                                                if (device.paired) {
                                                                    // 2. Await the unpair routine asynchronously
                                                                    await device.cancel_pairing();
                                                                    console.log("Successfully unpaired!");
                                                                } else {
                                                                    // 2. Await the pairing handshake asynchronously
                                                                    await device.pair();
                                                                    console.log("Successfully paired!");
                                                                }
                                                            } catch (err) {
                                                                // 3. Catches any rejections/timeouts without freezing Gjs
                                                                console.error("Bluetooth action operation failed:", err);
                                                            }
                                                        }}
                                                        cssName="settings-button"
                                                    >
                                                        <label label={createBinding(device, "paired").as(isPaired => isPaired ? "Unpair" : "Pair")} />
                                                    </button>


                                                </box>
                                            </box>
                                        );
                                    }}
                                </For>
                            </box>
                        </scrolledwindow>

                    </box>
                </box>

                {/* Functions */}

                <box orientation={Gtk.Orientation.VERTICAL}>
                    <label label="Functions" halign={Gtk.Align.START} cssName="section-heading" />

                    <box spacing={10} orientation={Gtk.Orientation.VERTICAL} cssName="section-background">
                        <box spacing={10}>
                            <label label="Discovery" />

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
                        </box>

                    </box>
                </box>

            </box>



        </box>
    );
}



