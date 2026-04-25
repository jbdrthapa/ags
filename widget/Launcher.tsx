import Gtk from "gi://Gtk?version=4.0"
import Apps from "gi://AstalApps"
import PopupWindow from "./PopupWindow"
import { Astal } from "ags/gtk4"


// Define what a single app row looks like
function AppItem({ app }: { app: Apps.Application }) {
    return (
        <button
            cssName="app-item"
            onClicked={() => {
                app.launch() // Opens the app
            }}>
            <box>
                <box cssName="app-icon-wrapper">
                    <image iconName={app.iconName || "image-missing"} cssName="app-icon" />
                </box>
                <label label={app.name} cssName="app-name" />
            </box>
        </button>
    )
}

export function Launcher() {

    const apps = new Apps.Apps();

    const popup = new PopupWindow({
        name: "launcher-detail-window",
        namespace: "js-launcher-detail-window",
        anchor: Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT,
        margin: 8,
        child: (
            <box cssName="launcher-detail-container" orientation={Gtk.Orientation.VERTICAL}>
                <entry
                    placeholderText="Search..."
                // onChanged={({ text }) => {
                //     // Logic to filter app list based on input
                // }}
                />
                <scrolledwindow vexpand heightRequest={400}>
                    <box orientation={Gtk.Orientation.VERTICAL}>
                        {apps.get_list().map((app: Apps.Application) => (
                            <AppItem app={app} />
                        ))}
                    </box>
                </scrolledwindow>
            </box>
        )
    });


    return (
        <button onClicked={() => popup.toggle()} cssName={"bar-launcher-component"}>
            <box orientation={Gtk.Orientation.HORIZONTAL}>
                <button label={""} cssName={"launcher-button"} />
            </box>
        </button>
    );


}
