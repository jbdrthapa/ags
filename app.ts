import app from "ags/gtk4/app"
import style from "./styles/main.scss"
import Bar from "./widget/Bar"
import Settings from "./widget/settings/Settings"
import NotificationPopups from "./widget/modules-right/NotificationPopups"

app.start({
  css: style,
  main() {

    for (const monitor of app.get_monitors()) {
      Bar(monitor)
      Settings(monitor)
      NotificationPopups(monitor)
    }
  },
})
