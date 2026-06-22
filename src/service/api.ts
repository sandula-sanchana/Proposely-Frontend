import axios, { AxiosError } from "axios"

const api = axios.create({
  baseURL: "https://proposely-backend.vercel.app/api/v1",
})

const PUBLIC_ENDPOINTS = ["/auth/login", "/auth/register"]

// Attach token to every request
api.interceptors.request.use((config) => {
  const isPublic = PUBLIC_ENDPOINTS.some((url) => config.url?.includes(url))
  if (!isPublic) {
    const token = localStorage.getItem("accessToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

// Handle 401: clear storage and redirect to login
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config
    const isPublic = PUBLIC_ENDPOINTS.some((url) =>
      originalRequest?.url?.includes(url)
    )

    if (!isPublic && error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("userData")
      window.location.href = "/login"
    }

    return Promise.reject(error)
  }
)

export default api
