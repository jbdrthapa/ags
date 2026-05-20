import AstalPowerProfiles from "gi://AstalPowerProfiles"
import { createBinding } from "ags"

export function PowerProfileWidget() {

  const powerprofiles = AstalPowerProfiles.get_default()

  const activeProfile = createBinding(powerprofiles, "active_profile")

  const batteryClass = createBinding(powerprofiles, "active_profile")((p): string[] => {
    switch (p) {
      case "power-saver":
        return ["power-profile-power-saver"]
      case "balanced":
        return ["power-profile-balanced"]
      case "performance":
        return ["power-profile-performance"]
      default:
        return ["power-profile-unknown"]
    }
  })

  const getIcon = (profile: string) => {
    switch (profile) {
      case "power-saver":
        return "󰌪"
      case "balanced":
        return ""
      case "performance":
        return "󱐋"
      default:
        return "dialog-question-symbolic"
    }
  }

  const cycleProfile = () => {
    const profiles = powerprofiles.get_profiles()
    if (!profiles.length) return

    const current = activeProfile.get()
    const currentIndex = profiles.findIndex(({ profile }) => profile === current)
    const nextIndex = (currentIndex + 1) % profiles.length
    powerprofiles.set_active_profile(profiles[nextIndex].profile)
  }

  return (
    <box cssName="bar-button-background">
      <button onClicked={cycleProfile} tooltipText={activeProfile} cssName="bar-module-button">
        <label label={activeProfile.as(getIcon)} cssClasses={batteryClass} />
      </button>
    </box>
  )
}