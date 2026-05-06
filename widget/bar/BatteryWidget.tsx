import AstalBattery from "gi://AstalBattery"
import { createBinding } from "ags"

export function BatteryWidget() {

    const battery = AstalBattery.get_default()

    const percent = createBinding(battery, "percentage",)((p) => `${Math.floor(p * 100)}%`)

    const timeToEmpty = createBinding(battery, "time_to_empty",)((t) => {
        if (t === -1) {
            return "Calculating..."
        }
        const hours = Math.floor(t / 3600)
        const minutes = Math.floor((t % 3600) / 60)
        return `${hours}h ${minutes}m`
    })

    const timeToFull = createBinding(battery, "time_to_full",)((t) => {
        if (t === -1) {
            return "Calculating..."
        }
        const hours = Math.floor(t / 3600)
        const minutes = Math.floor((t % 3600) / 60)
        return `${hours}h ${minutes}m`
    })

    const energyRate = createBinding(battery, "energyRate",)((w) => `${Math.floor(w)}W`);

    const batteryBorderClass = createBinding(battery, "state")((s): string[] => {
        switch (s) {
            case AstalBattery.State.CHARGING:
                return ["battery-launcher-background-charging"]
            case AstalBattery.State.DISCHARGING:
                return ["battery-launcher-background-discharging"]
            case AstalBattery.State.EMPTY:
                return ["battery-launcher-background-empty"]
            case AstalBattery.State.FULLY_CHARGED:
                return ["battery-launcher-background-full"]
            case AstalBattery.State.PENDING_CHARGE:
                return ["battery-launcher-background-pending-charge"]
            case AstalBattery.State.PENDING_DISCHARGE:
                return ["battery-launcher-background-pending-discharge"]
            default:
                return ["battery-launcher-background-unknown"]
        }
    })


    const batteryClass = createBinding(battery, "state")((s): string[] => {
        switch (s) {
            case AstalBattery.State.CHARGING:
                return ["battery-charging"]
            case AstalBattery.State.DISCHARGING:
                return ["battery-discharging"]
            case AstalBattery.State.EMPTY:
                return ["battery-empty"]
            case AstalBattery.State.FULLY_CHARGED:
                return ["battery-full"]
            case AstalBattery.State.PENDING_CHARGE:
                return ["battery-pending-charge"]
            case AstalBattery.State.PENDING_DISCHARGE:
                return ["battery-pending-discharge"]
            default:
                return ["battery-unknown"]
        }
    })

    const stateIcon = createBinding(battery, "state",)((s) => {
        switch (s) {
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
    })

    const batteryTooltip = createBinding(battery, "state",)((s) => {
        let tooltip = "";
        let battery_state = ""

        switch (s) {
            case AstalBattery.State.CHARGING:
                battery_state = "Charging"
                break
            case AstalBattery.State.DISCHARGING:
                battery_state = "Discharging"
                break
            case AstalBattery.State.EMPTY:
                battery_state = "Empty"
                break
            case AstalBattery.State.FULLY_CHARGED:
                battery_state = "Fully Charged"
                break
            case AstalBattery.State.PENDING_CHARGE:
                battery_state = "Pending Charge"
                break
            case AstalBattery.State.PENDING_DISCHARGE:
                battery_state = "Pending Discharge"
                break
            default:
                battery_state = "Unknown Status"
        }

        tooltip = `State : ${battery_state} \nPercentage: ${percent.peek()} \nTime to Empty: ${timeToEmpty.peek()} \nTime to Full: ${timeToFull.peek()}\nEnergy Rate: ${energyRate.peek()}`

        return tooltip;

    })

    return (
        <box cssClasses={batteryBorderClass}>
            <button cssName="bar-module-button" tooltipText={batteryTooltip}>
                <label label={stateIcon} cssClasses={batteryClass} />
            </button>
        </box>
    )
}