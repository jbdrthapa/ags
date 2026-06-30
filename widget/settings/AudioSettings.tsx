import Gtk from "gi://Gtk?version=4.0";
import Gdk from "gi://Gdk?version=4.0"
import { For, createBinding, createComputed } from "gnim";
import AstalWp from "gi://AstalWp?version=0.1"

export function AudioSettings() {

    const wp = AstalWp.get_default();

    const speakersRawBinding = createBinding(wp.audio, "speakers");

    const speakersBinding = createComputed(() => { return speakersRawBinding() || []; });

    const microphonesRawBinding = createBinding(wp.audio, "microphones");

    const microphonesBinding = createComputed(() => { return microphonesRawBinding() || []; });


    const CHANNEL_LAYOUT: Record<number, string> = {
        1: "Mono",
        2: "Stereo",
        4: "Quad",
        6: "5.1 Surround",
        8: "7.1 Surround"
    };

    const NODE_STATE: Record<number, string> = {
        0: "ERROR",
        1: "CREATING",
        2: "SUSPENDED",
        3: "IDLE",
        4: "RUNNING",
    };

    return (
        <box orientation={Gtk.Orientation.VERTICAL} spacing={10}>

            <label label="Audio Settings" halign={Gtk.Align.START} cssName="section-heading" />

            <For each={speakersBinding}>

                {(speaker) => {

                    const description = createComputed(() => {
                        const rawDesc = createBinding(speaker, "description");
                        return rawDesc() ?? "Unknown Device";
                    });

                    const volumeIcon = createComputed(() => {
                        const rawIcon = createBinding(speaker, "volumeIcon");
                        return rawIcon() ?? "audio-volume-muted";
                    });

                    const isMuted = createComputed(() => {
                        const rawIsMuted = createBinding(speaker, "mute");
                        return rawIsMuted().toString() ?? "?";
                    });

                    const isDefault = createComputed(() => {
                        const rawIsDefault = createBinding(speaker, "isDefault");
                        return rawIsDefault().toString() ?? "?";
                    });

                    const state = createComputed(() => {
                        const rawState = createBinding(speaker, "state");
                        return NODE_STATE[rawState()] ?? "?";
                    });

                    const layout = createComputed(() => {
                        const rawLayout = createBinding(speaker, "channels");
                        const channelsArray = rawLayout() || [];
                        const count = channelsArray.length;
                        return CHANNEL_LAYOUT[count] ?? "?";
                    });


                    return (
                        <box spacing={10} orientation={Gtk.Orientation.VERTICAL} cssName="section-background">

                            <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
                                <label label="Description" xalign={0} cssName="settings-param-caption" />
                                <label label={description} cssName="settings-param-value" halign={Gtk.Align.START} />
                            </box>

                            <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
                                <label label="Icon" xalign={0} cssName="settings-param-caption" />
                                <label label={volumeIcon} cssName="settings-param-value" halign={Gtk.Align.START} />
                            </box>

                            <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
                                <label label="Muted" xalign={0} cssName="settings-param-caption" />
                                <label label={isMuted} cssName="settings-param-value" halign={Gtk.Align.START} />
                            </box>

                            <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
                                <label label="Default" xalign={0} cssName="settings-param-caption" />
                                <label label={isDefault} cssName="settings-param-value" halign={Gtk.Align.START} />
                            </box>

                            <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
                                <label label="State" xalign={0} cssName="settings-param-caption" />
                                <label label={state} cssName="settings-param-value" halign={Gtk.Align.START} />
                            </box>

                            <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
                                <label label="Layout" xalign={0} cssName="settings-param-caption" />
                                <label label={layout} cssName="settings-param-value" halign={Gtk.Align.START} />
                            </box>

                            <For each={createComputed(() => speaker.channels || [])}>
                                {(channel: any) => {
                                    // 1. Create a live hook for this specific channel's volume property
                                    const channelVolume = createBinding(channel, "volume");

                                    // 2. Derive a reactive text stream from that live hook
                                    const volumeText = createComputed(() => `${Math.round(channelVolume() * 100)}%`);

                                    return (
                                        <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10} marginStart={15}>
                                            <label label={`${channel.name}:`} />
                                            {/* 3. Pass the accessor function directly so the widget redraws when it ticks */}
                                            <label label={volumeText} />
                                        </box>
                                    );
                                }}

                            </For>

                        </box>
                    )
                }}
            </For>
        </box >
    );
}

