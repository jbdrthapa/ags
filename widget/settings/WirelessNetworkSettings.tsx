import Gtk from "gi://Gtk?version=4.0";
import Network from "gi://AstalNetwork"
import { createBinding, createComputed } from "gnim";
import Utils from "../../Utils";

export function WirelessNetworkSettings() {

    const CONFIG_DIR = `${Utils.GetUserConfigDirectory()}/ags`;

    const network = Network.get_default();

    const wifi = network.wifi;

    if (!wifi) return <box />;

    const NM_STATE: Record<number, [string, string]> = {
        0: [`${CONFIG_DIR}/assets/network/state/nmdevice_unknown_0.svg`, "Unknown"],
        10: [`${CONFIG_DIR}/assets/network/state/nmdevice_unmanaged_10.svg`, "Unmanaged"],
        20: [`${CONFIG_DIR}/assets/network/state/nmdevice_unavailable_20.svg`, "Unavailable"],
        30: [`${CONFIG_DIR}/assets/network/state/nmdevice_disconnected_30.svg`, "Disconnected"],
        40: [`${CONFIG_DIR}/assets/network/state/nmdevice_prepare_40.svg`, "Prepare"],
        50: [`${CONFIG_DIR}/assets/network/state/nmdevice_config_50.svg`, "Config"],
        60: [`${CONFIG_DIR}/assets/network/state/nmdevice_need_auth_60.svg`, "Need Auth"],
        70: [`${CONFIG_DIR}/assets/network/state/nmdevice_ip_config_70.svg`, "IP Config"],
        80: [`${CONFIG_DIR}/assets/network/state/nmdevice_ip_check_80.svg`, "IP Check"],
        90: [`${CONFIG_DIR}/assets/network/state/nmdevice_secondaries_90.svg`, "Secondaries"],
        100: [`${CONFIG_DIR}/assets/network/state/nmdevice_activated_100.svg`, "Activated"],
        110: [`${CONFIG_DIR}/assets/network/state/nmdevice_deactivating_110.svg`, "Deactivating"],
        120: [`${CONFIG_DIR}/assets/network/state/nmdevice_failed_120.svg`, "Failed"]
    };

    const iconName = createBinding(wifi, "iconName");

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
        return NM_STATE[rawState()][1] ?? "?";
    });

    const stateIconPath = createComputed(() => {
        const rawState = createBinding(wifi, "state");
        return NM_STATE[rawState()][0] ?? "?";
    });

    const bandwidth = createComputed(() => {
        const rawBandWidth = createBinding(wifi, "bandwidth");
        return rawBandWidth().toString() ?? "?";
    });

    const frequency = createComputed(() => {
        const rawFrequency = createBinding(wifi, "frequency");
        return rawFrequency().toString() ?? "?";
    });

    return (
        <box orientation={Gtk.Orientation.VERTICAL} spacing={10}>

            <label label="Wireless Network" halign={Gtk.Align.START} cssName="section-heading" />

            <box spacing={10} orientation={Gtk.Orientation.VERTICAL} cssName="section-background">

                <box orientation={Gtk.Orientation.HORIZONTAL} spacing={20}>
                    <image iconSize={Gtk.IconSize.LARGE} cssName="settings-param-icon" iconName={iconName} />
                    <label label={ssid} cssName="settings-param-heading" halign={Gtk.Align.START} />
                </box>

                <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
                    <label label="Strength" xalign={0} cssName="settings-param-caption" />
                    <label label={strength} css="min-width: 220px;" cssName="settings-param-value" halign={Gtk.Align.START} />
                    <image file={strengthIconPath} tooltipText={strength} pixelSize={48} cssName="settings-param-icon" halign={Gtk.Align.START} />
                </box>

                <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
                    <label label="State" xalign={0} cssName="settings-param-caption" />
                    <label label={state} css="min-width: 220px;" cssName="settings-param-value" halign={Gtk.Align.START} />
                    <image file={stateIconPath} tooltipText={state} pixelSize={48} cssName="settings-param-icon" halign={Gtk.Align.START} />
                </box>

                <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
                    <label label="Frequency" xalign={0} cssName="settings-param-caption" />
                    <label label={frequency} cssName="settings-param-value" halign={Gtk.Align.START} />
                </box>

                <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
                    <label label="Bandwidth" xalign={0} cssName="settings-param-caption" />
                    <label label={bandwidth} cssName="settings-param-value" halign={Gtk.Align.START} />
                </box>
            </box>
        </box>
    );
}



