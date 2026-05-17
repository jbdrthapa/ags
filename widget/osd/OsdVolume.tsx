import { Astal, Gtk, Gdk } from "ags/gtk4"
import { createBinding, createState } from "ags"
import Wp from "gi://AstalWp"

const ANIMATION_TIME = 2000
let delayId: any = null
let initCount = 2

export default function OsdVolume(gdkmonitor: Gdk.Monitor) {
    const speaker = Wp.get_default()?.get_audio().defaultSpeaker
    if (!speaker) return <box />

    const volumeBinding = createBinding(speaker, "volume")
    const iconBinding = createBinding(speaker, "volume-icon")

    // Destructure the accessor [0] and the setter function [1]
    const [visible, setVisible] = createState(false)

    function showOsd() {

        // Added so it doesn't show the OSD when initializing. 
        // This is due to 2 subscription to WirePlumber signals ("notify::volume","notify::mute").

        if (initCount > 0) {
            initCount--;
            console.log("osd window is not created, returning");

            return;
        }

        // FIXED: Call the setter function directly
        setVisible(true)

        if (delayId) {
            clearTimeout(delayId)
        }
        delayId = setTimeout(() => {
            // FIXED: Call the setter function directly
            setVisible(false)
            delayId = null
        }, ANIMATION_TIME)
    }

    speaker.connect("notify::volume", () => showOsd())
    speaker.connect("notify::mute", () => showOsd())

    const osdWindow = (<window
        name="volume-osd"
        gdkmonitor={gdkmonitor}
        cssName={"osd-window"}
        namespace="volume-osd"
        anchor={Astal.WindowAnchor.BOTTOM}
        layer={Astal.Layer.OVERLAY}
        visible={visible} // Pass the read-only accessor object here
    >
        <box orientation={Gtk.Orientation.VERTICAL}>
            <label label={"Speaker"} cssName={"osd-name"} />
            <box cssName={"osd-box"} orientation={Gtk.Orientation.HORIZONTAL} spacing={8}>
                <image iconName={iconBinding} pixelSize={32} />
                <label label={volumeBinding.as(v => `${Math.round(v * 100)}`)} />
                <levelbar
                    widthRequest={100}
                    heightRequest={25}
                    cssClasses={["osd-bar"]}
                    value={volumeBinding.as(v => v)}
                    valign={Gtk.Align.CENTER}
                    hexpand={true}
                />
            </box>
        </box>
    </window>
    ) as Gtk.Window;

    return osdWindow;
}
