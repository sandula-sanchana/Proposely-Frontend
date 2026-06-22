import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import MDEditor from "@uiw/react-md-editor"
import StudentLayout from "../../components/StudentLayout"
import LoadingSpinner from "../../components/LoadingSpinner"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import {
  fetchProposalById,
  updateProposalThunk,
  submitProposalThunk,
} from "../../store/slices/proposalSlice"

const EditProposal = () => {
  const { id } = useParams<{ id: string }>()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { selectedProposal, loading } = useAppSelector((s) => s.proposals)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState<string>("")
  const [localError, setLocalError] = useState("")

  useEffect(() => {
    if (id) dispatch(fetchProposalById(id))
  }, [id, dispatch])

  useEffect(() => {
    if (selectedProposal) {
      setTitle(selectedProposal.title)
      setDescription(selectedProposal.description)
    }
  }, [selectedProposal])

  const canEdit =
    selectedProposal?.status === "DRAFT" ||
    selectedProposal?.status === "CHANGES_REQUESTED"

  const handleUpdate = async () => {
    if (!title.trim() || !description.trim()) {
      setLocalError("Title and content are required")
      return
    }
    try {
      setLocalError("")
      await dispatch(
        updateProposalThunk({ id: id!, title, description })
      ).unwrap()
      navigate("/student/dashboard")
    } catch (err: any) {
      setLocalError(err || "Failed to update")
    }
  }

  const handleUpdateAndSubmit = async () => {
    if (!title.trim() || !description.trim()) {
      setLocalError("Title and content are required")
      return
    }
    try {
      setLocalError("")
      await dispatch(
        updateProposalThunk({ id: id!, title, description })
      ).unwrap()
      await dispatch(submitProposalThunk(id!)).unwrap()
      navigate("/student/dashboard")
    } catch (err: any) {
      setLocalError(err || "Failed to update and submit")
    }
  }

  if (loading && !selectedProposal)
    return (
      <StudentLayout>
        <LoadingSpinner />
      </StudentLayout>
    )

  if (!canEdit && selectedProposal) {
    return (
      <StudentLayout title="Edit Proposal">
        <div className="max-w-2xl mx-auto mt-12 text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">
            Proposal cannot be edited
          </h2>
          <p className="text-gray-500">
            Only proposals in <strong>DRAFT</strong> or{" "}
            <strong>CHANGES_REQUESTED</strong> status can be edited.
          </p>
          <button
            onClick={() => navigate("/student/dashboard")}
            className="mt-5 px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Back to Dashboard
          </button>
        </div>
      </StudentLayout>
    )
  }

  return (
    <StudentLayout title="Edit Proposal">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Edit Proposal
        </h2>

        {localError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {localError}
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div data-color-mode="light">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Content <span className="text-red-500">*</span>
            </label>
            <MDEditor
              value={description}
              onChange={(val) => setDescription(val || "")}
              height={400}
              preview="live"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => navigate("/student/dashboard")}
              className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="px-4 py-2 text-sm border border-indigo-300 text-indigo-600 rounded-lg hover:bg-indigo-50 disabled:opacity-50"
            >
              {loading ? "Saving…" : "Save Changes"}
            </button>
            <button
              onClick={handleUpdateAndSubmit}
              disabled={loading}
              className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50"
            >
              {loading ? "Submitting…" : "Save & Submit"}
            </button>
          </div>
        </div>
      </div>
    </StudentLayout>
  )
}

export default EditProposal
