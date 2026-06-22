import { useState } from "react"
import { useNavigate } from "react-router-dom"
import MDEditor from "@uiw/react-md-editor"
import StudentLayout from "../../components/StudentLayout"
import { useAppDispatch, useAppSelector } from "../../store/hooks"
import {
  createProposalThunk,
  submitProposalThunk,
} from "../../store/slices/proposalSlice"

const CreateProposal = () => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState<string>("")
  const [localError, setLocalError] = useState("")
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { loading } = useAppSelector((s) => s.proposals)

  const handleSaveDraft = async () => {
    if (!title.trim()) {
      setLocalError("Title is required")
      return
    }
    if (!description.trim()) {
      setLocalError("Proposal content is required")
      return
    }
    try {
      setLocalError("")
      await dispatch(createProposalThunk({ title, description })).unwrap()
      navigate("/student/dashboard")
    } catch (err: any) {
      setLocalError(err || "Failed to save draft")
    }
  }

  const handleSaveAndSubmit = async () => {
    if (!title.trim()) {
      setLocalError("Title is required")
      return
    }
    if (!description.trim()) {
      setLocalError("Proposal content is required")
      return
    }
    try {
      setLocalError("")
      const created = await dispatch(
        createProposalThunk({ title, description })
      ).unwrap()
      await dispatch(submitProposalThunk(created._id)).unwrap()
      navigate("/student/dashboard")
    } catch (err: any) {
      setLocalError(err || "Failed to create & submit")
    }
  }

  return (
    <StudentLayout title="New Proposal">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Create New Proposal
        </h2>

        {localError && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {localError}
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Proposal Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a clear, descriptive title…"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div data-color-mode="light">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Proposal Content <span className="text-red-500">*</span>
              <span className="ml-2 text-xs text-gray-400 font-normal">
                Supports Markdown
              </span>
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
              className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveDraft}
              disabled={loading}
              className="px-4 py-2 text-sm border border-indigo-300 text-indigo-600 rounded-lg hover:bg-indigo-50 transition disabled:opacity-50"
            >
              {loading ? "Saving…" : "Save as Draft"}
            </button>
            <button
              onClick={handleSaveAndSubmit}
              disabled={loading}
              className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Submitting…" : "Save & Submit"}
            </button>
          </div>
        </div>
      </div>
    </StudentLayout>
  )
}

export default CreateProposal
