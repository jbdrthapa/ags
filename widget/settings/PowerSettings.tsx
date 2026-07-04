import Gtk from "gi://Gtk?version=4.0";
import { For, createBinding, createComputed } from "gnim";
import AstalBattery from "gi://AstalBattery?version=0.1";
import Utils from "../../utils";

export function PowerSettings() {

    const upower = new AstalBattery.UPower();

    const devicesBinding = createComputed(() => upower.devices || []);

    return (

        <box orientation={Gtk.Orientation.VERTICAL} spacing={10}>

            <label label="Power Settings" halign={Gtk.Align.START} cssName="section-heading" />

            <box orientation={Gtk.Orientation.HORIZONTAL} spacing={40}>
                <For each={devicesBinding}>
                    {(device) => {

                        const vendor = createBinding(device, "vendor");

                        const percentage = createComputed(() => {
                            const rawPercentage = createBinding(device, "percentage");
                            const formattedPercentage = `${Math.round((rawPercentage() ?? 0) * 100)}%`;
                            return formattedPercentage ?? "Unknown Device";
                        });

                        return (
                            <box orientation={Gtk.Orientation.VERTICAL} spacing={10} cssName="section-background">
                                <label label={vendor} cssName="settings-param-heading" />
                                <label label={percentage} />
                            </box>
                        );
                    }}
                </For>
            </box>


        </box >

    );
}


