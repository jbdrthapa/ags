import Gtk from "gi://Gtk?version=4.0";
import Network from "gi://AstalNetwork"
import { createBinding, createComputed } from "gnim";
import Utils from "../../utils";

export function WiredNetworkSettings() {

    const CONFIG_DIR = `${Utils.GetUserConfigDirectory()}/ags`;

    const network = Network.get_default();

    const wired = network.wired;

    if (!wired) return <box />;

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

    const NM_SPEED: Record<number, [string, string]> = {
        // Unknown / link down
        0: [`${CONFIG_DIR}/assets/network/wired/speed/nmdevice_speed_unknown_0.svg`, "Unknown"],
        10: [`${CONFIG_DIR}/assets/network/wired/speed/nmdevice_speed_10.svg`, "10 Mbps"],
        100: [`${CONFIG_DIR}/assets/network/wired/speed/nmdevice_speed_100.svg`, "100 Mbps"],
        1000: [`${CONFIG_DIR}/assets/network/wired/speed/nmdevice_speed_1g_1000.svg`, "1 Gbps"],
        // Multi‑Gig speeds (AstalNetwork / NMDeviceEthernet raw values)
        2500: [`${CONFIG_DIR}/assets/network/wired/speed/nmdevice_speed_2_5g_2500.svg`, "2.5 Gbps"],
        5000: [`${CONFIG_DIR}/assets/network/wired/speed/nmdevice_speed_5g_5000.svg`, "5 Gbps"],
        // High‑speed NICs
        10000: [`${CONFIG_DIR}/assets/network/wired/speed/nmdevice_speed_10g_10000.svg`, "10 Gbps"],
        25000: [`${CONFIG_DIR}/assets/network/wired/speed/nmdevice_speed_25g_25000.svg`, "25 Gbps"],
        100000: [`${CONFIG_DIR}/assets/network/wired/speed/nmdevice_speed_100g_100000.svg`, "100 Gbps"]
    };

    const device = createBinding(wired, "device");

    const iconName = createBinding(wired, "iconName");

    const deviceInterface = createComputed(() => {
        return device().interface;
    });

    const macAddress = createComputed(() => {
        return device().hwAddress;
    });

    const mtu = createComputed(() => {
        return device().mtu.toString();
    });

    const rawState = createBinding(wired, "state");
    const state = createComputed(() => {
        return NM_STATE[rawState()][1] ?? "?";
    });
    const stateIconPath = createComputed(() => {
        return NM_STATE[rawState()][0] ?? "?";
    });

    const rawSpeed = createBinding(wired, "speed");
    const speed = createComputed(() => {
        return NM_SPEED[rawSpeed()][1] ?? "?";
    });
    const speedIconPath = createComputed(() => {
        return NM_SPEED[rawSpeed()][0] ?? "?";
    });

    return (
        <box orientation={Gtk.Orientation.VERTICAL} spacing={10}>

            <label label="Wired Network" halign={Gtk.Align.START} cssName="section-heading" />

            <box spacing={10} orientation={Gtk.Orientation.VERTICAL} cssName="section-background">

                <box orientation={Gtk.Orientation.HORIZONTAL} spacing={20}>
                    <image iconSize={Gtk.IconSize.LARGE} cssName="settings-param-icon" iconName={iconName} />
                    <label label={deviceInterface} cssName="settings-param-heading" halign={Gtk.Align.START} />
                </box>

                <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
                    <label label="State" xalign={0} cssName="settings-param-caption" />
                    <label label={state} css="min-width: 220px;" cssName="settings-param-value" halign={Gtk.Align.START} />
                    <image file={stateIconPath} tooltipText={state} pixelSize={48} cssName="settings-param-icon" halign={Gtk.Align.START} />
                </box>

                <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
                    <label label="Speed" xalign={0} cssName="settings-param-caption" />
                    <label label={speed} css="min-width: 220px;" cssName="settings-param-value" halign={Gtk.Align.START} />
                    <image file={speedIconPath} tooltipText={speed} pixelSize={48} cssName="settings-param-icon" halign={Gtk.Align.START} />
                </box>

                <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
                    <label label="MAC" xalign={0} cssName="settings-param-caption" />
                    <label label={macAddress} css="min-width: 220px;" cssName="settings-param-value" halign={Gtk.Align.START} />
                </box>

                <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
                    <label label="MTU" xalign={0} cssName="settings-param-caption" />
                    <label label={mtu} css="min-width: 220px;" cssName="settings-param-value" halign={Gtk.Align.START} />
                </box>

            </box>
        </box>
    );
}



