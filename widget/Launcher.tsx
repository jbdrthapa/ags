import Gtk from "gi://Gtk?version=4.0"
import Apps from "gi://AstalApps"
import PopupWindow from "./PopupWindow"
import { Astal } from "ags/gtk4"

let popup: any;

function AppItem({ app }: { app: Apps.Application }) {
    return (
        <button
            cssName="app-item"
            onClicked={() => {
                popup.hide_all();
                app.launch();
            }}
        >
            <box>
                <box cssName="app-icon-wrapper">
                    <image iconName={app.icon_name || "image-missing"} cssName="app-icon" />
                </box>
                <label label={app.name} cssName="app-name" />
            </box>
        </button>
    );
}

export function Launcher() {

    const apps = new Apps.Apps();

    let listRoot = new Gtk.Box();
    listRoot.orientation = Gtk.Orientation.VERTICAL;

    const searchEntry = (
        <entry
            placeholderText=""
            cssName={"search-entry"}
            onNotifyText={(self) => {
                console.log(self.text);
            }}
        />
    ) as any;

    const appsListing = (
        <box orientation={Gtk.Orientation.VERTICAL}>
            {apps.get_list().map((app: Apps.Application) => (
                <AppItem app={app} />
            ))}
        </box >
    )

    popup = new PopupWindow({
        name: "launcher-detail-window",
        namespace: "js-launcher-detail-window",
        anchor: Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT,
        margin: 8,
        child: (
            <box cssName="launcher-detail-container" orientation={Gtk.Orientation.VERTICAL}>
                {searchEntry}
                <scrolledwindow vexpand heightRequest={400}>
                    {appsListing}
                </scrolledwindow>
            </box>
        )
    });

    // reset on visible
    popup.connect("notify::visible", () => {
        if (popup.visible) {
            console.log("Launcher window is opened");
            searchEntry.text = "";
            searchEntry.grab_focus();
        }
        else {
            console.log("Launcher window is closed");
        }
    });

    return (
        <button onClicked={() => popup.toggle()} cssName={"bar-launcher-component"}>
            <box orientation={Gtk.Orientation.HORIZONTAL}>
                <button label={""} cssName={"launcher-button"} />
            </box>
        </button>
    );


}
