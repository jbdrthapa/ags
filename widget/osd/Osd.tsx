import { Gdk } from "ags/gtk4"
import OsdVolume from "../osd/OsdVolume";

export default function Osd(gdkmonitor: Gdk.Monitor) {
    const osdVolume = OsdVolume(gdkmonitor);

    return (
        <window>

        </window>
    );
}