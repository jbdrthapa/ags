import Gtk from "gi://Gtk?version=4.0"
import AstalTray from "gi://AstalTray"
import { For,createBinding } from "ags"

export function TrayWidget() {
  const tray = AstalTray.get_default()
  const items = createBinding(tray, "items")

  const init = (btn: Gtk.MenuButton, item: AstalTray.TrayItem) => {
    btn.menuModel = item.menuModel
    btn.insert_action_group("dbusmenu", item.actionGroup)
    item.connect("notify::action-group", () => {
      btn.insert_action_group("dbusmenu", item.actionGroup)
    })
  }

  return (
    <box cssName="tray-container">
      <For each={items}>
        {(item) => (
          <menubutton  $={(self) => init(self, item)} cssName="tray-module-button">
            <image gicon={createBinding(item, "gicon")}  cssName="tray-module-button-image"/>
          </menubutton>
        )}
      </For>
    </box>
  ) 
}