import { LayoutDashboard, PlusCircle } from "lucide-react"
import Sidebar from "./Sidebar"
import Navbar from "./Navbar"

const studentNav = [
  { label: "My Proposals", to: "/student/dashboard", Icon: LayoutDashboard },
  { label: "New Proposal", to: "/student/create", Icon: PlusCircle },
]

const StudentLayout = ({
  children,
  title = "Student Portal",
}: {
  children: React.ReactNode
  title?: string
}) => (
  <div className="flex min-h-screen bg-gray-50">
    <Sidebar items={studentNav} />
    <div className="flex-1 flex flex-col overflow-hidden">
      <Navbar title={title} />
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  </div>
)

export default StudentLayout
