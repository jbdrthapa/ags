import Gtk from "gi://Gtk?version=4.0";
import app from "ags/gtk4/app"


export function AboutSettings() {

    return (
        <box orientation={Gtk.Orientation.VERTICAL} spacing={10}>

            <label label="About" halign={Gtk.Align.START} cssName="section-heading" />

            <box spacing={10} orientation={Gtk.Orientation.VERTICAL} cssName="section-background">
                <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
                    <label label="Title" xalign={0} cssName="settings-param-caption" />
                    <label label={app.instanceName} cssName="settings-param-value" halign={Gtk.Align.START} />
                </box>
                <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
                    <label label="Version" xalign={0} cssName="settings-param-caption" />
                    <label label={app.version} cssName="settings-param-value" halign={Gtk.Align.START} />
                </box>
            </box>

        </box>
    );
}



