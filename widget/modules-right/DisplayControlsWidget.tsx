import Gtk from "gi://Gtk?version=4.0";
import { For, createBinding } from "gnim";
import DisplayService from "../../services/DisplayService";

export function DisplayControlsWidget() {

    const brightnessIcon = ""
    const displayText = "Display"
    const displayService = DisplayService.get_default();

    return (
        <box orientation={Gtk.Orientation.HORIZONTAL} cssName="display-controls-container">
            <image
                pixelSize={28}
                iconName={brightnessIcon} cssName={"audio-icon"} />
            <label valign={Gtk.Align.CENTER} label={displayText} cssName={"audio-percent"} />
            <slider
                cssClasses={["slider-control"]}
                tooltipText={displayText}
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