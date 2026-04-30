import Gtk from "gi://Gtk?version=4.0"
import AstalBattery from "gi://AstalBattery"
import { createBinding } from "ags"

export function BatteryWidget() {

  const battery = AstalBattery.get_default()

  const percent = createBinding(
    battery,
    "percentage",
  )((p) => `${Math.floor(p * 100)}%`)

  const state = createBinding(battery, "state")

  const getIcon = (profile: string) => {
    // console.log(state.get())
    const status = state.get()
    switch(state.get()){
        case AstalBattery.State.CHARGING:
            return "󰂅"
        case AstalBattery.State.DISCHARGING:
            return "󱟟"
        case AstalBattery.State.EMPTY:
            return "󰂎"
        case AstalBattery.State.FULLY_CHARGED:
            return "󱟢"
        case AstalBattery.State.PENDING_CHARGE:
            return "󱈏"
        case AstalBattery.State.PENDING_DISCHARGE:
            return "󱈐"
        default:
            return "󱃍"
    }
  }

  function getTooltip() {
    console.log(state.get())
    const status = state.get()
    switch(state.get()){
        case AstalBattery.State.CHARGING:
            return `Charging: ${percent.get()}`
        case AstalBattery.State.DISCHARGING:
            return `Discharging: ${percent.get()}`
        case AstalBattery.State.EMPTY:
            return `Empty: ${percent.get()}`
        case AstalBattery.State.FULLY_CHARGED:
            return `Fully Charged: ${percent.get()}`
        case AstalBattery.State.PENDING_CHARGE:
            return `Pending Charge: ${percent.get()}`
        case AstalBattery.State.PENDING_DISCHARGE:
            return `Pending Discharge: ${percent.get()}`
        default:
            return `Unknown Status: ${percent.get()}`
    }
  }

  return (
    <button cssName="bar-module-button" tooltipText={getTooltip()}>
     <label label={getIcon()} />
    </button>
  )
}