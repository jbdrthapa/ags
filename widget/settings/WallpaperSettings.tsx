import Gtk from "gi://Gtk?version=4.0";
import GLib from "gi://GLib";
import { execAsync } from "ags/process"
import Pango from "gi://Pango";

const WALLPAPER_DIR = `${GLib.get_home_dir()}/Pictures`;

export function WallpaperSettings() {
    const flowbox = new Gtk.FlowBox({
        cssName: "wallpaper-container",
        min_children_per_line: 4,
        max_children_per_line: 4,
        column_spacing: 10,
        row_spacing: 10,
        selection_mode: Gtk.SelectionMode.NONE,
    });

    const files: string[] = [];
    try {
        const dir = GLib.Dir.open(WALLPAPER_DIR, 0);
        let name;
        while ((name = dir.read_name())) {
            if (name.match(/\.(jpg|jpeg|png|webp)$/i)) {
                files.push(`${WALLPAPER_DIR}/${name}`);
            }
        }
        dir.close();
    }
    catch (e) {
        console.error("Dir error:", e);
    }

    for (let i = 0; i < files.length; i++) {
        const path = files[i];
        const filename = GLib.path_get_basename(path);
        const btn = (
            <button
                cssName={"wallpaper-thumbnail"}
                onClicked={() => execAsync(`awww img "${path}"`)}
            >
                <label
                    label={filename}
                    tooltipText={filename}
                    wrap={true}
                    wrap_mode={Pango.WrapMode.WORD_CHAR}
                    max_width_chars={20}
                    heightRequest={100}
                    xalign={2}
                    yalign={1}
                />
            </button>
        ) as Gtk.Widget;

        flowbox.insert(btn, -1);
    }

    return (
        <scrolledwindow
            heightRequest={400}
            widthRequest={600}
            hscrollbarPolicy={Gtk.PolicyType.NEVER}
            child={flowbox as any}
        />
    );
}
