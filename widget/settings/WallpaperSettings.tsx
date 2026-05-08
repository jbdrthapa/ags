import Gtk from "gi://Gtk?version=4.0";
import GLib from "gi://GLib";
import { exec, execAsync } from "ags/process"

const WALLPAPER_DIR = `${GLib.get_home_dir()}/Pictures`;

export function WallpaperSettings() {
    const files: string[] = [];
    try {
        const dir = GLib.Dir.open(WALLPAPER_DIR, 0);
        let name;
        while ((name = dir.read_name())) {
            if (name.match(/\.(jpg|jpeg|png|webp)$/i)) files.push(name);
        }
        dir.close();
    } catch (e) {
        console.error("Directory error:", e);
    }

    // This function replaces the "setup" prop logic
    const startLoading = (self: Gtk.FlowBox) => {
        let index = 0;
        const addNext = () => {
            if (index >= files.length) return false;

            const file = files[index];
            const fullPath = `file://${WALLPAPER_DIR}/${file}`;

            const btn = (
                <button 
                    onClicked={() => execAsync(`awww img "${WALLPAPER_DIR}/${file}"`)}
                    cssClasses={["wallpaper-card"]}
                >
                    <box css={`
                        background-image: url("${fullPath}");
                        background-size: cover;
                        background-position: center;
                        min-width: 120px;
                        min-height: 80px;
                        border-radius: 8px;
                    `} />
                </button>
            );

            self.insert(btn, -1);
            index++;
            return true; 
        };
        GLib.idle_add(GLib.PRIORITY_DEFAULT_IDLE, addNext);
    };

    return (
        <scrolledwindow
            heightRequest={400}
            widthRequest={600}
            hscrollbarPolicy={Gtk.PolicyType.NEVER}
        >
            <Gtk.FlowBox
                minChildrenPerLine={4}
                maxChildrenPerLine={4}
                columnSpacing={10}
                rowSpacing={10}
                selectionMode={Gtk.SelectionMode.NONE}
                // Use a direct constructor call or the 'onRealize' hook
                onRealize={(self) => startLoading(self as Gtk.FlowBox)}
            />
        </scrolledwindow>
    );
}
