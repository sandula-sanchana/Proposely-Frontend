import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Bot, RefreshCw, ChevronDown, ChevronUp } from "lucide-react"
import LecturerLayout from "../../components/LecturerLayout"
import LoadingSpinner from "../../components/LoadingSpinner"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import {
  fetchAIReviews,
  generateAIReviewThunk,
} from "../../store/slices/lecturerSlice"
import type { ProposalAIReview } from "../../types"

const confidenceColor: Record<string, string> = {
  HIGH: "text-green-600 bg-green-50",
  MEDIUM: "text-yellow-600 bg-yellow-50",
  LOW: "text-red-600 bg-red-50",
  UNKNOWN: "text-gray-500 bg-gray-50",
}

const AIReviewPage = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { aiReviews, submitting, loading } = useAppSelector((s) => s.lecturer)
  const [error, setError] = useState("")
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    if (id) dispatch(fetchAIReviews(id))
  }, [id, dispatch])

  const handleGenerate = async () => {
    try {
      setError("")
      await dispatch(generateAIReviewThunk(id!)).unwrap()
    } catch (err: any) {
      setError(
        err ||
          "Failed to generate AI review. (Requires at least 2 proposal versions.)"
      )
    }
  }

  return (
    <LecturerLayout title="AI Review">
      <div className="max-w-4xl mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Bot size={22} className="text-purple-600" /> AI Review History
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              AI analyzes changes between versions and suggests a review
              decision.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleGenerate}
              disabled={submitting}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition disabled:opacity-50"
            >
              <RefreshCw
                size={14}
                className={submitting ? "animate-spin" : ""}
              />
              {submitting ? "Generating…" : "Generate New Review"}
            </button>
            <button
              onClick={() => navigate(`/lecturer/proposals/${id}`)}
              className="text-sm text-gray-500 hover:underline px-2"
            >
              ← Back
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="text-xs text-gray-400 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          ⚠️ AI review requires <strong>at least 2 submitted versions</strong>{" "}
          to compare changes.
        </div>

        {loading && <LoadingSpinner />}
        {!loading && aiReviews.length === 0 && (
          <div className="text-center py-14 bg-white rounded-xl border border-dashed border-gray-200">
            <Bot size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No AI reviews generated yet.</p>
          </div>
        )}

        <div className="space-y-3">
          {aiReviews.map((review: ProposalAIReview) => (
            <div
              key={review._id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                onClick={() =>
                  setExpanded(expanded === review._id ? null : review._id)
                }
              >
                <div className="flex items-center gap-4">
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">
                      v{(review.previousVersion as any)?.versionNumber} → v
                      {(review.latestVersion as any)?.versionNumber}
                    </span>
                    <span className="text-gray-400 ml-3 text-xs">
                      {new Date(review.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                      confidenceColor[review.confidenceLevel]
                    }`}
                  >
                    Confidence: {review.confidenceLevel}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                      review.suggestedDecision === "APPROVED"
                        ? "bg-green-100 text-green-700"
                        : review.suggestedDecision === "REJECTED"
                        ? "bg-red-100 text-red-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {review.suggestedDecision}
                  </span>
                </div>
                {expanded === review._id ? (
                  <ChevronUp size={16} />
                ) : (
                  <ChevronDown size={16} />
                )}
              </div>
              {expanded === review._id && (
                <div className="px-5 pb-5 border-t border-gray-100">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed mt-4 font-sans">
                    {review.aiReviewText}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </LecturerLayout>
  )
}

export default AIReviewPage
