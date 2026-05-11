import Gtk from "gi://Gtk?version=4.0";
import Gdk from "gi://Gdk?version=4.0"
import { For, createBinding } from "gnim";

export function DisplaySettings() {

    const display = Gdk.Display.get_default();
    const monitors = () => display?.get_monitors() ?? [];

    // console.log(`Initial monitors: ${monitors.get_n_items()}`);


    return (
        <box orientation={Gtk.Orientation.VERTICAL} spacing={10}>

            <label label="Displays" halign={Gtk.Align.START} />

            <For each={monitors}>
                {(monitor) => (
                    <box spacing={6} orientation={Gtk.Orientation.VERTICAL}>

                        <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
                            <label label="Connector" />
                            <label label={createBinding(monitor, "connector")} halign={Gtk.Align.START} />
                        </box>

                        <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
                            <label label="Description" />
                            <label label={createBinding(monitor, "description")} halign={Gtk.Align.START} />
                        </box>

                        <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
                            <label label="Manufacturer" />
                            <label label={createBinding(monitor, "manufacturer")} halign={Gtk.Align.START} />
                        </box>

                        <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
                            <label label="Model" />
                            <label label={createBinding(monitor, "model")} halign={Gtk.Align.START} />
                        </box>

                        <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
                            <label label="Scale" />
                            <label label={createBinding(monitor, "scale").as(val => String(val))} halign={Gtk.Align.START} />
                        </box>

                        <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
                            <label label="Refresh Rate" />
                            <label label={createBinding(monitor, "refresh-rate").as(val => String(val))} halign={Gtk.Align.START} />
                        </box>

                        <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
                            <label label="geometry" />
                            <label
                                label={createBinding(monitor, "geometry").as(geo => {
                                    const scale = monitor.get_scale();
                                    const left = geo.x;
                                    const top = geo.y;
                                    const width = geo.width * scale;
                                    const height = geo.height * scale;

                                    return `${width}x${height} @ ${left},${top}`;
                                })}
                                halign={Gtk.Align.START}>
                            </label>
                        </box>

                    </box>
                )}
            </For>

        </box>
    );
}

