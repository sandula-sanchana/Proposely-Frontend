import { LogOut, User, ChevronDown } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { logout } from "../service/authService"

const roleColors: Record<string, { bg: string; text: string }> = {
  STUDENT: { bg: "#e8f0fe", text: "#1967d2" },
  LECTURER: { bg: "#fce8e6", text: "#c5221f" },
  ADMIN: { bg: "#e6f4ea", text: "#137333" },
}

const Navbar = ({ title }: { title: string }) => {
  const { user, setUser } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    setUser(null)
    navigate("/login")
  }

  const colors = roleColors[user?.role ?? ""] ?? { bg: "#f1f3f4", text: "#5f6368" }

  return (
    <header
      className="h-16 flex items-center justify-between px-6 sticky top-0 z-10"
      style={{ background: "white", borderBottom: "1px solid #f1f3f4", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}
    >
      <h1 className="font-semibold" style={{ fontSize: 18, color: "#202124" }}>{title}</h1>

      <div className="flex items-center gap-3">
        {/* User chip */}
        <div
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-full"
          style={{ background: "#f8f9fa", border: "1px solid #e8eaed" }}
        >
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ background: colors.bg }}
          >
            <User size={12} style={{ color: colors.text }} />
          </div>
          <span style={{ fontSize: 13, fontWeight: 500, color: "#3c4043" }}>{user?.name}</span>
          <span
            className="px-2 py-0.5 rounded-full text-xs font-semibold"
            style={{ background: colors.bg, color: colors.text }}
          >
            {user?.role}
          </span>
          <ChevronDown size={12} style={{ color: "#80868b" }} />
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors"
          style={{ fontSize: 13, fontWeight: 500, color: "#5f6368", border: "1px solid #dadce0", background: "transparent" }}
          onMouseEnter={(e) => {
            const t = e.currentTarget
            t.style.background = "#fce8e6"
            t.style.color = "#c5221f"
            t.style.borderColor = "#f5c6c6"
          }}
          onMouseLeave={(e) => {
            const t = e.currentTarget
            t.style.background = "transparent"
            t.style.color = "#5f6368"
            t.style.borderColor = "#dadce0"
          }}
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>
    </header>
  )
}

export default Navbar
