import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import { lazy, Suspense, type ReactNode } from "react"
import { useAuth } from "../hooks/useAuth"

const Home = lazy(() => import("../pages/Home"))
const Login = lazy(() => import("../pages/Login"))
const Register = lazy(() => import("../pages/Register"))

const StudentDashboard = lazy(() => import("../pages/student/StudentDashboard"))
const CreateProposal = lazy(() => import("../pages/student/CreateProposal"))
const EditProposal = lazy(() => import("../pages/student/EditProposal"))
const ProposalFeedback = lazy(() => import("../pages/student/ProposalFeedback"))

const LecturerDashboard = lazy(() => import("../pages/lecturer/LecturerDashboard"))
const ProposalReview = lazy(() => import("../pages/lecturer/ProposalReview"))
const AIReviewPage = lazy(() => import("../pages/lecturer/AIReviewPage"))

const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"))

const Spinner = () => (
  <div className="flex items-center justify-center h-screen bg-gray-50">
    <div className="w-12 h-12 border-4 border-indigo-500 border-dashed rounded-full animate-spin" />
  </div>
)

type RequireAuthProps = {
  children: ReactNode
  roles?: string[]
}

const RequireAuth = ({ children, roles }: RequireAuthProps) => {
  const { user, loading } = useAuth()

  if (loading) return <Spinner />
  if (!user) return <Navigate to="/login" replace />

  if (roles && !roles.includes(user.role)) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h2>
          <p className="text-gray-600">
            You don't have permission to view this page.
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}


const Router = () => (
  <BrowserRouter>
    <Suspense fallback={<Spinner />}>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student */}
        <Route
          path="/student/dashboard"
          element={
            <RequireAuth roles={["STUDENT"]}>
              <StudentDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/student/create"
          element={
            <RequireAuth roles={["STUDENT"]}>
              <CreateProposal />
            </RequireAuth>
          }
        />
        <Route
          path="/student/proposals/:id/edit"
          element={
            <RequireAuth roles={["STUDENT"]}>
              <EditProposal />
            </RequireAuth>
          }
        />
        <Route
          path="/student/proposals/:id/feedback"
          element={
            <RequireAuth roles={["STUDENT"]}>
              <ProposalFeedback />
            </RequireAuth>
          }
        />

        {/* Lecturer */}
        <Route
          path="/lecturer/dashboard"
          element={
            <RequireAuth roles={["LECTURER"]}>
              <LecturerDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/lecturer/proposals/:id"
          element={
            <RequireAuth roles={["LECTURER"]}>
              <ProposalReview />
            </RequireAuth>
          }
        />
        <Route
          path="/lecturer/proposals/:id/ai-review"
          element={
            <RequireAuth roles={["LECTURER"]}>
              <AIReviewPage />
            </RequireAuth>
          }
        />

        {/* Admin */}
        <Route
          path="/admin/dashboard"
          element={
            <RequireAuth roles={["ADMIN"]}>
              <AdminDashboard />
            </RequireAuth>
          }
        />

        {/* Root */}
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
)

export default Router
