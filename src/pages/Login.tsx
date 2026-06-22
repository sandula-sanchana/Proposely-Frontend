import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { login } from "../service/authService"
import { useAuth } from "../hooks/useAuth"
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react"

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { setUser } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }
    try {
      setLoading(true)
      setError("")
      const user = await login(email, password)
      setUser(user)
      if (user.role === "STUDENT") navigate("/student/dashboard")
      else if (user.role === "LECTURER") navigate("/lecturer/dashboard")
      else if (user.role === "ADMIN") navigate("/admin/dashboard")
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex" style={{ background: "#f8f9fa" }}>
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(145deg, #1a73e8 0%, #0d47a1 100%)" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white font-bold text-xl backdrop-blur">P</div>
          <span className="text-white font-bold text-xl">Proposely</span>
        </div>
        <div>
          <h2 className="text-white font-bold mb-4" style={{ fontSize: 36, lineHeight: 1.2 }}>
            Welcome back to<br />your workspace
          </h2>
          <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 16, lineHeight: 1.7 }}>
            Manage your research proposals, track feedback, and collaborate with your team — all in one place.
          </p>
          <div className="flex flex-col gap-3 mt-10">
            {["AI-powered feedback on every version", "Real-time proposal tracking", "Secure role-based access"].map((t) => (
              <div key={t} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-white/30 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-white" />
                </div>
                <span style={{ color: "rgba(255,255,255,0.9)", fontSize: 14 }}>{t}</span>
              </div>
            ))}
          </div>
        </div>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>© 2026 Proposely</p>
        {/* decorative blobs */}
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10" style={{ background: "white" }} />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full opacity-10" style={{ background: "white" }} />
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div style={{ background: "#1a73e8", borderRadius: 10 }} className="w-9 h-9 flex items-center justify-center text-white font-bold text-lg">P</div>
            <span className="font-bold text-xl" style={{ color: "#202124" }}>Proposely</span>
          </div>

          <div className="mb-8">
            <h1 className="font-bold mb-2" style={{ fontSize: 28, color: "#202124" }}>Sign in</h1>
            <p style={{ color: "#5f6368", fontSize: 15 }}>Enter your credentials to access your account</p>
          </div>

          {error && (
            <div className="mb-5 p-4 rounded-xl flex items-start gap-3"
              style={{ background: "#fce8e6", border: "1px solid #f5c6c6" }}>
              <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: "#ea4335" }} />
              <p style={{ color: "#c5221f", fontSize: 14 }}>{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#3c4043" }}>Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#80868b" }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@university.edu"
                  style={{ border: "1.5px solid #dadce0", borderRadius: 10, padding: "12px 16px 12px 42px", width: "100%", fontSize: 15, outline: "none", background: "white", transition: "border 0.2s" }}
                  onFocus={(e) => (e.target.style.borderColor = "#1a73e8")}
                  onBlur={(e) => (e.target.style.borderColor = "#dadce0")}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "#3c4043" }}>Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#80868b" }} />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  style={{ border: "1.5px solid #dadce0", borderRadius: 10, padding: "12px 48px 12px 42px", width: "100%", fontSize: 15, outline: "none", background: "white", transition: "border 0.2s" }}
                  onFocus={(e) => (e.target.style.borderColor = "#1a73e8")}
                  onBlur={(e) => (e.target.style.borderColor = "#dadce0")}
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              style={{ width: "100%", background: loading ? "#8ab4f8" : "#1a73e8", color: "white", borderRadius: 10, padding: "13px 24px", fontWeight: 600, fontSize: 15, border: "none", cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.2s", marginTop: 8 }}
              className="hover:opacity-90">
              {loading ? "Signing in…" : (<>Sign In <ArrowRight size={16} /></>)}
            </button>
          </div>

          <p className="text-center mt-6" style={{ fontSize: 14, color: "#5f6368" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#1a73e8", fontWeight: 600 }} className="hover:underline">
              Create one
            </Link>
          </p>
          <p className="text-center mt-3">
            <Link to="/" style={{ color: "#80868b", fontSize: 13 }} className="hover:underline">
              ← Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
