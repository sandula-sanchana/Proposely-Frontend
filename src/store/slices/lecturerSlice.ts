import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { Proposal, ProposalComment, ProposalAIReview } from "../../types"
import * as lecturerService from "../../service/lecturerService"

interface LecturerState {
  assignedProposals: Proposal[]
  selectedProposal: Proposal | null
  versions: any
  comments: ProposalComment[]
  aiReviews: ProposalAIReview[]
  loading: boolean
  submitting: boolean
  error: string | null
}

const initialState: LecturerState = {
  assignedProposals: [],
  selectedProposal: null,
  versions: null,
  comments: [],
  aiReviews: [],
  loading: false,
  submitting: false,
  error: null,
}

export const fetchAssignedProposals = createAsyncThunk(
  "lecturer/fetchAssigned",
  async (_, { rejectWithValue }) => {
    try {
      return await lecturerService.getMyAssignedProposals()
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || "Failed to load proposals")
    }
  }
)

export const fetchVersions = createAsyncThunk(
  "lecturer/fetchVersions",
  async (id: string, { rejectWithValue }) => {
    try {
      return await lecturerService.getProposalVersions(id)
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || "Failed to load versions")
    }
  }
)

export const fetchComments = createAsyncThunk(
  "lecturer/fetchComments",
  async (id: string, { rejectWithValue }) => {
    try {
      return await lecturerService.getProposalComments(id)
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || "Failed to load comments")
    }
  }
)

export const addCommentThunk = createAsyncThunk(
  "lecturer/addComment",
  async (
    {
      id,
      commentText,
      selectedText,
      startIndex,
      endIndex,
    }: {
      id: string
      commentText: string
      selectedText?: string
      startIndex?: number
      endIndex?: number
    },
    { rejectWithValue }
  ) => {
    try {
      return await lecturerService.addProposalComment(
        id,
        commentText,
        selectedText,
        startIndex,
        endIndex
      )
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || "Failed to add comment")
    }
  }
)

export const reviewProposalThunk = createAsyncThunk(
  "lecturer/review",
  async (
    { id, decision, feedback }: { id: string; decision: string; feedback: string },
    { rejectWithValue }
  ) => {
    try {
      return await lecturerService.reviewProposal(id, decision, feedback)
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || "Failed to submit review")
    }
  }
)

export const generateAIReviewThunk = createAsyncThunk(
  "lecturer/generateAI",
  async (id: string, { rejectWithValue }) => {
    try {
      return await lecturerService.generateAIReview(id)
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || "Failed to generate AI review")
    }
  }
)

export const fetchAIReviews = createAsyncThunk(
  "lecturer/fetchAIReviews",
  async (id: string, { rejectWithValue }) => {
    try {
      return await lecturerService.getAIReviewHistory(id)
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || "Failed to load AI reviews")
    }
  }
)

const lecturerSlice = createSlice({
  name: "lecturer",
  initialState,
  reducers: {
    clearLecturerState: () => initialState,
    clearLecturerError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignedProposals.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchAssignedProposals.fulfilled, (state, action) => {
        state.loading = false
        state.assignedProposals = action.payload
      })
      .addCase(fetchAssignedProposals.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchVersions.fulfilled, (state, action) => {
        state.versions = action.payload
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments = action.payload
      })
      .addCase(addCommentThunk.pending, (state) => {
        state.submitting = true
      })
      .addCase(addCommentThunk.fulfilled, (state, action) => {
        state.submitting = false
        state.comments.push(action.payload)
      })
      .addCase(addCommentThunk.rejected, (state, action) => {
        state.submitting = false
        state.error = action.payload as string
      })
      .addCase(reviewProposalThunk.pending, (state) => {
        state.submitting = true
      })
      .addCase(reviewProposalThunk.fulfilled, (state, action) => {
        state.submitting = false
        const updated = action.payload.proposal
        if (updated) {
          const idx = state.assignedProposals.findIndex((p) => p._id === updated._id)
          if (idx !== -1) state.assignedProposals[idx] = updated
        }
      })
      .addCase(reviewProposalThunk.rejected, (state, action) => {
        state.submitting = false
        state.error = action.payload as string
      })
      .addCase(generateAIReviewThunk.pending, (state) => {
        state.submitting = true
      })
      .addCase(generateAIReviewThunk.fulfilled, (state, action) => {
        state.submitting = false
        if (action.payload?.aiReview) {
          state.aiReviews.unshift(action.payload.aiReview)
        }
      })
      .addCase(generateAIReviewThunk.rejected, (state, action) => {
        state.submitting = false
        state.error = action.payload as string
      })
      .addCase(fetchAIReviews.fulfilled, (state, action) => {
        state.aiReviews = action.payload
      })
  },
})

export const { clearLecturerState, clearLecturerError } = lecturerSlice.actions
export default lecturerSlice.reducer
