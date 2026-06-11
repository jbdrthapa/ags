import Gtk from "gi://Gtk?version=4.0"
import AstalNiri from "gi://AstalNiri"
import { For, createBinding } from "ags"
import { execAsync } from "ags/process";

interface NiriWorkspace {
  id: number
  name: string | null
  focus(): void
}

export function WorkspaceWidget() {
  const niri = AstalNiri.get_default()

  // 1. Create a binding for the list of all workspaces
  const workspaces = createBinding(niri, "workspaces")

  // 2. Create a binding for the currently focused window object
  const focused = createBinding(niri, "focused_window")

  return (
    <box>
      <box cssName="workspace-container" orientation={Gtk.Orientation.HORIZONTAL}>
        <box spacing={5}>
          <button
            valign={Gtk.Align.CENTER}
            cssClasses={["workspace-item", "close"]}
            onClicked={() => {
              execAsync("niri msg action close-window")
            }}
          >
            <label label="󰛉" />
          </button>
          <For each={workspaces}>
            {(ws: NiriWorkspace) => (
              <button valign={Gtk.Align.CENTER}
                cssClasses={createBinding(niri, "focused_workspace").as(focused => {
                  const isFocused = focused?.id === ws.id;
                  return isFocused ? ["workspace-item", "focused"] : ["workspace-item"];
                })}
                onClicked={() => ws.focus()}
              >
                <label label={ws.name || `${workspaces.peek().indexOf(ws) + 1}`} />
              </button>
            )}
          </For>
        </box>
      </box>

      <box spacing={10} cssName="active-window-container" marginStart={10}>

        {/* Application Icon */}
        <image visible={focused.as(win => !!win)} icon-name={focused.as(win => win?.app_id || "image-missing")} cssName="active-window-icon" />

        {/* Application Title */}
        <label cssName={"active-window-name"} label={focused.as(win => {
          if (!win || !win.title) return "";

          const maxLength = 60;
          return win.title.length > maxLength
            ? win.title.substring(0, maxLength) + "..."
            : win.title;
        })}
          visible={focused.as(win => !!win && !!win.title)}
          tooltipText={focused.as(win => {
            if (!win || !win.title) return "";

            // console.log("Focused window title:", win.title);

            return win.title;
          })}
        />
      </box>
    </box>
  )
}