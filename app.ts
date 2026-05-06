import app from "ags/gtk4/app"
import style from "./styles/main.scss"
import Bar from "./widget/Bar"
import Settings from "./widget/Settings"

app.start({
  css: style,
  main() {

    for (const monitor of app.get_monitors()) {
        Bar(monitor)
        Settings(monitor)
    }
  },
})
