import { NavLink } from "react-router-dom"
import type { LucideIcon } from "lucide-react"

interface NavItem {
  label: string
  to: string
  Icon: LucideIcon
}

interface SidebarProps {
  items: NavItem[]
  title?: string
  accentColor?: string
}

const Sidebar = ({ items, title = "Proposely", accentColor = "#1a73e8" }: SidebarProps) => (
  <aside
    className="w-60 min-h-screen flex flex-col"
    style={{
      background: "white",
      borderRight: "1px solid #dadce0",
      boxShadow: "2px 0 8px rgba(0,0,0,0.04)",
    }}
  >
    {/* Logo */}
    <div
      className="h-16 flex items-center px-5 gap-3"
      style={{ borderBottom: "1px solid #f1f3f4" }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
        style={{ background: accentColor }}
      >
        P
      </div>
      <span className="font-bold text-base" style={{ color: "#202124", letterSpacing: "-0.01em" }}>
        {title}
      </span>
    </div>

    {/* Nav items */}
    <nav className="flex-1 px-3 py-4 space-y-1">
      {items.map(({ label, to, Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive ? "" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
            }`
          }
          style={({ isActive }) =>
            isActive
              ? { background: `${accentColor}12`, color: accentColor, fontWeight: 600 }
              : {}
          }
        >
          {({ isActive }) => (
            <>
              <Icon size={17} style={{ color: isActive ? accentColor : "#80868b" }} />
              {label}
              {isActive && (
                <div
                  className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{ background: accentColor }}
                />
              )}
            </>
          )}
        </NavLink>
      ))}
    </nav>

    {/* Footer brand */}
    <div className="px-5 py-4" style={{ borderTop: "1px solid #f1f3f4" }}>
      <p style={{ fontSize: 11, color: "#bdc1c6" }}>© 2026 Proposely</p>
    </div>
  </aside>
)

export default Sidebar
