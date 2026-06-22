import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { PlusCircle, ChevronRight, FileText, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import StudentLayout from "../../components/StudentLayout"
import StatusBadge from "../../components/StatusBadge"
import LoadingSpinner from "../../components/LoadingSpinner"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import { fetchMyProposals } from "../../store/slices/proposalSlice"
import type { Proposal, ProposalStatus } from "../../types"

const statConfig = [
  { label: "Total", icon: FileText, color: "#1a73e8", bg: "#e8f0fe", key: "total" },
  { label: "Pending Review", icon: Clock, color: "#f9ab00", bg: "#fef7e0", key: "pending" },
  { label: "Approved", icon: CheckCircle2, color: "#34a853", bg: "#e6f4ea", key: "approved" },
  { label: "Needs Changes", icon: AlertCircle, color: "#ea4335", bg: "#fce8e6", key: "changes" },
]

const StudentDashboard = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { proposals, loading, error } = useAppSelector((s) => s.proposals)

  useEffect(() => {
    dispatch(fetchMyProposals())
  }, [dispatch])

  const canEdit = (status: ProposalStatus) =>
    status === "DRAFT" || status === "CHANGES_REQUESTED"

  const stats = {
    total: proposals.length,
    pending: proposals.filter((p) => ["SUBMITTED", "ASSIGNED"].includes(p.status)).length,
    approved: proposals.filter((p) => p.status === "APPROVED").length,
    changes: proposals.filter((p) => p.status === "CHANGES_REQUESTED").length,
  }

  return (
    <StudentLayout title="My Proposals">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statConfig.map(({ label, icon: Icon, color, bg, key }) => (
            <div key={key} style={{ background: "white", border: "1px solid #dadce0", borderRadius: 16, padding: "16px 20px" }}>
              <div className="flex items-center justify-between mb-3">
                <div style={{ background: bg, width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon size={18} style={{ color }} />
                </div>
              </div>
              <div style={{ fontSize: 26, fontWeight: 700, color: "#202124" }}>{stats[key as keyof typeof stats]}</div>
              <div style={{ fontSize: 13, color: "#5f6368", marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold" style={{ fontSize: 20, color: "#202124" }}>All Proposals</h2>
            <p style={{ fontSize: 13, color: "#5f6368", marginTop: 2 }}>
              {proposals.length} proposal{proposals.length !== 1 ? "s" : ""} found
            </p>
          </div>
          <button
            onClick={() => navigate("/student/create")}
            style={{ background: "#1a73e8", color: "white", border: "none", borderRadius: 10, padding: "10px 18px", fontWeight: 600, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 7, boxShadow: "0 2px 6px rgba(26,115,232,0.3)" }}
            className="hover:opacity-90 transition-opacity">
            <PlusCircle size={16} /> New Proposal
          </button>
        </div>

        {loading && <LoadingSpinner />}
        {error && (
          <div style={{ background: "#fce8e6", border: "1px solid #f5c6c6", borderRadius: 12, padding: "14px 18px", color: "#c5221f", fontSize: 14 }}>
            {error}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && proposals.length === 0 && (
          <div style={{ background: "white", border: "2px dashed #dadce0", borderRadius: 20, padding: "64px 32px", textAlign: "center" }}>
            <div style={{ width: 72, height: 72, background: "#f1f3f4", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <FileText size={32} style={{ color: "#bdc1c6" }} />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 600, color: "#3c4043", marginBottom: 8 }}>No proposals yet</h3>
            <p style={{ color: "#5f6368", fontSize: 14, marginBottom: 20 }}>Create your first research proposal to get started.</p>
            <button
              onClick={() => navigate("/student/create")}
              style={{ background: "#1a73e8", color: "white", border: "none", borderRadius: 10, padding: "10px 22px", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
              Create First Proposal
            </button>
          </div>
        )}

        {/* Proposal list */}
        {!loading && proposals.length > 0 && (
          <div className="space-y-3">
            {proposals.map((proposal: Proposal) => (
              <div key={proposal._id}
                style={{ background: "white", border: "1px solid #dadce0", borderRadius: 16, padding: "18px 22px", transition: "all 0.2s" }}
                className="hover:shadow-md hover:border-blue-200">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: "#202124" }} className="truncate">{proposal.title}</h3>
                    <p style={{ fontSize: 13, color: "#5f6368", marginTop: 4 }} className="line-clamp-2">{proposal.description}</p>
                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                      <StatusBadge status={proposal.status} />
                      <span style={{ fontSize: 12, color: "#80868b" }}>
                        {new Date(proposal.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                      {proposal.assignedLecturer && (
                        <span style={{ fontSize: 12, color: "#80868b", background: "#f8f9fa", borderRadius: 6, padding: "2px 8px" }}>
                          Reviewer: {(proposal.assignedLecturer as any).name}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {canEdit(proposal.status) && (
                      <button onClick={() => navigate(`/student/proposals/${proposal._id}/edit`)}
                        style={{ fontSize: 13, padding: "7px 14px", border: "1.5px solid #1a73e8", color: "#1a73e8", borderRadius: 8, background: "white", cursor: "pointer", fontWeight: 500 }}
                        className="hover:bg-blue-50 transition-colors">
                        Edit
                      </button>
                    )}
                    {proposal.status !== "DRAFT" && (
                      <button onClick={() => navigate(`/student/proposals/${proposal._id}/feedback`)}
                        style={{ fontSize: 13, padding: "7px 14px", border: "1.5px solid #dadce0", color: "#5f6368", borderRadius: 8, background: "white", cursor: "pointer", fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}
                        className="hover:bg-gray-50 transition-colors">
                        Feedback <ChevronRight size={13} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </StudentLayout>
  )
}

export default StudentDashboard
