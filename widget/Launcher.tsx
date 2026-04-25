import Gtk from "gi://Gtk?version=4.0"
import Apps from "gi://AstalApps"
import PopupWindow from "./PopupWindow"
import { Astal } from "ags/gtk4"


function AppItem({ app }: { app: Apps.Application }) {
    return (
        <button
            cssName="app-item"
            onClicked={() => app.launch()}
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

const fuzzyMatch = (text: string, search: string) => {
    const term = search.toLowerCase();
    const target = text.toLowerCase();
    let i = 0;
    for (const char of target) {
        if (char === term[i]) i++;
        if (i === term.length) return true;
    }
    return false;
};

export function Launcher() {

    const apps = new Apps.Apps();

    let listRoot = new Gtk.Box();
    listRoot.orientation = Gtk.Orientation.VERTICAL;

    const searchEntry = (
        <entry
            placeholderText="> "
            cssName={"search-entry"}
            onNotifyText={(self) => {
                updateList(self.text);
            }}
        />
    ) as any;

    const updateList = (query: string) => {
        if (!listRoot) return;

        let child = listRoot.get_first_child();
        while (child) {
            let next = child.get_next_sibling();
            listRoot.remove(child);
            child = next;
        }

        apps.get_list()
            .filter((app: Apps.Application) => fuzzyMatch(app.name || "", query))
            .forEach((app: Apps.Application) => {
                listRoot.append(<AppItem app={app} />);
            });
    };

    const popup = new PopupWindow({
        name: "launcher-detail-window",
        namespace: "js-launcher-detail-window",
        anchor: Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT,
        margin: 8,
        child: (
            <box cssName="launcher-detail-container" orientation={Gtk.Orientation.VERTICAL}>
                {searchEntry}
                <scrolledwindow vexpand heightRequest={400}>
                    {listRoot}
                </scrolledwindow>
            </box>
        )
    });

    // reset on visible
    popup.connect("notify::visible", () => {
        if (popup.visible) {
            searchEntry.text = "";
            searchEntry.grab_focus();
            updateList("");
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
