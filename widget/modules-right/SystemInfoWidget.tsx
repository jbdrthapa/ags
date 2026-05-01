import Gtk from "gi://Gtk?version=4.0";
import GLib from 'gi://GLib';
import { createBinding } from "ags"

export function SystemInfoWidget() {


    return (
        <box orientation={Gtk.Orientation.HORIZONTAL} cssName="system-info-container">

            <box hexpand={true} halign={Gtk.Align.START}>
                <image iconSize={Gtk.IconSize.LARGE}></image>
            </box>

            <box halign={Gtk.Align.END}>

                <button label="" cssName="system-info-button" onClicked={() => {
                    GLib.spawn_command_line_async('bash -c "ags quit; ags run"');
                }} />

                <button label="" cssName="system-info-button" onClicked={() => {
                    GLib.spawn_command_line_async('bash -c "swaylock"');
                }} />

                <button label="󰿅" cssName="system-info-button" onClicked={() => {
                    GLib.spawn_command_line_async('bash -c "niri msg action quit --skip-confirmation"');
                }} />

                <button label="" cssName="system-info-button" onClicked={() => {
                    GLib.spawn_command_line_async('bash -c "systemctl reboot"');
                }} />

                <button label="" cssName="system-info-button" onClicked={() => {
                    GLib.spawn_command_line_async('bash -c "systemctl poweroff"');
                }} />

            </box>
        </box>
    );
}