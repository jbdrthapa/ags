import Gtk from "gi://Gtk?version=4.0";
import Gdk from "gi://Gdk?version=4.0"
import { For, createBinding } from "gnim";

export function AudioSettings() {

    return (
        <box orientation={Gtk.Orientation.VERTICAL} spacing={10}>

            <label label="Audio Settings" halign={Gtk.Align.START} cssName="section-heading" />

        </box>
    );
}

