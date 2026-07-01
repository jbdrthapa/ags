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


    //      ===================================================
    //                  AUDIO SETTINGS
    //      ===================================================
    //      [🔊] Headphones (Built-in Audio)     [★ Default]
    //      -------------------------------------------------
    //      Layout: Stereo  |  State: Active  |  Muted: False

    //      Channel Volumes:
    //      左 Front Left   [=============|---------]  60%
    //      右 Front Right  [=============|---------]  60%

    //      [🔈] Monitor (HDMI Audio Output)     [Set Default]
    //      -------------------------------------------------
    //      Layout: 5.1     |  State: Idle    |  Muted: True


    const CHANNEL_LAYOUT: Record<number, string> = {
        1: "󰎤",
        2: "󰎧",
        4: "󰎭",
        6: "󰎳",
        8: "󰎹"
    };

    const MUTED_STATE: Record<string, string> = {
        "true": "",
        "false": "",
    };

    const DEFAULT_STATE: Record<string, string> = {
        "true": "",
        "false": "",
    };

    const NODE_STATE: Record<number, string> = {
        0: "ERROR",
        1: "CREATING",
        2: "SUSPENDED",
        3: "IDLE",
        4: "RUNNING",
    };

    const SPEAKER_CHANNEL: Record<string, string> = {
        "FL": "Front Left",
        "FR": "Front Right",
        "SL": "Surround Left",
        "SR": "Surround Right",
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
                        return MUTED_STATE[rawIsMuted().toString()] ?? "?";
                    });

                    const isDefault = createComputed(() => {
                        const rawIsDefault = createBinding(speaker, "isDefault");
                        return DEFAULT_STATE[rawIsDefault().toString()] ?? "?";
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

                    const lockChannels = createBinding(speaker, "lockChannels");

                    return (
                        <box spacing={10} orientation={Gtk.Orientation.VERTICAL} cssName="section-background">

                            <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
                                <label label={description} cssName="settings-param-value" halign={Gtk.Align.START} />
                            </box>
                            <box orientation={Gtk.Orientation.HORIZONTAL} spacing={3}>
                                <box orientation={Gtk.Orientation.HORIZONTAL} spacing={3}>
                                    <label label="Layout" xalign={0} cssName="settings-param-caption" />
                                    <label label={layout} cssName="settings-param-value" halign={Gtk.Align.START} />
                                </box>

                                <box orientation={Gtk.Orientation.HORIZONTAL} spacing={3}>
                                    <label label="State" xalign={0} cssName="settings-param-caption" />
                                    <label label={state} cssName="settings-param-value" halign={Gtk.Align.START} />
                                </box>

                                <box orientation={Gtk.Orientation.HORIZONTAL} spacing={3}>
                                    <label label="Muted" xalign={0} cssName="settings-param-caption" />
                                    <label label={isMuted} cssName="settings-param-value" halign={Gtk.Align.START} />
                                </box>
                            </box>

                            <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
                                <label label="Icon" xalign={0} cssName="settings-param-caption" />
                                <label label={volumeIcon} cssName="settings-param-value" halign={Gtk.Align.START} />
                            </box>

                            <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
                                <label label="Default" xalign={0} cssName="settings-param-caption" />
                                <label label={isDefault} cssName="settings-param-value" halign={Gtk.Align.START} />
                            </box>

                            <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
                                <label label="Lock" xalign={0} cssName="settings-param-caption" />
                                <Gtk.Switch
                                active={lockChannels}
                                hexpand={false}
                                vexpand={false}
                                halign={Gtk.Align.END}
                                valign={Gtk.Align.CENTER}
                                onNotifyActive={(self) => {
                                    speaker.lockChannels = self.active;
                                }}/>
                            </box>

                            

                            <For each={createComputed(() => speaker.channels || [])}>
                                {(channel: any) => {

                                    const channelVolume = createBinding(channel, "volume");

                                    const volumeText = createComputed(() => `${Math.round(channelVolume() * 100)}%`);

                                    const channelName = createComputed(() => {
                                        const rawChannelName = createBinding(channel, "name");
                                        return SPEAKER_CHANNEL[rawChannelName()];
                                    })

                                    return (
                                        <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10} marginStart={15}>
                                            <label label={channelName} />
                                            <label label={volumeText} />
                                            <slider
                                                cssClasses={["slider-control"]}
                                                tooltipText={volumeText}
                                                widthRequest={280}
                                                onChangeValue={({ value }) => channel.set_volume(value)}
                                                value={channelVolume} />

                                        </box>
                                    );
                                }}

                            </For>

                        </box>
                    )
                }}
            </For >
        </box >
    );
}


