import Gtk from "gi://Gtk?version=4.0";
import GLib from "gi://GLib";
import { execAsync } from "ags/process"
import Pango from "gi://Pango";

const WALLPAPER_DIR = `${GLib.get_home_dir()}/Pictures`;
const WALLPAPER_DIR_CACHE = `${WALLPAPER_DIR}/.cache/`;

const thumbToOriginal = new Map<string, string>();

function getOriginalFromThumb(thumbPath: string): string | undefined {
    return thumbToOriginal.get(thumbPath);
}

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

                thumbToOriginal.set(thumbnail_file, image_file);

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
        const image_file = getOriginalFromThumb(path);
        const btn = (
            <box orientation={Gtk.Orientation.VERTICAL} cssName="wallpaper-thumbnail">
                <image file={path} pixelSize={256} tooltipText={filename} />
                <label label={filename} tooltipText={filename} wrap={true} wrap_mode={Pango.WrapMode.WORD_CHAR} max_width_chars={20} valign={Gtk.Align.END} halign={Gtk.Align.FILL} yalign={1} />
            </box>
        ) as Gtk.Widget;

        flowbox.insert(btn, -1);

        const buttonGesture = new Gtk.GestureClick();
        btn.add_controller(buttonGesture);
        buttonGesture.connect("pressed", () => {
            execAsync(`awww img --transition-type random --transition-fps 120 --transition-duration 1 "${image_file}"`);
        });
    }

    return (
        <scrolledwindow
            hscrollbarPolicy={Gtk.PolicyType.NEVER}
            child={flowbox as any}
        />
    );
}
