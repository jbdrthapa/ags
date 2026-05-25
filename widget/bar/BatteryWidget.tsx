import { Gtk } from "ags/gtk4"
import AstalBattery from "gi://AstalBattery"
import { createBinding } from "ags"

export function BatteryWidget() {

    const battery = AstalBattery.get_default()

    const percent = createBinding(battery, "percentage",)((p) => `${Math.floor(p * 100)}%`)

    const percentBinding = createBinding(battery, "percentage",)

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
        <box orientation={Gtk.Orientation.VERTICAL}>
            <levelbar
                widthRequest={75}
                heightRequest={20}
                cssName={"battery-bar"}
                value={percentBinding.as(v => v)}
                valign={Gtk.Align.CENTER}
                hexpand={false}
                tooltipText={batteryTooltip}
            />
            <label label={timeToEmpty} cssName={"battery-percent"}/>
        </box>

    )
}