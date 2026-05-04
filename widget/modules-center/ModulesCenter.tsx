import Gtk from "gi://Gtk?version=4.0"
import GLib from "gi://GLib"
import PopupWindow from "../PopupWindow"
import { Astal } from "ags/gtk4"
import { WorldClocks } from "../../services/WorldClocks"
import { ClockWidget } from "./ClockWidget"
import { CalendarWidget } from "./CalendarWidget"
import { WindowName } from "../../constants"

const windowName = WindowName.modulesCenter;

let popup: any;

export function ModulesCenter() {

    const times = WorldClocks();
    const clockWidget = ClockWidget();
    const calendarWidget = CalendarWidget();

    const button = (
        <button onClicked={() => popup.toggle()} cssName={"bar-datetime-component"}>
            <box orientation={Gtk.Orientation.HORIZONTAL}>
                <label label={times[0].as(t => t.tz_time)} cssName={"bar-time"} />
                <label label="" cssName={"bar-separator"} />
                <label label={times[0].as(t => t.tz_date)} cssName={"bar-date"} />
            </box>
        </button>
    ) as any;

    popup = new PopupWindow({
        name: windowName,
        namespace: windowName,
        anchor: Astal.WindowAnchor.TOP,
        margin: 8,
        child: (
            <box cssName="modules-center-container" orientation={Gtk.Orientation.VERTICAL}>
                {clockWidget}
                {calendarWidget}
            </box>
        )
    });

    // Reset the calendar when the popup is made visible

    popup.connect("notify::visible", () => {
        if (popup.visible) {
            calendarWidget.set_date(GLib.DateTime.new_now_local());
        }
    });

    button.popup = popup;

    return button;

}
