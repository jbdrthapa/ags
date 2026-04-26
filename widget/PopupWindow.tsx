import Gtk from "gi://Gtk?version=4.0";
import Gdk from "gi://Gdk?version=4.0";
import { Astal } from "ags/gtk4";
import App from "ags/gtk4/app"
import GObject from "gnim/gobject";
import { subprocess } from "ags/process";

// Explicitly register the class using GObject
export default GObject.registerClass({
    GTypeName: "PopupWindow",
}, class PopupWindow extends Astal.Window {

    constructor(props: any & { child: Gtk.Widget }) {
        const { name, child, ...rest } = props;

        super({
            ...rest,
            name,
            layer: Astal.Layer.OVERLAY,
            visible: false,
            keymode: Astal.Keymode.ON_DEMAND,
        });

        this.name = "PopupWindow";

        // Add the child after super to ensure the window is initialized
        this.set_child(child);

        subprocess(
            ["bash", "-c", "niri msg --json event-stream"],
            (output) => {
                try {
                    const event = JSON.parse(output);
                    if (event.OverviewOpenedOrClosed && event.OverviewOpenedOrClosed.is_open) {
                        console.log("Niri overview toggled, closing the PopupWindow")
                        this.hide_all();
                    }
                } catch (e) {
                    // JSON parsing might fail on partial lines, safe to ignore
                }
            },
            (err) => console.error("Niri IPC Error:", err)
        );

        const controller = new Gtk.EventControllerKey();
        controller.connect("key-pressed", (_, keyval) => {
            if (keyval === Gdk.KEY_Escape) {
                this.hide_all();
                return true;
            }
            return false;
        });
        this.add_controller(controller);
    }

    hide_all() {
        this.set_visible(false);
    }

    toggle() {
        const isShowing = this.get_visible();
        this.set_visible(!isShowing);
    }
});