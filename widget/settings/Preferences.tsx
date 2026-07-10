import Gtk from "gi://Gtk?version=4.0";
import app from "ags/gtk4/app"
import Config from "../../conf/Config";

export function Preferences() {

    const UNIT_OPTIONS = [
        { display: "Imperial", value: "imperial" },
        { display: "Metric", value: "metric" }
    ];
    const unitModel = Gtk.StringList.new(UNIT_OPTIONS.map(opt => opt.display));

    function onUnitSelected(widget: Gtk.DropDown) {
        const activeIndex = widget.get_selected();
        const selectedValue = UNIT_OPTIONS[activeIndex].value;

        Config.SetMeasurementUnits(selectedValue);
    }

    return (
        <box orientation={Gtk.Orientation.VERTICAL} spacing={10}>

            <label label="Preferences" halign={Gtk.Align.START} cssName="section-heading" />

            <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>

                <box spacing={10} orientation={Gtk.Orientation.VERTICAL} cssName="section-background">
                    <label label={"Units"} halign={Gtk.Align.START} hexpand={false} />
                    <Gtk.DropDown
                        model={unitModel}
                        selected={0}
                        onNotifySelected={onUnitSelected}
                        hexpand={false}
                        widthRequest={200}
                        halign={Gtk.Align.START}
                    />
                </box>
                <box spacing={10} orientation={Gtk.Orientation.VERTICAL} cssName="section-background">

                </box>
            </box>
        </box>
    );
}



