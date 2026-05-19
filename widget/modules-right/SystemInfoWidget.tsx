import Gtk from "gi://Gtk?version=4.0";
import GLib from 'gi://GLib';
import app from "ags/gtk4/app";
import { WindowName } from "../../constants";
import SystemInfoService from "../../services/SystemInfoService";
import { createBinding } from "gnim";

const settingsWindowName = WindowName.settings
const modulesRightWindowName = WindowName.modulesRight;

export function SystemInfoWidget() {

    const systemInfoService = SystemInfoService.get_default();

    return (
        <box orientation={Gtk.Orientation.HORIZONTAL} cssName="system-info-container" spacing={0}>

            <box hexpand={true} halign={Gtk.Align.START} cssName="user-avatar">
                <image iconSize={Gtk.IconSize.LARGE} />
            </box>
            <box hexpand={true} halign={Gtk.Align.START}>
                <box orientation={Gtk.Orientation.VERTICAL} vexpand={false} valign={Gtk.Align.CENTER}>
                    <label label={createBinding(systemInfoService, "host_info")} cssName={"system-info-data-header"} hexpand={false} halign={Gtk.Align.START} />
                    <label label={createBinding(systemInfoService, "uptime_info")} cssName={"system-info-data"} hexpand={false} halign={Gtk.Align.START} />
                </box>
            </box>
            <box orientation={Gtk.Orientation.VERTICAL} halign={Gtk.Align.END} hexpand={false} vexpand={false} valign={Gtk.Align.CENTER}>
                <button label="" cssName="system-info-button" tooltipText="Settings" onClicked={() => {
                    app.toggle_window(modulesRightWindowName);
                    app.toggle_window(settingsWindowName)
                }} />

                <button label="" cssName="system-info-button" tooltipText="Restart Shell" onClicked={() => {
                    GLib.spawn_command_line_async('bash -c "ags quit -i js-shell; ags run"');
                }} />
            </box>
        </box>
    );
}