import { useEffect, useState, useRef } from "react"
import { Users, Inbox, ClipboardCheck, AlertCircle, X, CheckCircle, Search, ChevronDown, Loader2 } from "lucide-react"
import AdminLayout from "../../components/AdminLayout"
import StatusBadge from "../../components/StatusBadge"
import LoadingSpinner from "../../components/LoadingSpinner"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import {
  fetchSubmittedProposals,
  fetchLecturers,
  assignLecturerThunk,
  clearAdminError,
} from "../../store/slices/adminSlice"
import type { Proposal } from "../../types"
import type { LecturerOption } from "../../store/slices/adminSlice"

const AdminDashboard = () => {
  const dispatch = useAppDispatch()
  const { submittedProposals, lecturers, loading, lecturersLoading, submitting, error } =
    useAppSelector((s) => s.admin)

  const [modalProposal, setModalProposal] = useState<Proposal | null>(null)
  const [selectedLecturer, setSelectedLecturer] = useState<LecturerOption | null>(null)
  const [search, setSearch] = useState("")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [assignSuccess, setAssignSuccess] = useState("")
  const [assignError, setAssignError] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    dispatch(fetchSubmittedProposals())
    dispatch(fetchLecturers())
  }, [dispatch])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const filteredLecturers = lecturers.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase())
  )

  const openModal = (proposal: Proposal) => {
    setModalProposal(proposal)
    setSelectedLecturer(null)
    setSearch("")
    setDropdownOpen(false)
    setAssignSuccess("")
    setAssignError("")
    dispatch(clearAdminError())
  }

  const handleAssign = async () => {
    if (!selectedLecturer) {
      setAssignError("Please select a lecturer")
      return
    }
    if (!modalProposal) return
    try {
      setAssignError("")
      await dispatch(
        assignLecturerThunk({ proposalId: modalProposal._id, lecturerId: selectedLecturer._id })
      ).unwrap()
      setAssignSuccess(`${selectedLecturer.name} assigned successfully!`)
      setTimeout(() => {
        setModalProposal(null)
        setSelectedLecturer(null)
        setAssignSuccess("")
      }, 1400)
    } catch (err: any) {
      setAssignError(err || "Assignment failed. Please try again.")
    }
  }

  return (
    <AdminLayout title="Submitted Proposals">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div style={{ background: "white", border: "1px solid #dadce0", borderRadius: 16, padding: "18px 22px", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ background: "#e8f0fe", width: 48, height: 48, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <ClipboardCheck size={22} style={{ color: "#1a73e8" }} />
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "#202124" }}>{submittedProposals.length}</div>
              <div style={{ fontSize: 13, color: "#5f6368" }}>Proposals Pending Assignment</div>
            </div>
          </div>
          <div style={{ background: "linear-gradient(135deg, #1a73e8, #0d47a1)", borderRadius: 16, padding: "18px 22px", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ background: "rgba(255,255,255,0.2)", width: 48, height: 48, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Users size={22} style={{ color: "white" }} />
            </div>
            <div>
              <div style={{ fontSize: 28, fontWeight: 700, color: "white" }}>{lecturers.length}</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)" }}>Available Lecturers</div>
            </div>
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold" style={{ fontSize: 20, color: "#202124" }}>Proposals Awaiting Assignment</h2>
            <p style={{ fontSize: 13, color: "#5f6368", marginTop: 2 }}>Select a lecturer from the dropdown to assign</p>
          </div>
          {submittedProposals.length > 0 && (
            <span style={{ background: "#e8f0fe", color: "#1a73e8", borderRadius: 20, padding: "4px 14px", fontSize: 13, fontWeight: 600 }}>
              {submittedProposals.length} pending
            </span>
          )}
        </div>

        {loading && <LoadingSpinner />}
        {error && (
          <div style={{ background: "#fce8e6", border: "1px solid #f5c6c6", borderRadius: 12, padding: "14px 18px", color: "#c5221f", fontSize: 14 }}>
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading && submittedProposals.length === 0 && (
          <div style={{ background: "white", border: "2px dashed #dadce0", borderRadius: 20, padding: "64px 32px", textAlign: "center" }}>
            <div style={{ width: 72, height: 72, background: "#f1f3f4", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Inbox size={32} style={{ color: "#bdc1c6" }} />
            </div>
            <h3 style={{ fontSize: 17, fontWeight: 600, color: "#3c4043", marginBottom: 8 }}>All caught up!</h3>
            <p style={{ color: "#5f6368", fontSize: 14 }}>No proposals are waiting for a lecturer assignment.</p>
          </div>
        )}

        {/* Proposals list */}
        {!loading && submittedProposals.length > 0 && (
          <div className="space-y-3">
            {submittedProposals.map((proposal: Proposal) => (
              <div key={proposal._id}
                style={{ background: "white", border: "1px solid #dadce0", borderRadius: 16, padding: "18px 22px", transition: "all 0.2s" }}
                className="hover:shadow-md hover:border-blue-200">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: "#202124" }} className="truncate">{proposal.title}</h3>
                    <p style={{ fontSize: 13, color: "#5f6368", marginTop: 4 }} className="line-clamp-2">{proposal.description}</p>
                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                      <StatusBadge status={proposal.status} />
                      <span style={{ fontSize: 12, color: "#80868b", background: "#f8f9fa", borderRadius: 6, padding: "2px 8px" }}>
                        {(proposal.student as any)?.name} · {(proposal.student as any)?.email}
                      </span>
                      <span style={{ fontSize: 12, color: "#80868b" }}>
                        {new Date(proposal.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                      {proposal.latestVersion && (
                        <span style={{ fontSize: 12, color: "#80868b", background: "#f8f9fa", borderRadius: 6, padding: "2px 8px" }}>
                          v{proposal.latestVersion.versionNumber}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => openModal(proposal)}
                    style={{ background: "#1a73e8", color: "white", border: "none", borderRadius: 10, padding: "9px 16px", fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, flexShrink: 0, boxShadow: "0 2px 6px rgba(26,115,232,0.25)" }}
                    className="hover:opacity-90 transition-opacity whitespace-nowrap">
                    <Users size={14} /> Assign Lecturer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Assign Modal ── */}
        {modalProposal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{ background: "rgba(32,33,36,0.55)", backdropFilter: "blur(6px)" }}>
            <div style={{ background: "white", borderRadius: 20, boxShadow: "0 12px 48px rgba(0,0,0,0.18)", width: "100%", maxWidth: 480, overflow: "hidden", animation: "fadeSlideIn 0.2s ease" }}>

              {/* Modal header */}
              <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #f1f3f4", display: "flex", alignItems: "start", justifyContent: "space-between", gap: 12 }}>
                <div className="flex-1 min-w-0">
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: "#202124" }}>Assign a Lecturer</h3>
                  <p style={{ fontSize: 13, color: "#5f6368", marginTop: 2 }} className="truncate">{modalProposal.title}</p>
                </div>
                <button onClick={() => setModalProposal(null)}
                  style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid #dadce0", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                  className="hover:bg-gray-50">
                  <X size={15} style={{ color: "#5f6368" }} />
                </button>
              </div>

              {/* Modal body */}
              <div style={{ padding: "20px 24px" }}>

                {/* Success / Error messages */}
                {assignSuccess && (
                  <div style={{ background: "#e6f4ea", border: "1px solid #a8d5b5", borderRadius: 10, padding: "10px 14px", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                    <CheckCircle size={15} style={{ color: "#137333" }} />
                    <p style={{ fontSize: 13, color: "#137333" }}>{assignSuccess}</p>
                  </div>
                )}
                {assignError && (
                  <div style={{ background: "#fce8e6", border: "1px solid #f5c6c6", borderRadius: 10, padding: "10px 14px", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                    <AlertCircle size={15} style={{ color: "#c5221f" }} />
                    <p style={{ fontSize: 13, color: "#c5221f" }}>{assignError}</p>
                  </div>
                )}

                {/* Selected lecturer preview */}
                {selectedLecturer && (
                  <div style={{ background: "#e8f0fe", border: "1px solid #c5d8fd", borderRadius: 10, padding: "10px 14px", marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "#1a73e8" }}>{selectedLecturer.name}</p>
                      <p style={{ fontSize: 12, color: "#5f6368" }}>{selectedLecturer.email}</p>
                    </div>
                    <button onClick={() => setSelectedLecturer(null)}
                      style={{ width: 24, height: 24, borderRadius: 6, border: "none", background: "#c5d8fd", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <X size={12} style={{ color: "#1a73e8" }} />
                    </button>
                  </div>
                )}

                {/* Dropdown */}
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#3c4043", marginBottom: 6 }}>
                  Select Lecturer {lecturersLoading && <Loader2 size={12} className="inline animate-spin ml-1" style={{ color: "#80868b" }}/>}
                </label>
                <div ref={dropdownRef} className="relative">
                  {/* Trigger */}
                  <button
                    type="button"
                    onClick={() => setDropdownOpen((v) => !v)}
                    style={{ width: "100%", border: `1.5px solid ${dropdownOpen ? "#1a73e8" : "#dadce0"}`, borderRadius: 10, padding: "11px 14px", background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 14, color: selectedLecturer ? "#202124" : "#80868b", boxShadow: dropdownOpen ? "0 0 0 3px rgba(26,115,232,0.12)" : "none", transition: "all 0.15s" }}>
                    <span className="flex items-center gap-2">
                      <Search size={14} style={{ color: "#80868b" }} />
                      {selectedLecturer ? selectedLecturer.name : "Search and select a lecturer…"}
                    </span>
                    <ChevronDown size={14} style={{ color: "#80868b", transform: dropdownOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                  </button>

                  {/* Dropdown panel */}
                  {dropdownOpen && (
                    <div style={{ position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, background: "white", border: "1.5px solid #dadce0", borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", zIndex: 100, overflow: "hidden" }}>
                      {/* Search input */}
                      <div style={{ padding: "10px 12px", borderBottom: "1px solid #f1f3f4" }}>
                        <div className="relative">
                          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#80868b" }} />
                          <input
                            autoFocus
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Type to filter lecturers…"
                            style={{ width: "100%", border: "1px solid #e8eaed", borderRadius: 8, padding: "7px 10px 7px 30px", fontSize: 13, outline: "none", background: "#f8f9fa" }}
                          />
                        </div>
                      </div>

                      {/* Lecturer list */}
                      <div style={{ maxHeight: 220, overflowY: "auto" }}>
                        {lecturersLoading ? (
                          <div style={{ padding: "24px 14px", textAlign: "center" }}>
                            <Loader2 size={20} className="animate-spin mx-auto" style={{ color: "#1a73e8" }} />
                            <p style={{ fontSize: 13, color: "#5f6368", marginTop: 8 }}>Loading lecturers…</p>
                          </div>
                        ) : filteredLecturers.length === 0 ? (
                          <div style={{ padding: "20px 14px", textAlign: "center" }}>
                            <p style={{ fontSize: 13, color: "#80868b" }}>
                              {search ? `No lecturers match "${search}"` : "No lecturers registered yet"}
                            </p>
                          </div>
                        ) : (
                          filteredLecturers.map((lec) => (
                            <button
                              key={lec._id}
                              type="button"
                              onClick={() => {
                                setSelectedLecturer(lec)
                                setDropdownOpen(false)
                                setSearch("")
                                setAssignError("")
                              }}
                              style={{ width: "100%", padding: "11px 16px", background: selectedLecturer?._id === lec._id ? "#e8f0fe" : "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", textAlign: "left", gap: 12, transition: "background 0.1s" }}
                              className="hover:bg-gray-50"
                            >
                              <div>
                                <p style={{ fontSize: 14, fontWeight: 500, color: "#202124" }}>{lec.name}</p>
                                <p style={{ fontSize: 12, color: "#80868b", marginTop: 1 }}>{lec.email}</p>
                              </div>
                              {selectedLecturer?._id === lec._id && (
                                <CheckCircle size={15} style={{ color: "#1a73e8", flexShrink: 0 }} />
                              )}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal footer */}
              <div style={{ padding: "14px 24px 20px", display: "flex", justifyContent: "flex-end", gap: 10, borderTop: "1px solid #f1f3f4" }}>
                <button onClick={() => setModalProposal(null)}
                  style={{ padding: "9px 18px", fontSize: 14, fontWeight: 500, color: "#5f6368", background: "white", border: "1.5px solid #dadce0", borderRadius: 9, cursor: "pointer" }}
                  className="hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button onClick={handleAssign} disabled={submitting || !selectedLecturer}
                  style={{ padding: "9px 20px", fontSize: 14, fontWeight: 600, color: "white", background: (!selectedLecturer || submitting) ? "#8ab4f8" : "#1a73e8", border: "none", borderRadius: 9, cursor: (!selectedLecturer || submitting) ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 7 }}
                  className="hover:opacity-90 transition-opacity">
                  {submitting ? (<><Loader2 size={14} className="animate-spin" /> Assigning…</>) : "Confirm Assignment"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(-10px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </AdminLayout>
  )
}

export default AdminDashboard
