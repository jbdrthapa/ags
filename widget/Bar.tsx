import app from "ags/gtk4/app"
import Gtk from "gi://Gtk?version=4.0"
import { Astal, Gdk } from "ags/gtk4"
import { ModulesCenter } from "./modules-center/ModulesCenter"
import { ModulesLeft } from "./modules-left/ModulesLeft"
import { WorkspaceWidget } from "./bar/WorkspaceWidget"
import { ModulesRight } from "./modules-right/ModulesRight"
import { TrayWidget } from "./bar/TrayWidget"
import { PowerProfileWidget } from "./bar/PowerProfileWidget"
import { BatteryWidget } from "./bar/BatteryWidget"


export default function Bar(gdkmonitor: Gdk.Monitor) {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

  const modulesCenter = new (ModulesCenter as any)();
  
  const modulesLeft = new (ModulesLeft as any)();
  const workspaceWidget = WorkspaceWidget();

  const modulesRight = new (ModulesRight as any)();
  const trayWidget = TrayWidget();
  const powerProfileWidget = PowerProfileWidget();
  const batteryWidget = BatteryWidget();
  
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

          modulesCenter.popup.hide_all();
          modulesLeft.popup.hide_all();
          modulesRight.popup.hide_all();

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
      layer={Astal.Layer.TOP}
      anchor={TOP | LEFT | RIGHT}
      application={app}
    >
      <centerbox cssName="bar">
        <box $type="start">
          {modulesLeft}
          {workspaceWidget}
        </box>
        <box $type="center">
          {modulesCenter}
        </box>
        <box $type="end">
          <box orientation={Gtk.Orientation.HORIZONTAL}>
            {trayWidget}
            {powerProfileWidget}
            {batteryWidget}
            {modulesRight}
          </box>
        </box>
      </centerbox>
    </window>
  )
}
