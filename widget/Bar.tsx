import app from "ags/gtk4/app"
import { Astal, Gdk } from "ags/gtk4"
import { Clock } from "./Clock"
import { Launcher } from "./Launcher"


export default function Bar(gdkmonitor: Gdk.Monitor) {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

  return (
    <window
      visible
      name="bar"
      class="Bar"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      layer={Astal.Layer.BACKGROUND}
      anchor={TOP | LEFT | RIGHT}
      application={app}
    >
      <centerbox cssName="bar">
        <box $type="start">
          <Launcher />
        </box>
        <box $type="center">
          <Clock />
        </box>
        <box $type="end">
        </box>
      </centerbox>
    </window>
  )
}
