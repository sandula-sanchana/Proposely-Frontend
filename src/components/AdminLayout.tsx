import { LayoutDashboard } from "lucide-react"
import Sidebar from "./Sidebar"
import Navbar from "./Navbar"

const adminNav = [
  { label: "Submissions", to: "/admin/dashboard", Icon: LayoutDashboard },
]

const AdminLayout = ({
  children,
  title = "Admin Portal",
}: {
  children: React.ReactNode
  title?: string
}) => (
  <div className="flex min-h-screen bg-gray-50">
    <Sidebar items={adminNav} />
    <div className="flex-1 flex flex-col overflow-hidden">
      <Navbar title={title} />
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  </div>
)

export default AdminLayout
