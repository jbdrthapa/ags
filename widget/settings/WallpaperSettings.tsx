import Gtk from "gi://Gtk?version=4.0";
import GLib from "gi://GLib";
import { exec, execAsync } from "ags/process"

const WALLPAPER_DIR = `${GLib.get_home_dir()}/Pictures`;

export function WallpaperSettings() {
    const flowbox = new Gtk.FlowBox({
        min_children_per_line: 4,
        max_children_per_line: 4,
        column_spacing: 10,
        row_spacing: 10,
        selection_mode: Gtk.SelectionMode.NONE,
    });

    const loadWallpapers = () => {
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
        } catch (e) {
            console.error("Dir error:", e);
        }

        let i = 0;
        const addBatch = () => {
            for (let j = 0; j < 5 && i < files.length; j++, i++) {
                const path = files[i];
                const btn = (
                    <button
                        onClicked={() => execAsync(`awww img "${path}"`)}
                    >
                        <box css={`
                            background-image: url('file://${path}'); 
                            background-size: cover;
                            min-width: 120px;
                            min-height: 80px;
                        `} />
                    </button>
                ) as Gtk.Widget;

                flowbox.insert(btn, -1);
            }
            return i < files.length ? GLib.SOURCE_CONTINUE : GLib.SOURCE_REMOVE;
        };

        GLib.idle_add(GLib.PRIORITY_DEFAULT_IDLE, addBatch);
    };

    // Use idle_add to trigger the load AFTER the window is painted
    GLib.idle_add(GLib.PRIORITY_DEFAULT, () => {
        loadWallpapers();
        return GLib.SOURCE_REMOVE;
    });

    return (
        <scrolledwindow
            heightRequest={400}
            widthRequest={600}
            hscrollbarPolicy={Gtk.PolicyType.NEVER}
            child={flowbox as any}
        />
    );
}
