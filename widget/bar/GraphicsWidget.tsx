import { Gtk } from "ags/gtk4"
import { createBinding, createComputed } from "gnim";
import GraphicsService from "../../services/GraphicsService"
import Utils from "../../Utils";

export function GraphicsWidget() {

  const CONFIG_DIR = `${Utils.GetUserConfigDirectory()}/ags`;

  const GRAPHICS_STATUS: Record<string, [string, string]> = {
    "": [`${CONFIG_DIR}/assets/graphics/unknown.svg`, "Unknown"],
    "active": [`${CONFIG_DIR}/assets/graphics/active.svg`, "Active"],
    "resuming": [`${CONFIG_DIR}/assets/graphics/resuming.svg`, "Resuming"],
    "suspended": [`${CONFIG_DIR}/assets/graphics/suspended.svg`, "Suspended"],
    "suspending": [`${CONFIG_DIR}/assets/graphics/suspending.svg`, "Suspending"]
  };

  const graphicsService = GraphicsService.get_default();

  const rawGraphicsStatusMode = createBinding(graphicsService, "dgpu_mode");

  const graphicsStatusIconPath = createComputed(() => {
    return GRAPHICS_STATUS[rawGraphicsStatusMode()][0];
  })

  const graphicsStatus = createComputed(() => {
    return GRAPHICS_STATUS[rawGraphicsStatusMode()][1];
  })

  return (
    <button vexpand valign={Gtk.Align.CENTER} cssName="power-profile-button">
      <image file={graphicsStatusIconPath} pixelSize={38} tooltipText={graphicsStatus} css="filter: drop-shadow(1px 1px 1px rgba(0, 0, 0, 0.9));" cssName="settings-param-icon" halign={Gtk.Align.START} />
    </button>
  )
}