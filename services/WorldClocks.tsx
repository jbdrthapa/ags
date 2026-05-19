import GLib from "gi://GLib"
import { createPoll } from "ags/time"

export function WorldClocks({ time_fmt = "%I:%M %p", date_fmt = "%a, %b %e" } = {}) {

    const checkTimer = 60 * 1000;

    const worldClocks =
        [
            "America/Los_Angeles",
            "Asia/Kathmandu",
            "America/New_York"
        ];

    const tzObjects = worldClocks.map(zone => GLib.TimeZone.new(zone));

    const times = tzObjects.map(tz => {
        return createPoll({ tz_time: "", tz_date: "", hours: "", minutes: "", name: "" }, checkTimer, () => {
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

    return times;
}