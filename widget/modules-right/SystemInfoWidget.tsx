import Gtk from "gi://Gtk?version=4.0";
import GLib from 'gi://GLib';
import app from "ags/gtk4/app";
import { WindowName } from "../../constants";

const settingsWindowName = WindowName.settings
const modulesRightWindowName = WindowName.modulesRight;

export function SystemInfoWidget() {

    return (
        <box orientation={Gtk.Orientation.HORIZONTAL} cssName="system-info-container">

            <box hexpand={true} halign={Gtk.Align.START} cssName="user-avatar">
                <image iconSize={Gtk.IconSize.LARGE} />
            </box>

            <box halign={Gtk.Align.END} hexpand={false} vexpand={false} valign={Gtk.Align.CENTER}>
                <button label="" cssName="system-info-button" tooltipText="Settings" onClicked={() => {
                    app.toggle_window(modulesRightWindowName);
                    app.toggle_window(settingsWindowName)
                }} />

                <button label="" cssName="system-info-button" tooltipText="Restart Shell" onClicked={() => {
                    GLib.spawn_command_line_async('bash -c "ags quit; ags run"');
                }} />
            </box>
        </box>
    );
}