import Gtk from "gi://Gtk?version=4.0";
import GLib from 'gi://GLib';

export function PowerButtonsWidget() {

    return (
        <box orientation={Gtk.Orientation.HORIZONTAL} halign={Gtk.Align.CENTER} spacing={35}>
            <button label="" cssName="power-button" tooltipText="Lock Screen" onClicked={() => {
                GLib.spawn_command_line_async('bash -c "swaylock"');
            }} />
            <button label="󰿅" cssName="power-button" tooltipText="Log Off" onClicked={() => {
                GLib.spawn_command_line_async('bash -c "niri msg action quit --skip-confirmation"');
            }} />

            <button label="" cssName="power-button" tooltipText="Reboot" onClicked={() => {
                GLib.spawn_command_line_async('bash -c "systemctl reboot"');
            }} />

            <button label="" cssName="power-button" tooltipText="Power Off" onClicked={() => {
                GLib.spawn_command_line_async('bash -c "systemctl poweroff"');
            }} />
        </box>
    );
}