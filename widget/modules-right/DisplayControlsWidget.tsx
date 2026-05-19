import Gtk from "gi://Gtk?version=4.0";
import { For, createBinding } from "gnim";
import DisplayService from "../../services/DisplayService";

export function DisplayControlsWidget() {

    const displayService = DisplayService.get_default();

    return (
        <box orientation={Gtk.Orientation.HORIZONTAL} cssName="display-controls-container">
            <label label={createBinding(displayService, "brightness_icon")} cssName={"brightness-icon"} />
            <label valign={Gtk.Align.CENTER} label={createBinding(displayService, "brightness_percent").as((value) => String(value))} cssName={"brightness-percent"} />
            <slider
                cssClasses={["slider-control"]}
                tooltipText={createBinding(displayService, "brightness_percent").as((value) => String(value))}
                widthRequest={280}
                heightRequest={40}
                min={0}
                max={100}
                value={createBinding(displayService, "brightness_percent")}
                onValueChanged={({ value }) => {
                    displayService.setBrightnessValue(value);
                }}
            />
        </box>
    );
}