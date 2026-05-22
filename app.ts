import app from "ags/gtk4/app"
import style from "./styles/main.scss"
import Bar from "./widget/Bar"
import Settings from "./widget/settings/Settings"
import NotificationPopups from "./widget/modules-right/NotificationPopups"
import Osd from "./widget/osd/Osd"
import TimeService from "./services/TimeService"

app.set_application_id("org.js-shell")
app.version = "1.0"

app.start({
  instanceName:"js-shell",
  css: style,
  main() {

    const services = [
      TimeService
    ]

    const activeServices = services.map(Service => new Service());

    for (const monitor of app.get_monitors()) {
      Bar(monitor)
      Settings(monitor)
      NotificationPopups(monitor)
      Osd(monitor)
    }
  },
})
