import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { register } from "../service/authService"
import { User, Mail, Lock, ArrowRight, Eye, EyeOff, GraduationCap, BookOpen, ShieldCheck } from "lucide-react"

const ROLES = [
  { value: "STUDENT", label: "Student", desc: "Submit and track proposals", Icon: GraduationCap, color: "#1a73e8" },
  { value: "LECTURER", label: "Lecturer", desc: "Review assigned proposals", Icon: BookOpen, color: "#ea4335" },
  { value: "ADMIN", label: "Admin", desc: "Manage and oversee all proposals", Icon: ShieldCheck, color: "#34a853" },
]

const Register = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [role, setRole] = useState("STUDENT")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      setError("Please fill in all fields")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }
    try {
      setLoading(true)
      setError("")
      await register(name, email, password, role)
      navigate("/login")
    } catch (err: any) {
      setError(err?.response?.data?.message || "Registration failed. Try again.")
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    border: "1.5px solid #dadce0",
    borderRadius: 10,
    padding: "11px 16px 11px 42px",
    width: "100%",
    fontSize: 15,
    outline: "none",
    background: "white",
    transition: "border 0.2s",
  }

  return (
    <div className="min-h-screen flex items-start justify-center py-12 px-4" style={{ background: "#f8f9fa" }}>
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div style={{ background: "#1a73e8", borderRadius: 12 }}
              className="w-10 h-10 flex items-center justify-center text-white font-bold text-xl">P</div>
            <span className="font-bold text-xl" style={{ color: "#202124" }}>Proposely</span>
          </Link>
          <h1 className="font-bold mb-1" style={{ fontSize: 26, color: "#202124" }}>Create your account</h1>
          <p style={{ color: "#5f6368", fontSize: 15 }}>Get started in seconds</p>
        </div>

        <div style={{ background: "white", border: "1px solid #dadce0", borderRadius: 20, padding: 32, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          {error && (
            <div className="mb-5 p-4 rounded-xl flex items-start gap-3"
              style={{ background: "#fce8e6", border: "1px solid #f5c6c6" }}>
              <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: "#ea4335" }} />
              <p style={{ color: "#c5221f", fontSize: 14 }}>{error}</p>
            </div>
          )}

          {/* Role Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3" style={{ color: "#3c4043" }}>I am a…</label>
            <div className="grid grid-cols-3 gap-3">
              {ROLES.map(({ value, label, desc, Icon, color }) => (
                <button key={value} type="button" onClick={() => setRole(value)}
                  style={{
                    border: `2px solid ${role === value ? color : "#dadce0"}`,
                    borderRadius: 12,
                    padding: "12px 8px",
                    background: role === value ? `${color}08` : "white",
                    cursor: "pointer",
                    transition: "all 0.15s",
                    textAlign: "center",
                  }}>
                  <Icon size={22} style={{ color: role === value ? color : "#80868b", margin: "0 auto 4px" }} />
                  <div style={{ fontSize: 13, fontWeight: 600, color: role === value ? color : "#3c4043" }}>{label}</div>
                  <div style={{ fontSize: 10, color: "#80868b", lineHeight: 1.3, marginTop: 2 }}>{desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#3c4043" }}>Full Name</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#80868b" }} />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe" style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#1a73e8")}
                  onBlur={(e) => (e.target.style.borderColor = "#dadce0")} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#3c4043" }}>Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#80868b" }} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@university.edu" style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = "#1a73e8")}
                  onBlur={(e) => (e.target.style.borderColor = "#dadce0")} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#3c4043" }}>Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#80868b" }} />
                <input type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 6 characters" style={{ ...inputStyle, paddingRight: 48 }}
                  onFocus={(e) => (e.target.style.borderColor = "#1a73e8")}
                  onBlur={(e) => (e.target.style.borderColor = "#dadce0")} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#3c4043" }}>Confirm Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#80868b" }} />
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••" style={inputStyle}
                  onKeyDown={(e) => e.key === "Enter" && handleRegister()}
                  onFocus={(e) => (e.target.style.borderColor = "#1a73e8")}
                  onBlur={(e) => (e.target.style.borderColor = "#dadce0")} />
              </div>
            </div>

            <button onClick={handleRegister} disabled={loading}
              style={{ width: "100%", background: loading ? "#8ab4f8" : "#1a73e8", color: "white", borderRadius: 10, padding: "13px 24px", fontWeight: 600, fontSize: 15, border: "none", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s", marginTop: 8 }}
              className="hover:opacity-90">
              {loading ? "Creating account…" : (<>Create Account <ArrowRight size={16} /></>)}
            </button>
          </div>

          <p className="text-center mt-5" style={{ fontSize: 14, color: "#5f6368" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#1a73e8", fontWeight: 600 }} className="hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
