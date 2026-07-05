import Gtk from "gi://Gtk?version=4.0";
import Network from "gi://AstalNetwork"
import { createBinding, createComputed } from "gnim";
import Utils from "../../utils";

export function WirelessNetworkSettings() {

    const CONFIG_DIR = `${Utils.GetUserConfigDirectory()}/ags`;

    const network = Network.get_default();

    const wifi = network.wifi;

    if (!wifi) return <box />;


    const ssid = createComputed(() => {
        const rawSsid = createBinding(wifi, "ssid");
        return rawSsid() ?? "?";
    });

    const rawStrength = createBinding(wifi, "strength");

    const strength = createComputed(() => {
        return rawStrength().toString() ?? "?";
    });

    const strengthIconPath = createComputed(() => {
        let strength = rawStrength();
        if (strength <= 0) return "${CONFIG_DIR}/assets/network/wireless/strength/wireless_strength_0.svg";
        const percentValue = Math.min(100, Math.ceil(strength / 10) * 10);
        let iconPath = `${CONFIG_DIR}/assets/network/wireless/strength/wireless_strength_${percentValue}.svg`;
        return iconPath;
    });

    const state = createComputed(() => {
        const rawState = createBinding(wifi, "state");
        return rawState().toString() ?? "?"; // TODO: icon replace
    });



    return (
        <box orientation={Gtk.Orientation.VERTICAL} spacing={10}>

            <label label="Wireless Network" halign={Gtk.Align.START} cssName="section-heading" />

            <box spacing={10} orientation={Gtk.Orientation.VERTICAL} cssName="section-background">
                <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
                    <label label="SSID" xalign={0} cssName="settings-param-caption" />
                    <label label={ssid} cssName="settings-param-value" halign={Gtk.Align.START} />
                </box>

                <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
                    <label label="Strength" xalign={0} cssName="settings-param-caption" />
                    <label label={strength} css="min-width: 220px;" cssName="settings-param-value" halign={Gtk.Align.START} />
                    <image file={strengthIconPath} tooltipText={strength} pixelSize={48} cssName="settings-param-icon" halign={Gtk.Align.START} />
                </box>

                <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
                    <label label="State" xalign={0} cssName="settings-param-caption" />
                    <label label={state} cssName="settings-param-value" halign={Gtk.Align.START} />
                </box>
            </box>
        </box>
    );
}



