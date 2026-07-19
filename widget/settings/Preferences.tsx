import Gtk from "gi://Gtk?version=4.0";
import app from "ags/gtk4/app"
import Config from "../../conf/Config";

export function Preferences() {

    // Units 
    const UNIT_OPTIONS = [
        { display: "Imperial", value: "imperial" },
        { display: "Metric", value: "metric" }
    ];

    const unitModel = Gtk.StringList.new(UNIT_OPTIONS.map(opt => opt.display));
    
    const unitsDropDown = new Gtk.DropDown({
        model: unitModel,
        selected: 0,
        hexpand: false,
        width_request: 200,
        halign: Gtk.Align.START
    });
    unitsDropDown.connect('notify::selected', (dropDown) => {
        const activeIndex = dropDown.get_selected();
        const selectedValue = UNIT_OPTIONS[activeIndex].value;

        Config.SetMeasurementUnits(selectedValue);
    });

    function loadUnits() {
        const units = Config.GetMeasurementUnits();
        const targetIndex = UNIT_OPTIONS.findIndex(option => option.value === units);

        if (targetIndex == -1) {
            console.log("Unable to load correct value for units.")
            return;
        }

        unitsDropDown.selected = targetIndex;
    }

    function loadPreferences() {
        loadUnits();
    }

    loadPreferences();

    return (
        <box orientation={Gtk.Orientation.VERTICAL} spacing={10}>

            <label label="Preferences" halign={Gtk.Align.START} cssName="section-heading" />

            <box orientation={Gtk.Orientation.HORIZONTAL} spacing={10}>

                <box spacing={10} orientation={Gtk.Orientation.VERTICAL} cssName="section-background">
                    <label label={"Units"} halign={Gtk.Align.START} hexpand={false} />
                    {unitsDropDown}
                </box>
                <box spacing={10} orientation={Gtk.Orientation.VERTICAL} cssName="section-background">

                </box>
            </box>
        </box>
    );
}



