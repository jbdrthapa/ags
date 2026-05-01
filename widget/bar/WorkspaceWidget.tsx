import AstalNiri from "gi://AstalNiri"
import { For, createBinding } from "ags"

interface NiriWorkspace {
    id: number
    name: string | null
    focus(): void
}

export function WorkspaceWidget() {
  const niri = AstalNiri.get_default()

  // 1. Create a binding for the list of all workspaces
  const workspaces = createBinding(niri, "workspaces")

  // 2. Create a binding for the currently focused workspace object
  const focused = createBinding(niri, "focused_workspace")

  return (
    <box cssName="workspace-container">
      {/* 3. Use <For> to iterate through the workspaces binding */}
      <For each={workspaces}>
        {(ws: NiriWorkspace) => (
          <button
            // 4. Transform the focused binding to check if IDs match
            cssName={focused((f) =>
              f?.id === ws.id ? "workspace-item active" : "workspace-item"
            )}
            onClicked={() => ws.focus()}
          >
            <label label={ws.name || `${ws.id}`} />
          </button>
        )}
      </For>
    </box>
  )
}