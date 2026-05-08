import Gtk from "gi://Gtk?version=4.0";
import GLib from "gi://GLib";
import { execAsync } from "ags/process"
import Pango from "gi://Pango";

const WALLPAPER_DIR = `${GLib.get_home_dir()}/Pictures`;
const WALLPAPER_DIR_CACHE = `${WALLPAPER_DIR}/.cache/`;

function GetThumbnailFile(image_file: string) {
    const base_file_name = GLib.path_get_basename(image_file);
    const thumbnail_file = WALLPAPER_DIR_CACHE + base_file_name;
    const result = GLib.mkdir_with_parents(WALLPAPER_DIR_CACHE, 0o755);

    if (result !== 0) {
        console.log("Error occurred creating wallpaper thumbnail cache folder.")
    }

    if (!GLib.file_test(thumbnail_file, GLib.FileTest.EXISTS)) {
        console.log("Thumbnail not found: ", thumbnail_file)

        execAsync(`convert "${image_file}" -thumbnail 256x144 "${thumbnail_file}"`)
            .catch(err => printerr(err))

    }

    return thumbnail_file;
}

export function WallpaperSettings() {
    const flowbox = new Gtk.FlowBox({
        cssName: "wallpaper-container",
        min_children_per_line: 4,
        max_children_per_line: 4,
        column_spacing: 10,
        row_spacing: 10,
        selection_mode: Gtk.SelectionMode.NONE,
    });

    console.log("Wallpaper cache folder: ", WALLPAPER_DIR_CACHE);

    const files: string[] = [];
    try {
        const dir = GLib.Dir.open(WALLPAPER_DIR, 0);
        let name;
        while ((name = dir.read_name())) {
            if (name.match(/\.(jpg|jpeg|png|webp)$/i)) {
                const image_file = `${WALLPAPER_DIR}/${name}`;
                const thumbnail_file = GetThumbnailFile(image_file);
                files.push(thumbnail_file);
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
                heightRequest={200}
                valign={Gtk.Align.CENTER}
                halign={Gtk.Align.CENTER}
            >
                <box orientation={Gtk.Orientation.VERTICAL}>
                    <Gtk.Image
                        file={path}
                        pixelSize={256}
                        widthRequest={256}
                        heightRequest={160}
                        vexpand={true}
                        hexpand={true}
                    />
                    <label
                        label={filename}
                        tooltipText={filename}
                        wrap={true}
                        wrap_mode={Pango.WrapMode.WORD_CHAR}
                        max_width_chars={20}
                        valign={Gtk.Align.END}
                        halign={Gtk.Align.FILL}
                        yalign={1}
                    />
                </box>
            </button>
        ) as Gtk.Widget;

        flowbox.insert(btn, -1);
    }

    return (
        <scrolledwindow
            hscrollbarPolicy={Gtk.PolicyType.NEVER}
            child={flowbox as any}
        />
    );
}
