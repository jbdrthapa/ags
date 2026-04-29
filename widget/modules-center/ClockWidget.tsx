import Gtk from "gi://Gtk?version=4.0"
import { WorldClocks } from "../../services/WorldClocks";

export function ClockWidget({ time_fmt = "%H:%M", date_fmt = "%a, %b %e" } = {}) {

    const worldClocks = WorldClocks({ time_fmt, date_fmt });

    return (

        <box orientation={Gtk.Orientation.HORIZONTAL} cssName="time-container">
            <box orientation={Gtk.Orientation.VERTICAL}>
                <label cssName="local-clock-hours" label={worldClocks[0].as(t => t.hours)} />
                <label cssName="local-clock-minutes" label={worldClocks[0].as(t => t.minutes)} />
            </box>
            <box cssName="world-clock-panel">
                <box orientation={Gtk.Orientation.VERTICAL}>
                    {worldClocks.map((worldClock) => (
                        <box orientation={Gtk.Orientation.HORIZONTAL}>
                            <label xalign={0} cssName="world-clock-name" label={worldClock.as(t => t.name)} />
                            <label xalign={0} cssName="world-clock-time" label={worldClock.as(t => t.tz_time)} />
                            <label xalign={0} cssName="world-clock-time" label={worldClock.as(t => t.tz_date)} />
                        </box>
                    ))}
                </box>
            </box>
        </box>
    );
}