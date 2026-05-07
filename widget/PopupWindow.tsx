import Gtk from "gi://Gtk?version=4.0";
import Gdk from "gi://Gdk?version=4.0";
import { Astal } from "ags/gtk4";
import AstalNiri from "gi://AstalNiri";
import GObject from "gnim/gobject";

export default GObject.registerClass({
    GTypeName: "PopupWindow",
}, class PopupWindow extends Astal.Window {
    // Keep a reference to the revealer to toggle it
    private revealer: Gtk.Revealer;

    constructor(props: any & { child: Gtk.Widget }) {
        const { name, child, ...rest } = props;

        const revealer = new Gtk.Revealer({
            child: child,
            transition_type: Gtk.RevealerTransitionType.FADE_SLIDE_DOWN,
            transition_duration: 200,
            reveal_child: false,
        });

        super({
            ...rest,
            name,
            layer: Astal.Layer.OVERLAY,
            visible: false,
            keymode: Astal.Keymode.ON_DEMAND,
        });

        this.revealer = revealer;
        this.set_child(revealer);

        const controller = new Gtk.EventControllerKey();
        controller.connect("key-pressed", (_, keyval) => {
            if (keyval === Gdk.KEY_Escape) {
                this.hide_all();
                return true;
            }
            return false;
        });
        this.add_controller(controller);

        // Niri focus behavior
        const niri = AstalNiri.get_default();
        niri.connect("notify::focused-window", (service) => {
            if (service.focused_window?.title) {
                this.hide_all();
            }
        });

        niri.connect("overview-opened-or-closed", () => {
            this.hide_all();
        });
    }

    hide_all() {
        this.revealer.reveal_child = false;

        setTimeout(() => {
            if (!this.revealer.reveal_child) {
                this.set_visible(false);
            }
        }, 200);
    }

    toggle() {
        if (this.get_visible() && this.revealer.reveal_child) {
            this.hide_all();
        } else {
            this.set_visible(true);
            setTimeout(() => {
                this.revealer.reveal_child = true;
            }, 10);
        }
    }
});
