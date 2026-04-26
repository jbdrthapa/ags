import Gtk from "gi://Gtk?version=4.0"
import GLib from "gi://GLib"
import PopupWindow from "./PopupWindow"
import { createPoll } from "ags/time"
import { Astal } from "ags/gtk4"

let popup: any;

export function Clock({ time_fmt = "%H:%M", date_fmt = "%a, %b %e" } = {}) {

    const worldClocks =
        [
            "America/Los_Angeles",
            "Asia/Kathmandu",
            "America/New_York"
        ];


    const tzObjects = worldClocks.map(zone => GLib.TimeZone.new(zone));

    const times = tzObjects.map(tz => {
        return createPoll({ tz_time: "", tz_date: "", hours: "", minutes: "", name: "" }, 1000, () => {
            const now = GLib.DateTime.new_now(tz);
            return {
                tz_time: now.format(time_fmt) || "",
                tz_date: now.format(date_fmt) || "",
                hours: now.format("%H") || "",
                minutes: now.format("%M") || "",
                name: now.get_timezone_abbreviation() || ""
            };
        });
    });

    // Declare the calendar control to be used
    const calendar = new Gtk.Calendar({
        css_name: "detail-calendar",
    });

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
        name: "clock-detail-window",
        namespace: "js-clock-detail-window",
        anchor: Astal.WindowAnchor.TOP,
        margin: 8,
        child: (
            <box cssName="clock-detail-container" orientation={Gtk.Orientation.VERTICAL}>
                <box orientation={Gtk.Orientation.HORIZONTAL} cssName="time-container">
                    <box orientation={Gtk.Orientation.VERTICAL}>
                        <label cssName="local-clock-hours" label={times[0].as(t => t.hours)} />
                        <label cssName="local-clock-minutes" label={times[0].as(t => t.minutes)} />
                    </box>
                    <box cssName="world-clock-panel">
                        <box orientation={Gtk.Orientation.VERTICAL}>
                            {times.map((time) => (
                                <box orientation={Gtk.Orientation.HORIZONTAL}>
                                    <label xalign={0} cssName="world-clock-name" label={time.as(t => t.name)} />
                                    <label xalign={0} cssName="world-clock-time" label={time.as(t => t.tz_time)} />
                                    <label xalign={0} cssName="world-clock-time" label={time.as(t => t.tz_date)} />
                                </box>
                            ))}
                        </box>
                    </box>
                </box>
                {calendar}
            </box>
        )
    });

    // Reset the calendar when the popup is made visible

    popup.connect("notify::visible", () => {
        if (popup.visible) {
            calendar.set_date(GLib.DateTime.new_now_local());
        }
    });

    button.popup = popup;

    return button;

}
