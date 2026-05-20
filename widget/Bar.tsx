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
import { WindowName } from "../constants";
// import { CavaWidget } from "./bar/CavaWidget"

let modulesLeft: any;
let modulesCenter: any;
let modulesRight: any;

const windowName = WindowName.bar;

function CloseAllMenus() {
  modulesCenter.popup.hide_all();
  modulesLeft.popup.hide_all();
  modulesRight.popup.hide_all();
}

export default function Bar(gdkmonitor: Gdk.Monitor) {
  const { TOP, LEFT, RIGHT } = Astal.WindowAnchor

  modulesLeft = new (ModulesLeft as any)();
  modulesCenter = new (ModulesCenter as any)();
  modulesRight = new (ModulesRight as any)();

  const workspaceWidget = WorkspaceWidget();
  const trayWidget = TrayWidget();
  const powerProfileWidget = PowerProfileWidget();
  const batteryWidget = BatteryWidget();
  // const cavaWidget = CavaWidget();

  const backdrop = (
    <window
      name={windowName}
      namespace={windowName}
      layer={Astal.Layer.BACKGROUND}
      visible={true}
      anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.LEFT | Astal.WindowAnchor.RIGHT}
      application={app}
      cssName={"invisible-backdrop-window"}
    >
      <button
        cssName="invisible-backdrop"
        onClicked={() => {
          CloseAllMenus();
        }}
      />
    </window>
  ) as Astal.Window;

  const barWindow = (

    <window
      visible
      name={windowName}
      namespace={windowName}
      class={windowName}
      gdkmonitor={gdkmonitor}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      layer={Astal.Layer.TOP}
      anchor={TOP | LEFT | RIGHT}
      application={app}
    >
      <centerbox cssName="bar">
        <box $type="start" spacing={10}>
          {modulesLeft}
          {workspaceWidget}
        </box>
        <box $type="center">
          {modulesCenter}
        </box>
        <box $type="end">
          <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>
            {/*{cavaWidget}*/}
            {trayWidget}
            {powerProfileWidget}
            {batteryWidget}
            {modulesRight}
          </box>
        </box>
      </centerbox>
    </window>

  ) as Astal.Window;

  const gesture = new Gtk.GestureClick();
  gesture.connect("pressed", () => {
    hide_others();
  });

  barWindow.add_controller(gesture);

  function hide_others() {
    app.get_windows().forEach(window => {
      if (window !== barWindow && window.name !== "bar-background") {
        window.hide()
      }
    });
  }

  console.debug("Bar rendered, registering backdrop and popups...");

  app.add_window(backdrop);
  app.add_window(modulesLeft.popup);
  app.add_window(modulesCenter.popup);
  app.add_window(modulesRight.popup);

  console.debug("Current windows in app:");
  app.windows.forEach(win => console.log(win.name));

  return barWindow;

}
