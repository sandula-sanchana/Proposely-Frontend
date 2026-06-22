import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronRight, Inbox, ClipboardList, Clock, CheckCircle2 } from "lucide-react"
import LecturerLayout from "../../components/LecturerLayout"
import StatusBadge from "../../components/StatusBadge"
import LoadingSpinner from "../../components/LoadingSpinner"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { fetchAssignedProposals } from "../../store/slices/lecturerSlice"
import type { Proposal } from "../../types"

const LecturerDashboard = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { assignedProposals, loading } = useAppSelector((s) => s.lecturer)

  useEffect(() => {
    dispatch(fetchAssignedProposals())
  }, [dispatch])

  const stats = {
    total: assignedProposals.length,
    pending: assignedProposals.filter((p) => p.status === "ASSIGNED").length,
    reviewed: assignedProposals.filter((p) =>
      ["APPROVED", "REJECTED", "CHANGES_REQUESTED"].includes(p.status)
    ).length,
  }

  return (
    <LecturerLayout title="Assigned Proposals">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Total Assigned", value: stats.total, Icon: ClipboardList, color: "#1a73e8", bg: "#e8f0fe" },
            { label: "Awaiting Review", value: stats.pending, Icon: Clock, color: "#f9ab00", bg: "#fef7e0" },
            { label: "Completed", value: stats.reviewed, Icon: CheckCircle2, color: "#34a853", bg: "#e6f4ea" },
          ].map(({ label, value, Icon, color, bg }) => (
            <div key={label} style={{ background: "white", border: "1px solid #dadce0", borderRadius: 16, padding: "18px 22px" }}>
              <div style={{ background: bg, width: 38, height: 38, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
                <Icon size={18} style={{ color }} />
              </div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#202124" }}>{value}</div>
              <div style={{ fontSize: 13, color: "#5f6368", marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Header */}
        <div>
          <h2 className="font-bold" style={{ fontSize: 20, color: "#202124" }}>Your Assigned Proposals</h2>
          <p style={{ fontSize: 13, color: "#5f6368", marginTop: 2 }}>Click any proposal to review and provide feedback</p>
        </div>

        {loading && <LoadingSpinner />}

        {/* Empty state */}
        {!loading && assignedProposals.length === 0 && (
          <div style={{ background: "white", border: "2px dashed #dadce0", borderRadius: 20, padding: "64px 32px", textAlign: "center" }}>
            <div style={{ width: 72, height: 72, background: "#f1f3f4", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Inbox size={32} style={{ color: "#bdc1c6" }} />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 600, color: "#3c4043", marginBottom: 8 }}>No proposals yet</h3>
            <p style={{ color: "#5f6368", fontSize: 14 }}>You'll see proposals here once the admin assigns them to you.</p>
          </div>
        )}

        {/* Proposals */}
        {!loading && assignedProposals.length > 0 && (
          <div className="space-y-3">
            {assignedProposals.map((proposal: Proposal) => (
              <div
                key={proposal._id}
                onClick={() => navigate(`/lecturer/proposals/${proposal._id}`)}
                style={{ background: "white", border: "1px solid #dadce0", borderRadius: 16, padding: "18px 22px", cursor: "pointer", transition: "all 0.2s" }}
                className="hover:shadow-md hover:border-blue-200 group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: "#202124" }} className="truncate group-hover:text-blue-700 transition-colors">
                      {proposal.title}
                    </h3>
                    <p style={{ fontSize: 13, color: "#5f6368", marginTop: 4 }} className="line-clamp-2">{proposal.description}</p>
                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                      <StatusBadge status={proposal.status} />
                      <span style={{ fontSize: 12, color: "#80868b", background: "#f8f9fa", borderRadius: 6, padding: "2px 8px" }}>
                        Student: {(proposal.student as any)?.name}
                      </span>
                      {proposal.latestVersion && (
                        <span style={{ fontSize: 12, color: "#80868b", background: "#f8f9fa", borderRadius: 6, padding: "2px 8px" }}>
                          v{proposal.latestVersion.versionNumber}
                        </span>
                      )}
                    </div>
                  </div>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: "#f8f9fa", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                    className="group-hover:bg-blue-50 transition-colors">
                    <ChevronRight size={16} style={{ color: "#80868b" }} className="group-hover:text-blue-600 transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </LecturerLayout>
  )
}

export default LecturerDashboard
