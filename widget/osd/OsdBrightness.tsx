import { Astal, Gtk, Gdk } from "ags/gtk4"
import { createBinding, createState } from "ags"
import DisplayService from "../../services/DisplayService"
import { WindowName } from "../../constants"

const ANIMATION_TIME = 2000
let delayId: any = null
let initCount = 2

export default function OsdBrigtness(gdkmonitor: Gdk.Monitor) {

    const windowName = WindowName.osd;

    const brightness = DisplayService.get_default()
    if (!brightness) return <box />

    const brightnessBinding = createBinding(brightness, "brightness_percent")
    const iconBinding = createBinding(brightness, "brightness_icon")

    // GTK LevelBar expects 0.0 -> 1.0. Divide the 0-100 service percentage by 100.
    const levelBarBinding = brightnessBinding.as(p => (p ?? 0) / 100)

    // Create a text string binding (e.g., "53%")
    const textPercentBinding = brightnessBinding.as(p => `${Math.round(p ?? 0)}%`)


    // Destructure the accessor [0] and the setter function [1]
    const [visible, setVisible] = createState(false)

    function showOsd() {

        // Added so it doesn't show the OSD when initializing. 
        // This is due to 2 subscription to WirePlumber signals ("notify::volume","notify::mute").

        if (initCount > 0) {
            initCount--;

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

    brightness.connect("notify::brightness-percent", () => showOsd())
    brightness.connect("notify::brightness-icon", () => showOsd())

    const osdBrightness = (<window
        name={windowName}
        namespace={windowName}
        gdkmonitor={gdkmonitor}
        cssName={"osd-window"}
        anchor={Astal.WindowAnchor.BOTTOM}
        layer={Astal.Layer.OVERLAY}
        visible={visible} // Pass the read-only accessor object here
    >
        <box cssName={"osd-box"} orientation={Gtk.Orientation.HORIZONTAL} spacing={8}>
            <label label={"Brightness"} hexpand={false} halign={Gtk.Align.CENTER} cssName="osd-device-name" />
            <label label={iconBinding} css="font-size: 24px;" cssName={"osd-box-icon"} />
            <label label={textPercentBinding} cssName={"osd-box-label"} />
            <levelbar
                widthRequest={100}
                heightRequest={25}
                cssClasses={["osd-bar"]}
                value={levelBarBinding}
                valign={Gtk.Align.CENTER}
                hexpand={true}
            />
        </box>
    </window>
    ) as Gtk.Window;

    return osdBrightness;
}