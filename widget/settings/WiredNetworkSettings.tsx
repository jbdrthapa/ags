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

    const state = createComputed(() => {
        const rawState = createBinding(wired, "state");
        return NM_STATE[rawState()][1] ?? "?";
    });

    const stateIconPath = createComputed(() => {
        const rawState = createBinding(wired, "state");
        return NM_STATE[rawState()][0] ?? "?";
    });

    return (
        <box orientation={Gtk.Orientation.VERTICAL} spacing={10}>

            <label label="Wired Network" halign={Gtk.Align.START} cssName="section-heading" />

            <box spacing={10} orientation={Gtk.Orientation.VERTICAL} cssName="section-background">

                <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
                    <label label="State" xalign={0} cssName="settings-param-caption" />
                    <label label={state} css="min-width: 220px;" cssName="settings-param-value" halign={Gtk.Align.START} />
                    <image file={stateIconPath} tooltipText={state} pixelSize={48} cssName="settings-param-icon" halign={Gtk.Align.START} />
                </box>

            </box>
        </box>
    );
}



