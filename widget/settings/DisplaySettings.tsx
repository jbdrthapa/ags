import Gtk from "gi://Gtk?version=4.0";
import Gdk from "gi://Gdk?version=4.0"
import { For, createBinding } from "gnim";

export function DisplaySettings() {

    const display = Gdk.Display.get_default();
    const monitors = () => display?.get_monitors() ?? [];

    return (
        <box orientation={Gtk.Orientation.VERTICAL} spacing={10}>

            <label label="Properties" halign={Gtk.Align.START} cssName="section-heading" />

            <For each={monitors}>
                {(monitor) => (
                    <box spacing={10} orientation={Gtk.Orientation.VERTICAL} cssName="section-background">

                        <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
                            <label label="Connector" xalign={0} cssName="settings-param-caption" />
                            <label label={createBinding(monitor, "connector")} cssName="settings-param-value" halign={Gtk.Align.START} />
                        </box>

                        <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
                            <label label="Description" xalign={0} cssName="settings-param-caption" />
                            <label label={createBinding(monitor, "description")} cssName="settings-param-value" halign={Gtk.Align.START} />
                        </box>

                        <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
                            <label label="Manufacturer" xalign={0} cssName="settings-param-caption" />
                            <label label={createBinding(monitor, "manufacturer")} cssName="settings-param-value" halign={Gtk.Align.START} />
                        </box>

                        <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
                            <label label="Model" xalign={0} cssName="settings-param-caption" />
                            <label label={createBinding(monitor, "model")} cssName="settings-param-value" halign={Gtk.Align.START} />
                        </box>

                        <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
                            <label label="Scale" xalign={0} cssName="settings-param-caption" />
                            <label label={createBinding(monitor, "scale").as(val => String(val))} cssName="settings-param-value" halign={Gtk.Align.START} />
                        </box>

                        <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
                            <label label="Refresh Rate" xalign={0} cssName="settings-param-caption" />
                            <label label={createBinding(monitor, "refresh-rate").as(val => String(val))} cssName="settings-param-value" halign={Gtk.Align.START} />
                        </box>

                        <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
                            <label label="geometry" xalign={0} cssName="settings-param-caption" />
                            <label
                                label={createBinding(monitor, "scale").as(scale => {
                                    const geo = monitor.get_geometry();
                                    const left = geo.x;
                                    const top = geo.y;
                                    const width = geo.width * scale;
                                    const height = geo.height * scale;

                                    return `${width}x${height} @ ${left},${top}`;
                                })}
                                cssName="settings-param-value"
                                halign={Gtk.Align.START}>
                            </label>
                        </box>

                    </box>
                )}
            </For>

        </box>
    );
}

