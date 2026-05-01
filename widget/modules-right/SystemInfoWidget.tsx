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
                    GLib.spawn_command_line_async('notify-send "Restarting menu"');
                }} />

                <button label="" cssName="system-info-button" onClicked={() => {
                    GLib.spawn_command_line_async('notify-send "Locking Screen"');
                }} />

                <button label="" cssName="system-info-button" onClicked={() => {
                    GLib.spawn_command_line_async('notify-send "Restarting System"');
                }} />

                <button label="" cssName="system-info-button" onClicked={() => {
                    GLib.spawn_command_line_async('notify-send "Powering Off"');
                }} />

            </box>
        </box>
    );
}