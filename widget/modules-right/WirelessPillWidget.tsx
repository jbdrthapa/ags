import Gtk from "gi://Gtk?version=4.0";
import GLib from 'gi://GLib';
import AstalNetwork from "gi://AstalNetwork"
import { For, With, createBinding } from "ags"
import { exec, execAsync } from "ags/process"
import { createPoll } from "ags/time";

export function WirelessPillWidget() {
    const wifi_network_device_name = "wlp99s0"
    const network = AstalNetwork.get_default()
    const wifi = createBinding(network, "wifi")

    const sorted = (arr: Array<AstalNetwork.AccessPoint>) => {
        return arr.filter((ap) => !!ap.ssid).sort((a, b) => b.strength - a.strength)
    }

    async function connect(ap: AstalNetwork.AccessPoint) {
        // connecting to ap is not yet supported
        // https://github.com/Aylur/astal/pull/13
        try {
            await execAsync(`nmcli d wifi connect ${ap.bssid}`)
        } catch (error) {
            // you can implement a popup asking for password here
            console.error(error)
        }
    }

    function networkProperties(caption: string, value: string) {
        return (
            <box orientation={Gtk.Orientation.HORIZONTAL}>
                <label label={caption} cssName="pill-summary-property-name" />
                <label label={value} cssName="pill-summary-property-value" />
            </box>
        )
    }

    function networkPropertiesBound<K extends keyof AstalNetwork.Wifi>(caption: string, object: AstalNetwork.Wifi, property: K) {
        // createBinding returns a Binding object for that specific property
        const binding = createBinding(object, property as any)

        return (
            <box orientation={Gtk.Orientation.HORIZONTAL}>
                <label label={caption} cssName="pill-summary-property-name" />

                {/* Use .as() to ensure numeric values are cast to strings for the label */}
                <label label={binding.as(val => String(val))} cssName="pill-summary-property-value" />
            </box>
        )
    }

    function PillInfo(icon: any, name: string, detail: any) {
        return (
            <box orientation={Gtk.Orientation.HORIZONTAL}>
                <image iconName={icon} cssName="pill-button-image" />
                <box orientation={Gtk.Orientation.VERTICAL}>
                    {/* Remove quotes to use the variable, not the string "name" */}
                    <label xalign={0} label={name} cssName="pill-button-name" />
                    <label xalign={0} label={detail} cssName="pill-button-detail" />
                </box>
            </box>
        )
    }

    function WiFiPillInfo() {
        const iconName = wifi.as(w => w?.iconName || "")
        const ssidLabel = wifi.as(w => w?.ssid || "Disconnected")

        return PillInfo(iconName, "Wireless", ssidLabel);
    }

    return (
        <box visible={wifi(Boolean)}>
            <With value={wifi}>
                {(wifi) =>
                    wifi && (
                        <menubutton cssName="pill-button">
                            <box orientation={Gtk.Orientation.HORIZONTAL}>
                                {WiFiPillInfo()}
                            </box>
                            <popover>
                                <box orientation={Gtk.Orientation.VERTICAL} heightRequest={400} cssName="pill-popover-container">

                                    {/* Current WiFi connection details */}

                                    <box orientation={Gtk.Orientation.VERTICAL}>
                                        {networkPropertiesBound("Network", wifi, "ssid")}
                                        {networkPropertiesBound("Strength", wifi, "strength")}
                                    </box>

                                    {/* Access point browse list */}
                                    <box orientation={Gtk.Orientation.VERTICAL} cssName="pill-popover-details-area-container">
                                        <label label="Available Access Points" cssName={"pill-popover-details-header"} />
                                        <For each={createBinding(wifi, "accessPoints")(sorted)}>
                                            {(ap: AstalNetwork.AccessPoint) => (
                                                <button onClicked={() => connect(ap)} cssName="wifi-access-point-item">
                                                    <box spacing={4}>
                                                        <image iconName={createBinding(ap, "iconName")} />
                                                        <label label={createBinding(ap, "ssid")} />
                                                        <image iconName="object-select-symbolic" visible={createBinding(wifi, "activeAccessPoint",)((active) => active === ap)} />
                                                    </box>
                                                </button>
                                            )}
                                        </For>
                                    </box>
                                </box>
                            </popover>
                        </menubutton>
                    )
                }
            </With>
        </box>
    );

}