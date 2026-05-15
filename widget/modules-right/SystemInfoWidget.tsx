import Gtk from "gi://Gtk?version=4.0";
import GLib from 'gi://GLib';
import app from "ags/gtk4/app";
import { WindowName } from "../../constants";

const settingsWindowName = WindowName.settings
const modulesRightWindowName = WindowName.modulesRight;

export function SystemInfoWidget() {

    return (
        <box orientation={Gtk.Orientation.HORIZONTAL} hexpand={false} halign={Gtk.Align.CENTER} cssName="system-info-container">

            <box hexpand={true} halign={Gtk.Align.START} cssName="user-avatar">
                <image iconSize={Gtk.IconSize.LARGE} />
            </box>

            <box halign={Gtk.Align.END}>
                <box orientation={Gtk.Orientation.VERTICAL}>
                    <box>
                        <button label="󰿅" cssName="system-info-button" tooltipText="Log Off" onClicked={() => {
                            GLib.spawn_command_line_async('bash -c "niri msg action quit --skip-confirmation"');
                        }} />

                        <button label="" cssName="system-info-button" tooltipText="Reboot" onClicked={() => {
                            GLib.spawn_command_line_async('bash -c "systemctl reboot"');
                        }} />

                        <button label="" cssName="system-info-button" tooltipText="Power Off" onClicked={() => {
                            GLib.spawn_command_line_async('bash -c "systemctl poweroff"');
                        }} />
                    </box>
                    <box>
                        <button label="" cssName="system-info-button" tooltipText="Settings" onClicked={() => {
                            app.toggle_window(modulesRightWindowName);
                            app.toggle_window(settingsWindowName)
                        }} />

                        <button label="" cssName="system-info-button" tooltipText="Restart Shell" onClicked={() => {
                            GLib.spawn_command_line_async('bash -c "ags quit; ags run"');
                        }} />

                        <button label="" cssName="system-info-button" tooltipText="Lock Screen" onClicked={() => {
                            GLib.spawn_command_line_async('bash -c "swaylock"');
                        }} />
                    </box>

                </box>

            </box>
        </box>
    );
}