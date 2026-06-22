import { LayoutDashboard } from "lucide-react"
import Sidebar from "./Sidebar"
import Navbar from "./Navbar"

const lecturerNav = [
  { label: "Assigned Proposals", to: "/lecturer/dashboard", Icon: LayoutDashboard },
]

const LecturerLayout = ({
  children,
  title = "Lecturer Portal",
}: {
  children: React.ReactNode
  title?: string
}) => (
  <div className="flex min-h-screen bg-gray-50">
    <Sidebar items={lecturerNav} />
    <div className="flex-1 flex flex-col overflow-hidden">
      <Navbar title={title} />
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  </div>
)

export default LecturerLayout
