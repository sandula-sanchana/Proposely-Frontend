import { useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { CheckCircle, Circle, MessageSquare, FileText } from "lucide-react"
import StudentLayout from "../../components/StudentLayout"
import LoadingSpinner from "../../components/LoadingSpinner"
import StatusBadge from "../../components/StatusBadge"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import {
  fetchFeedback,
  resolveCommentThunk,
} from "../../store/slices/proposalSlice"
import type { ProposalComment, ProposalReview } from "../../types"

const ProposalFeedback = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { feedback, loading } = useAppSelector((s) => s.proposals)

  useEffect(() => {
    if (id) dispatch(fetchFeedback(id))
  }, [id, dispatch])

  const handleResolve = async (commentId: string) => {
    await dispatch(resolveCommentThunk(commentId)).unwrap()
  }

  if (loading || !feedback)
    return (
      <StudentLayout>
        <LoadingSpinner />
      </StudentLayout>
    )

  const {
    proposalStatus,
    latestVersion,
    currentVersionComments,
    currentVersionReviews,
    previousReviews,
  } = feedback

  return (
    <StudentLayout title="Proposal Feedback">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Status bar */}
        <div className="flex items-center justify-between bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">Current Status:</span>
            <StatusBadge status={proposalStatus} />
          </div>
          {latestVersion && (
            <span className="text-xs text-gray-400">
              Latest Version: v{latestVersion.versionNumber}
            </span>
          )}
          <button
            onClick={() => navigate("/student/dashboard")}
            className="text-sm text-indigo-600 hover:underline"
          >
            ← Back
          </button>
        </div>

        {/* Current version reviews */}
        {currentVersionReviews.length > 0 && (
          <section>
            <h3 className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <FileText size={16} /> Latest Review Decision
            </h3>
            {currentVersionReviews.map((review: ProposalReview) => (
              <div
                key={review._id}
                className={`rounded-xl border p-4 ${
                  review.decision === "APPROVED"
                    ? "border-green-200 bg-green-50"
                    : review.decision === "REJECTED"
                    ? "border-red-200 bg-red-50"
                    : "border-orange-200 bg-orange-50"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-sm">
                    {review.decision === "APPROVED"
                      ? "✅ Approved"
                      : review.decision === "REJECTED"
                      ? "❌ Rejected"
                      : "🔄 Changes Requested"}
                  </span>
                  <span className="text-xs text-gray-400">
                    by {(review.lecturer as any)?.name} ·{" "}
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{review.feedback}</p>
              </div>
            ))}
          </section>
        )}

        {/* Current version inline comments */}
        <section>
          <h3 className="text-base font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <MessageSquare size={16} /> Inline Comments (Current Version)
          </h3>
          {currentVersionComments.length === 0 ? (
            <p className="text-sm text-gray-400 py-4 text-center bg-white rounded-xl border border-dashed border-gray-200">
              No inline comments yet on the current version.
            </p>
          ) : (
            <div className="space-y-3">
              {currentVersionComments.map((comment: ProposalComment) => (
                <div
                  key={comment._id}
                  className={`bg-white rounded-xl border p-4 ${
                    comment.resolved
                      ? "border-green-200 opacity-70"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      {comment.selectedText && (
                        <blockquote className="text-xs italic text-gray-500 bg-yellow-50 border-l-4 border-yellow-400 pl-3 py-1 rounded mb-2">
                          "{comment.selectedText}"
                        </blockquote>
                      )}
                      <p className="text-sm text-gray-700">
                        {comment.commentText}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-gray-400">
                          by {(comment.lecturer as any)?.name} ·{" "}
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </span>
                        {comment.resolved && (
                          <span className="text-xs text-green-600 font-medium">
                            ✓ Resolved
                          </span>
                        )}
                      </div>
                    </div>
                    {!comment.resolved && (
                      <button
                        onClick={() => handleResolve(comment._id)}
                        className="flex items-center gap-1 text-xs px-3 py-1.5 border border-green-300 text-green-600 rounded-lg hover:bg-green-50 transition whitespace-nowrap"
                      >
                        <Circle size={12} /> Mark Resolved
                      </button>
                    )}
                    {comment.resolved && (
                      <CheckCircle size={18} className="text-green-500 shrink-0" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Previous version history */}
        {previousReviews.length > 0 && (
          <section>
            <h3 className="text-base font-semibold text-gray-400 mb-3">
              Previous Version History
            </h3>
            {previousReviews.map((review: ProposalReview) => (
              <div
                key={review._id}
                className="bg-gray-50 rounded-xl border border-gray-200 p-4 mb-2 opacity-70"
              >
                <span className="text-xs text-gray-500 font-medium">
                  v{(review.proposalVersion as any)?.versionNumber} ·{" "}
                  {review.decision} · by {(review.lecturer as any)?.name}
                </span>
                <p className="text-sm text-gray-600 mt-1">{review.feedback}</p>
              </div>
            ))}
          </section>
        )}
      </div>
    </StudentLayout>
  )
}

export default ProposalFeedback
