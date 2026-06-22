import type { ProposalStatus } from "../types"

const statusConfig: Record<ProposalStatus, { label: string; classes: string }> = {
  DRAFT: { label: "Draft", classes: "bg-gray-100 text-gray-600" },
  SUBMITTED: { label: "Submitted", classes: "bg-blue-50 text-blue-700" },
  ASSIGNED: { label: "Assigned", classes: "bg-amber-50 text-amber-700" },
  CHANGES_REQUESTED: { label: "Changes Requested", classes: "bg-orange-50 text-orange-700" },
  APPROVED: { label: "Approved", classes: "bg-green-50 text-green-700" },
  REJECTED: { label: "Rejected", classes: "bg-red-50 text-red-700" },
}

const StatusBadge = ({ status }: { status: ProposalStatus }) => {
  const config = statusConfig[status] ?? {
    label: status,
    classes: "bg-gray-100 text-gray-600",
  }
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium tracking-wide ${config.classes}`}
    >
      {config.label}
    </span>
  )
}

export default StatusBadge
