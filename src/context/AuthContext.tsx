import { createContext, useEffect, useState } from "react"
import { verifyToken } from "../service/authService"
import type { User } from "../types"

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  loading: boolean
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  loading: true,
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    const storedUser = localStorage.getItem("userData")

    if (token && storedUser) {
      // Verify token is still valid
      verifyToken()
        .then(() => {
          setUser(JSON.parse(storedUser))
        })
        .catch(() => {
          // Token expired or invalid — clear everything
          localStorage.removeItem("accessToken")
          localStorage.removeItem("refreshToken")
          localStorage.removeItem("userData")
          setUser(null)
        })
        .finally(() => setLoading(false))
    } else {
      setUser(null)
      setLoading(false)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
