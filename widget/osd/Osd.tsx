import { Gdk } from "ags/gtk4"
import OsdSpeaker from "./OsdSpeaker";
import OsdMicrophone from "./OsdMicrophone";

export default function Osd(gdkmonitor: Gdk.Monitor) {
    const osdSpeaker = OsdSpeaker(gdkmonitor);
    const osdMicrophone = OsdMicrophone(gdkmonitor);

    return (
        <window>

        </window>
    );
}