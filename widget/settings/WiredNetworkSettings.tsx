import Gtk from "gi://Gtk?version=4.0";
import Network from "gi://AstalNetwork"
import { createBinding, createComputed } from "gnim";

export function WiredNetworkSettings() {

    const network = Network.get_default();

    const wired = network.wired;

    if (!wired) return <box />;

    const state = createComputed(() => {
        const rawState = createBinding(wired, "state");
        return rawState().toString() ?? "?"; // TODO: icon replace
    });

    return (
        <box orientation={Gtk.Orientation.VERTICAL} spacing={10}>

            <label label="Wired Network" halign={Gtk.Align.START} cssName="section-heading" />

            <box spacing={10} orientation={Gtk.Orientation.VERTICAL} cssName="section-background">

                <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
                    <label label="State" xalign={0} cssName="settings-param-caption" />
                    <label label={state} cssName="settings-param-value" halign={Gtk.Align.START} />
                </box>
            </box>
        </box>
    );
}



