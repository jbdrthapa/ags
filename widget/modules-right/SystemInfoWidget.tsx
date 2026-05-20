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

    const avatarImg = createBinding(systemInfoService, "avatar");

    const avatar = avatarImg.peek();

    console.log("avatar : ", avatar);

    return (
        <box orientation={Gtk.Orientation.HORIZONTAL} cssName="system-info-container" spacing={0}>

            {/* <box hexpand={true} halign={Gtk.Align.START} cssName="user-avatar">

                <image iconName={} />
            </box> */}
            <box>
                {(avatar.startsWith("/")) ? (
                    // Displays local image if found
                    <box css={`
                    background-image: url('${avatar}');
                    background-size: cover;
                    background-position: center;
                    border-radius: 50%;
                    min-width: 48px;
                    min-height: 48px;
                `} />
                ) : (
                    // Displays default theme system icon icon if no file exists
                    <image iconName="avatar-default" pixelSize={48} />
                )}
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