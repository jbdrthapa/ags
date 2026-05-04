
import Gtk from "gi://Gtk?version=4.0"
import Apps from "gi://AstalApps"
import PopupWindow from "../PopupWindow"
import { Astal, Gdk } from "ags/gtk4"
import { For, createState } from "ags";
import { subprocess } from "ags/process";
import { WindowName } from "../../constants"

const windowName = WindowName.modulesLeft;

const terminal = "kitty";
let appListingWindow: any;

function launch(app?: Apps.Application) {
    if (app) {
        appListingWindow.hide()

        // Check if the .desktop file has Terminal=true
        const needsTerminal = app.app.get_boolean("Terminal");

        const launchCmd = needsTerminal
            ? `${terminal} -e ${app.executable}`
            : app.executable;
        if (needsTerminal) {
            subprocess(["bash", "-c", `${launchCmd} >/dev/null 2>&1 &`]);
        }
        else {
            app.launch()
        }
    }
}

function AppItem({ app }: { app: Apps.Application }) {

    return (
        <button
            cssName="app-item"
            onClicked={() => {
                appListingWindow.hide_all();
                launch(app);
            }}>
            <box>
                <box cssName="app-icon-wrapper">
                    <image iconName={app.icon_name || "image-missing"} cssName="app-icon" />
                </box>
                <label label={app.name} cssName="app-name" />
            </box>
        </button>
    );
}



export function AppListing() {
    let searchentry: Gtk.Entry
    let appsScroll: Gtk.ScrolledWindow
    let win: Astal.Window

    const apps = new Apps.Apps();
    const initialResults = apps.fuzzy_query("")
    const [list, setList] = createState(initialResults)

    function search(text: string) {
        const results = text === "" ? apps.fuzzy_query("") : apps.fuzzy_query(text)
        setList(results)
    }


    // handle key events for the entire window
    function onKey(
        _e: Gtk.EventControllerKey,
        keyval: number,
        _: number,
        mod: number,
    ) {
        console.log("Key pressed", Gdk.keyval_name(keyval), "with modifier", mod);
        if (keyval === Gdk.KEY_Escape) {
            appListingWindow.visible = false
            return true
        }

        if (keyval === Gdk.KEY_Return || keyval === Gdk.KEY_KP_Enter) {
            launch(list.peek()[0])
            return true
        }

        if (mod === Gdk.ModifierType.ALT_MASK) {
            for (const i of [1, 2, 3, 4, 5, 6, 7, 8, 9] as const) {
                if (keyval === Gdk[`KEY_${i}`]) {
                    launch(list.peek()[i - 1])
                    return true
                }
            }
        }

        return false
    }

    let listRoot = new Gtk.Box();
    listRoot.orientation = Gtk.Orientation.VERTICAL;

    const searchEntry = (
        <entry
            cssName={"search-entry"}
            $={(ref) => (searchentry = ref)}
            onNotifyText={({ text }) => search(text)}
            onActivate={() => launch(list.peek()[0])}
            placeholderText=">"
        />
    ) as any;

    const appsListing = (

        <box orientation={Gtk.Orientation.VERTICAL} vexpand>
            <For each={list}>
                {(app, index) => (
                    <AppItem app={app} />
                )}
            </For>
        </box>
    )


    appListingWindow = new PopupWindow({
        name: windowName,
        namespace: windowName,
        anchor: Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT,
        margin: 8,
        child: (
            <box cssName="modules-left-container" orientation={Gtk.Orientation.VERTICAL}>
                {searchEntry}
                <scrolledwindow vexpand heightRequest={400} $={(ref) => (appsScroll = ref)}>
                    {appsListing}
                </scrolledwindow>
            </box>
        )
    });

    // subscribe to key events for the entire window
    const keyController = new Gtk.EventControllerKey();
    keyController.connect("key-pressed", onKey);
    appListingWindow.add_controller(keyController);

    // connect to visibility changes
    appListingWindow.connect("notify::visible", () => {
        if (appListingWindow.visible) {

            // console.log("Launcher window is opened");

            // reset search and focus
            searchEntry.text = "";
            searchEntry.grab_focus();

            // scroll to top
            if (appsScroll) {
                const vadjustment = appsScroll.get_vadjustment()
                vadjustment.set_value(vadjustment.get_lower())
            }
        }
        else {

            // console.log("Launcher window is closed");
        }
    });

    return appListingWindow;
}
