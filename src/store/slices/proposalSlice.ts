import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { Proposal, ProposalFeedbackData } from "../../types"
import * as studentService from "../../service/studentService"

interface ProposalState {
  proposals: Proposal[]
  selectedProposal: Proposal | null
  feedback: ProposalFeedbackData | null
  loading: boolean
  error: string | null
}

const initialState: ProposalState = {
  proposals: [],
  selectedProposal: null,
  feedback: null,
  loading: false,
  error: null,
}

export const fetchMyProposals = createAsyncThunk(
  "proposals/fetchMy",
  async (_, { rejectWithValue }) => {
    try {
      return await studentService.getMyProposals()
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || "Failed to fetch proposals")
    }
  }
)

export const fetchProposalById = createAsyncThunk(
  "proposals/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      return await studentService.getProposalById(id)
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || "Failed to fetch proposal")
    }
  }
)

export const createProposalThunk = createAsyncThunk(
  "proposals/create",
  async ({ title, description }: { title: string; description: string }, { rejectWithValue }) => {
    try {
      return await studentService.createProposal(title, description)
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || "Failed to create proposal")
    }
  }
)

export const updateProposalThunk = createAsyncThunk(
  "proposals/update",
  async ({ id, title, description }: { id: string; title: string; description: string }, { rejectWithValue }) => {
    try {
      return await studentService.updateProposal(id, title, description)
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || "Failed to update proposal")
    }
  }
)

export const submitProposalThunk = createAsyncThunk(
  "proposals/submit",
  async (id: string, { rejectWithValue }) => {
    try {
      return await studentService.submitProposal(id)
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || "Failed to submit proposal")
    }
  }
)

export const fetchFeedback = createAsyncThunk(
  "proposals/fetchFeedback",
  async (id: string, { rejectWithValue }) => {
    try {
      return await studentService.getProposalFeedback(id)
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || "Failed to fetch feedback")
    }
  }
)

export const resolveCommentThunk = createAsyncThunk(
  "proposals/resolveComment",
  async (commentId: string, { rejectWithValue }) => {
    try {
      return await studentService.resolveComment(commentId)
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || "Failed to resolve comment")
    }
  }
)

const proposalSlice = createSlice({
  name: "proposals",
  initialState,
  reducers: {
    clearSelectedProposal: (state) => {
      state.selectedProposal = null
    },
    clearFeedback: (state) => {
      state.feedback = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    const setLoading = (state: ProposalState) => {
      state.loading = true
      state.error = null
    }
    const setError = (state: ProposalState, action: any) => {
      state.loading = false
      state.error = action.payload
    }

    builder
      .addCase(fetchMyProposals.pending, setLoading)
      .addCase(fetchMyProposals.fulfilled, (state, action) => {
        state.loading = false
        state.proposals = action.payload
      })
      .addCase(fetchMyProposals.rejected, setError)
      .addCase(fetchProposalById.pending, setLoading)
      .addCase(fetchProposalById.fulfilled, (state, action) => {
        state.loading = false
        state.selectedProposal = action.payload
      })
      .addCase(fetchProposalById.rejected, setError)
      .addCase(createProposalThunk.pending, setLoading)
      .addCase(createProposalThunk.fulfilled, (state, action) => {
        state.loading = false
        state.proposals.unshift(action.payload)
      })
      .addCase(createProposalThunk.rejected, setError)
      .addCase(updateProposalThunk.pending, setLoading)
      .addCase(updateProposalThunk.fulfilled, (state, action) => {
        state.loading = false
        const idx = state.proposals.findIndex((p) => p._id === action.payload._id)
        if (idx !== -1) state.proposals[idx] = action.payload
        if (state.selectedProposal?._id === action.payload._id) {
          state.selectedProposal = action.payload
        }
      })
      .addCase(updateProposalThunk.rejected, setError)
      .addCase(submitProposalThunk.pending, setLoading)
      .addCase(submitProposalThunk.fulfilled, (state, action) => {
        state.loading = false
        const updated = action.payload.proposal
        if (updated) {
          const idx = state.proposals.findIndex((p) => p._id === updated._id)
          if (idx !== -1) state.proposals[idx] = updated
        }
      })
      .addCase(submitProposalThunk.rejected, setError)
      .addCase(fetchFeedback.pending, setLoading)
      .addCase(fetchFeedback.fulfilled, (state, action) => {
        state.loading = false
        state.feedback = action.payload
      })
      .addCase(fetchFeedback.rejected, setError)
      .addCase(resolveCommentThunk.fulfilled, (state, action) => {
        if (state.feedback) {
          const commentId = action.payload._id
          const updateArr = (arr: any[]) =>
            arr.map((c) => (c._id === commentId ? { ...c, resolved: true } : c))
          state.feedback.currentVersionComments = updateArr(
            state.feedback.currentVersionComments
          )
          state.feedback.allComments = updateArr(state.feedback.allComments)
        }
      })
  },
})

export const { clearSelectedProposal, clearFeedback, clearError } = proposalSlice.actions
export default proposalSlice.reducer
