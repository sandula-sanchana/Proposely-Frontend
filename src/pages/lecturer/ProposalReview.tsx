import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { MessageSquare, History, Send, Bot, CheckSquare } from "lucide-react"
import LecturerLayout from "../../components/LecturerLayout"
import StatusBadge from "../../components/StatusBadge"
import LoadingSpinner from "../../components/LoadingSpinner"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import {
  fetchVersions,
  fetchComments,
  addCommentThunk,
  reviewProposalThunk,
} from "../../store/slices/lecturerSlice"
import type { ProposalComment } from "../../types"

type Tab = "content" | "comments" | "versions" | "review"

const DECISIONS = [
  {
    value: "APPROVED",
    label: "✅ Approve",
    color: "bg-green-600 hover:bg-green-700",
  },
  {
    value: "CHANGES_REQUESTED",
    label: "🔄 Request Changes",
    color: "bg-orange-500 hover:bg-orange-600",
  },
  {
    value: "REJECTED",
    label: "❌ Reject",
    color: "bg-red-600 hover:bg-red-700",
  },
]

const ProposalReview = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { assignedProposals, versions, comments, submitting, loading } =
    useAppSelector((s) => s.lecturer)

  const proposal = assignedProposals.find((p) => p._id === id)

  const [tab, setTab] = useState<Tab>("content")
  const [reviewDecision, setReviewDecision] = useState("")
  const [reviewFeedback, setReviewFeedback] = useState("")
  const [reviewError, setReviewError] = useState("")
  const [reviewSuccess, setReviewSuccess] = useState("")

  const contentRef = useRef<HTMLDivElement>(null)
  const [selection, setSelection] = useState<{
    text: string
    startIndex: number
    endIndex: number
  } | null>(null)
  const [showCommentBox, setShowCommentBox] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [floatPos, setFloatPos] = useState({ x: 0, y: 0 })

  useEffect(() => {
    if (id) {
      dispatch(fetchVersions(id))
      dispatch(fetchComments(id))
    }
  }, [id, dispatch])

  const handleMouseUp = () => {
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0 || sel.toString().trim() === "") {
      setSelection(null)
      setShowCommentBox(false)
      return
    }
    const range = sel.getRangeAt(0)
    const selectedText = sel.toString().trim()

    if (!contentRef.current) return

    const preSelRange = range.cloneRange()
    preSelRange.selectNodeContents(contentRef.current)
    preSelRange.setEnd(range.startContainer, range.startOffset)
    const startIndex = preSelRange.toString().length
    const endIndex = startIndex + selectedText.length

    setSelection({ text: selectedText, startIndex, endIndex })

    const rect = range.getBoundingClientRect()
    const containerRect = contentRef.current.getBoundingClientRect()
    setFloatPos({
      x: rect.left - containerRect.left,
      y: rect.top - containerRect.top - 40,
    })
    setShowCommentBox(false)
  }

  const handleAddComment = async () => {
    if (!commentText.trim()) return
    await dispatch(
      addCommentThunk({
        id: id!,
        commentText,
        selectedText: selection?.text,
        startIndex: selection?.startIndex,
        endIndex: selection?.endIndex,
      })
    ).unwrap()
    setCommentText("")
    setSelection(null)
    setShowCommentBox(false)
    window.getSelection()?.removeAllRanges()
  }

  const handleReview = async () => {
    if (!reviewDecision) {
      setReviewError("Please select a decision")
      return
    }
    if (!reviewFeedback.trim()) {
      setReviewError("Please provide feedback")
      return
    }
    try {
      setReviewError("")
      await dispatch(
        reviewProposalThunk({
          id: id!,
          decision: reviewDecision,
          feedback: reviewFeedback,
        })
      ).unwrap()
      setReviewSuccess("Review submitted successfully!")
      setTimeout(() => navigate("/lecturer/dashboard"), 1500)
    } catch (err: any) {
      setReviewError(err || "Failed to submit review")
    }
  }

  const content =
    versions?.versions?.[versions.versions.length - 1]?.content ||
    proposal?.description ||
    ""

  const TABS: { key: Tab; label: string }[] = [
    { key: "content", label: "Content" },
    { key: "comments", label: `Comments (${comments.length})` },
    { key: "versions", label: "Versions" },
    { key: "review", label: "Submit Review" },
  ]

  return (
    <LecturerLayout title="Review Proposal">
      <div className="max-w-5xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-start justify-between bg-white rounded-xl border border-gray-200 p-5">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {proposal?.title || "Loading…"}
            </h2>
            <div className="flex items-center gap-3 mt-2">
              {proposal && <StatusBadge status={proposal.status} />}
              {proposal?.student && (
                <span className="text-sm text-gray-500">
                  Student: {(proposal.student as any).name}
                </span>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate(`/lecturer/proposals/${id}/ai-review`)}
              className="flex items-center gap-2 px-3 py-2 text-sm border border-purple-300 text-purple-600 rounded-lg hover:bg-purple-50"
            >
              <Bot size={15} /> AI Review
            </button>
            <button
              onClick={() => navigate("/lecturer/dashboard")}
              className="text-sm text-gray-500 hover:underline px-2"
            >
              ← Back
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 bg-white rounded-t-xl px-4 overflow-x-auto">
          {TABS.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap ${
                tab === key
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab: Content */}
        {tab === "content" && (
          <div className="bg-white rounded-b-xl border border-t-0 border-gray-200 p-5">
            <p className="text-xs text-gray-400 mb-3 italic">
              💡 Select any text below, then click "Add Comment" to leave an
              inline comment.
            </p>
            <div className="relative">
              <div
                ref={contentRef}
                onMouseUp={handleMouseUp}
                className="whitespace-pre-wrap text-sm text-gray-700 leading-relaxed p-4 bg-gray-50 rounded-lg border border-gray-200 min-h-64 select-text cursor-text font-mono"
              >
                {content || "No content yet"}
              </div>

              {selection && !showCommentBox && (
                <button
                  style={{
                    position: "absolute",
                    left: floatPos.x,
                    top: floatPos.y,
                  }}
                  onClick={() => setShowCommentBox(true)}
                  className="bg-indigo-600 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg hover:bg-indigo-700 transition z-10"
                >
                  + Add Comment
                </button>
              )}
            </div>

            {showCommentBox && selection && (
              <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
                <p className="text-xs text-indigo-600 mb-2 font-medium">
                  Commenting on: "
                  {selection.text.slice(0, 80)}
                  {selection.text.length > 80 ? "…" : ""}"
                </p>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Write your comment…"
                  rows={3}
                  className="w-full px-3 py-2 text-sm border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => {
                      setShowCommentBox(false)
                      setSelection(null)
                    }}
                    className="text-xs px-3 py-1.5 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddComment}
                    disabled={submitting || !commentText.trim()}
                    className="flex items-center gap-1.5 text-xs px-4 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                  >
                    <Send size={12} />{" "}
                    {submitting ? "Sending…" : "Submit Comment"}
                  </button>
                </div>
              </div>
            )}

            {!selection && (
              <div className="mt-4">
                <p className="text-xs text-gray-400 mb-2">
                  Or add a general comment (no text selected):
                </p>
                <div className="flex gap-2">
                  <input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a general comment…"
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                  <button
                    onClick={() => handleAddComment()}
                    disabled={submitting || !commentText.trim()}
                    className="flex items-center gap-1.5 px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                  >
                    <Send size={14} /> Send
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Comments */}
        {tab === "comments" && (
          <div className="bg-white rounded-b-xl border border-t-0 border-gray-200 p-5">
            {loading && <LoadingSpinner />}
            {!loading && comments.length === 0 && (
              <p className="text-center text-gray-400 py-8">No comments yet.</p>
            )}
            <div className="space-y-3">
              {comments.map((comment: ProposalComment) => (
                <div
                  key={comment._id}
                  className={`rounded-xl border p-4 ${
                    comment.resolved
                      ? "border-green-200 bg-green-50"
                      : "border-gray-200"
                  }`}
                >
                  {comment.selectedText && (
                    <blockquote className="text-xs italic bg-yellow-50 border-l-4 border-yellow-400 pl-3 py-1 rounded mb-2 text-gray-500">
                      "{comment.selectedText}"
                    </blockquote>
                  )}
                  <p className="text-sm text-gray-700">{comment.commentText}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400">
                      v{(comment.proposalVersion as any)?.versionNumber || "?"}{" "}
                      · {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                    {comment.resolved && (
                      <span className="text-xs text-green-600">
                        ✓ Resolved by student
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Versions */}
        {tab === "versions" && (
          <div className="bg-white rounded-b-xl border border-t-0 border-gray-200 p-5">
            {!versions ? (
              <LoadingSpinner />
            ) : versions.versions?.length === 0 ? (
              <p className="text-center text-gray-400 py-8">
                No versions submitted yet.
              </p>
            ) : (
              <div className="space-y-4">
                {[...(versions.versions || [])].reverse().map((v: any) => (
                  <div
                    key={v._id}
                    className="border border-gray-200 rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-semibold text-gray-700">
                        Version {v.versionNumber}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(v.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <pre className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg overflow-auto max-h-48 whitespace-pre-wrap">
                      {v.content}
                    </pre>
                    <p className="text-xs text-gray-400 mt-2">
                      Hash:{" "}
                      <code className="bg-gray-100 px-1 rounded">
                        {v.contentHash?.slice(0, 12)}…
                      </code>
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Submit Review */}
        {tab === "review" && (
          <div className="bg-white rounded-b-xl border border-t-0 border-gray-200 p-5 space-y-4">
            {reviewSuccess && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                {reviewSuccess}
              </div>
            )}
            {reviewError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {reviewError}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Decision
              </label>
              <div className="flex gap-3 flex-wrap">
                {DECISIONS.map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setReviewDecision(value)}
                    className={`px-4 py-2 text-sm rounded-lg border-2 font-medium transition ${
                      reviewDecision === value
                        ? "border-indigo-600 bg-indigo-50 text-indigo-700"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Feedback
              </label>
              <textarea
                value={reviewFeedback}
                onChange={(e) => setReviewFeedback(e.target.value)}
                rows={5}
                placeholder="Provide detailed feedback for the student…"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleReview}
                disabled={submitting}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition disabled:opacity-50"
              >
                {submitting ? "Submitting…" : "Submit Review"}
              </button>
            </div>
          </div>
        )}
      </div>
    </LecturerLayout>
  )
}

export default ProposalReview
