"use client"

import { useTheme } from "@/hooks/useTheme"

export function ThemeToggle() {
  const { isLight, toggleTheme } = useTheme()

  return (
    <label
      className="ui-switch"
      title={isLight ? "Switch to Dark Mode" : "Switch to Light Mode"}
      style={{ cursor: "pointer" }}
    >
      <input
        type="checkbox"
        checked={isLight}
        onChange={toggleTheme}
      />
      <div className="slider">
        <div className="circle" />
      </div>
    </label>
  )
}
