import Gtk from "gi://Gtk?version=4.0";
import Gdk from "gi://Gdk?version=4.0";
import { Astal } from "ags/gtk4";
import AstalNiri from "gi://AstalNiri"
import GObject from "gnim/gobject";

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

        this.set_child(child);

        const controller = new Gtk.EventControllerKey();
        controller.connect("key-pressed", (_, keyval) => {
            if (keyval === Gdk.KEY_Escape) {
                this.hide_all();
                return true;
            }
            return false;
        });
        this.add_controller(controller);

        // Use the niri's window focus behavior to close the window
        const niri = AstalNiri.get_default()
        niri.connect("notify::focused-window", (service) => {
            const focused = service.focused_window

            if (focused?.title) {
                this.hide_all();
            }
        })

        // Use the niri's overview behavior to close the window
        niri.connect("overview-opened-or-closed", (service) => {
            this.hide_all();
        })
    }

    hide_all() {
        this.set_visible(false);
    }

    toggle() {
        const isShowing = this.get_visible();
        this.set_visible(!isShowing);
    }
});