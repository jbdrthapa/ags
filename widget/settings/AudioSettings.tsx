import Gtk from "gi://Gtk?version=4.0";
import { For, createBinding, createComputed } from "gnim";
import AstalWp from "gi://AstalWp?version=0.1";
import Utils from "../../utils";

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


    const CONFIG_DIR = `${Utils.GetUserConfigDirectory()}/ags`;

    const CHANNEL_LAYOUT: Record<number, string> = {
        1: `${CONFIG_DIR}/assets/speaker_layout/mono.svg`,
        2: `${CONFIG_DIR}/assets/speaker_layout/stereo.svg`,
        4: `${CONFIG_DIR}/assets/speaker_layout/quad.svg`,
        6: `${CONFIG_DIR}/assets/speaker_layout/5p1_surround.svg`,
        8: `${CONFIG_DIR}/assets/speaker_layout/7p1_surround.svg`
    };

    const NODE_STATE: Record<number, string> = {
        0: `${CONFIG_DIR}/assets/node_state/node_state_0_creating.svg`,              // ASTAL_WP_NODE_STATE_CREATING
        1: `${CONFIG_DIR}/assets/node_state/node_state_1_suspended.svg`,             // ASTAL_WP_NODE_STATE_SUSPENDED
        2: `${CONFIG_DIR}/assets/node_state/node_state_2_idle.svg`,                  // ASTAL_WP_NODE_STATE_IDLE
        3: `${CONFIG_DIR}/assets/node_state/node_state_3_running.svg`,               // ASTAL_WP_NODE_STATE_RUNNING
    };

    const SPEAKER_CHANNEL: Record<string, string> = {
        "FL": "Front Left",
        "FR": "Front Right",
        "SL": "Surround Left",
        "SR": "Surround Right",
    };

    const MEDIA_CLASS: Record<number, string> = {
        0: `${CONFIG_DIR}/assets/media_class/media_0_unknown.svg`,                   // ASTAL_WP_MEDIA_CLASS_UNKNOWN
        1: `${CONFIG_DIR}/assets/media_class/media_1_audio_microphone.svg`,          // ASTAL_WP_MEDIA_CLASS_AUDIO_MICROPHONE
        2: `${CONFIG_DIR}/assets/media_class/media_2_audio_speaker.svg`,             // ASTAL_WP_MEDIA_CLASS_AUDIO_SPEAKER
        3: `${CONFIG_DIR}/assets/media_class/media_3_audio_recorder.svg`,            // ASTAL_WP_MEDIA_CLASS_AUDIO_RECORDER
        4: `${CONFIG_DIR}/assets/media_class/media_4_audio_stream.svg`,              // ASTAL_WP_MEDIA_CLASS_AUDIO_STREAM
        5: `${CONFIG_DIR}/assets/media_class/media_5_video_source.svg`,              // ASTAL_WP_MEDIA_CLASS_VIDEO_SOURCE
        6: `${CONFIG_DIR}/assets/media_class/media_6_video_sink.svg`,                // ASTAL_WP_MEDIA_CLASS_VIDEO_SINK
        7: `${CONFIG_DIR}/assets/media_class/media_7_video_recorder.svg`,            // ASTAL_WP_MEDIA_CLASS_VIDEO_RECORDER
        8: `${CONFIG_DIR}/assets/media_class/media_8_video_stream.svg`,              // ASTAL_WP_MEDIA_CLASS_VIDEO_STREAM
        9: `${CONFIG_DIR}/assets/media_class/media_9_audio_source_virtual`,          // ASTAL_WP_MEDIA_CLASS_AUDIO_SOURCE_VIRTUAL
    }

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

                    const nodeStateIconPath = createComputed(() => {
                        const rawState = createBinding(speaker, "state");
                        return NODE_STATE[rawState()] ?? "?";
                    });

                    const mediaClassIconPath = createComputed(() => {
                        const rawMediaClass = createBinding(speaker, "mediaClass");
                        return MEDIA_CLASS[rawMediaClass()] ?? "?";
                    });

                    const layoutIconPath = createComputed(() => {
                        const rawLayout = createBinding(speaker, "channels");
                        const channelsArray = rawLayout() || [];
                        const count = channelsArray.length;
                        return CHANNEL_LAYOUT[count] ?? "?";
                    });

                    const isDefault = createBinding(speaker, "isDefault");

                    const isMute = createBinding(speaker, "mute");

                    const lockChannels = createBinding(speaker, "lockChannels");

                    return (
                        <box spacing={10} orientation={Gtk.Orientation.VERTICAL} cssName="section-background">

                            <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
                                <label label={description} cssName="settings-param-value" halign={Gtk.Align.START} />
                            </box>
                            <box orientation={Gtk.Orientation.HORIZONTAL} spacing={3}>
                                <box orientation={Gtk.Orientation.HORIZONTAL} spacing={3}>
                                    <label label="Layout" xalign={0} cssName="settings-param-caption" />
                                    <image file={layoutIconPath} iconSize={Gtk.IconSize.LARGE} cssName="settings-param-icon" halign={Gtk.Align.START} />
                                </box>

                                <box orientation={Gtk.Orientation.HORIZONTAL} spacing={3}>
                                    <label label="Class" xalign={0} cssName="settings-param-caption" />
                                    <image file={mediaClassIconPath} iconSize={Gtk.IconSize.LARGE} cssName="settings-param-icon" halign={Gtk.Align.START} />
                                </box>

                                <box orientation={Gtk.Orientation.HORIZONTAL} spacing={3}>
                                    <label label="State" xalign={0} cssName="settings-param-caption" />
                                    <image file={nodeStateIconPath} iconSize={Gtk.IconSize.LARGE} cssName="settings-param-icon" halign={Gtk.Align.START} />
                                </box>

                                <box orientation={Gtk.Orientation.HORIZONTAL} spacing={3}>
                                    <label label="Muted" xalign={0} cssName="settings-param-caption" />
                                    <Gtk.Switch
                                        active={isMute}
                                        hexpand={false}
                                        vexpand={false}
                                        halign={Gtk.Align.END}
                                        valign={Gtk.Align.CENTER}
                                        onNotifyActive={(self) => {
                                            speaker.mute = self.active;
                                        }} />
                                </box>
                            </box>

                            <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
                                <label label="Icon" xalign={0} cssName="settings-param-caption" />
                                <label label={volumeIcon} cssName="settings-param-value" halign={Gtk.Align.START} />
                            </box>

                            <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
                                <label label="Default" xalign={0} cssName="settings-param-caption" />
                                <Gtk.Switch
                                    active={isDefault}
                                    hexpand={false}
                                    vexpand={false}
                                    halign={Gtk.Align.END}
                                    valign={Gtk.Align.CENTER}
                                    onNotifyActive={(self) => {
                                        speaker.isDefault = self.active;
                                    }} />
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
                                    }} />
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


