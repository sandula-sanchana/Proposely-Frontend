import api from "./api"
import type { User } from "../types"

export const register = async (
  name: string,
  email: string,
  password: string,
  role: string = "STUDENT"
) => {
  const res = await api.post("/auth/register", { name, email, password, role })
  return res.data
}

export const login = async (email: string, password: string): Promise<User> => {
  const res = await api.post("/auth/login", { email, password })
  const { user, accessToken, refreshToken } = res.data.data

  // Persist session (/auth/me does NOT return user data — store it here)
  localStorage.setItem("accessToken", accessToken)
  localStorage.setItem("refreshToken", refreshToken)
  localStorage.setItem("userData", JSON.stringify(user))

  return user
}

// Use this only to verify the token is still valid, not to get user data
export const verifyToken = async () => {
  const res = await api.get("/auth/me")
  return res.data
}

export const logout = () => {
  localStorage.removeItem("accessToken")
  localStorage.removeItem("refreshToken")
  localStorage.removeItem("userData")
}
