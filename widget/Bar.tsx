import app from "ags/gtk4/app"
import { Astal, Gdk } from "ags/gtk4"
import { Clock } from "./Clock"
import { Launcher } from "./Launcher"
import { Menu } from "./Menu"


export default function Bar(gdkmonitor: Gdk.Monitor) {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

  const clock = new (Clock as any)();
  const launcher = new (Launcher as any)();
  const menu = new (Menu as any)();

  const backdropName = "bar-backdrop";
  const backdrop = (
    <window
      name={backdropName}
      namespace={backdropName}
      layer={Astal.Layer.BACKGROUND}
      visible={true}
      anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.LEFT | Astal.WindowAnchor.RIGHT}
      application={app}
      cssName={"invisible-backdrop-window"}
    >
      <button
        cssName="invisible-backdrop"
        onClicked={() => {
          clock.popup.hide_all();
          launcher.popup.hide_all();
          menu.popup.hide_all();
          console.log("bar invisible layer clicked")
        }}
      />
    </window>
  ) as Astal.Window;

  app.add_window(backdrop);

  return (
    <window
      visible
      name="bar"
      namespace={"js-shell-bar"}
      class="Bar"
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      layer={Astal.Layer.BACKGROUND}
      anchor={TOP | LEFT | RIGHT}
      application={app}
    >
      <centerbox cssName="bar">
        <box $type="start">
          {launcher}
        </box>
        <box $type="center">
          {clock}
        </box>
        <box $type="end">
          {menu}
        </box>
      </centerbox>
    </window>
  )
}
