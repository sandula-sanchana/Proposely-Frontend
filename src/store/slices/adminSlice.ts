import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import type { Proposal } from "../../types"
import * as adminService from "../../service/adminService"

export interface LecturerOption {
  _id: string
  name: string
  email: string
}

interface AdminState {
  submittedProposals: Proposal[]
  lecturers: LecturerOption[]
  loading: boolean
  lecturersLoading: boolean
  submitting: boolean
  error: string | null
}

const initialState: AdminState = {
  submittedProposals: [],
  lecturers: [],
  loading: false,
  lecturersLoading: false,
  submitting: false,
  error: null,
}

export const fetchSubmittedProposals = createAsyncThunk(
  "admin/fetchSubmitted",
  async (_, { rejectWithValue }) => {
    try {
      return await adminService.getAllSubmittedProposals()
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || "Failed to load proposals")
    }
  }
)

export const fetchLecturers = createAsyncThunk(
  "admin/fetchLecturers",
  async (_, { rejectWithValue }) => {
    try {
      return await adminService.getLecturers()
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || "Failed to load lecturers")
    }
  }
)

export const assignLecturerThunk = createAsyncThunk(
  "admin/assignLecturer",
  async (
    { proposalId, lecturerId }: { proposalId: string; lecturerId: string },
    { rejectWithValue }
  ) => {
    try {
      return await adminService.assignLecturer(proposalId, lecturerId)
    } catch (e: any) {
      return rejectWithValue(e.response?.data?.message || "Failed to assign lecturer")
    }
  }
)

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubmittedProposals.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchSubmittedProposals.fulfilled, (state, action) => {
        state.loading = false
        state.submittedProposals = action.payload
      })
      .addCase(fetchSubmittedProposals.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(fetchLecturers.pending, (state) => {
        state.lecturersLoading = true
      })
      .addCase(fetchLecturers.fulfilled, (state, action) => {
        state.lecturersLoading = false
        state.lecturers = action.payload
      })
      .addCase(fetchLecturers.rejected, (state) => {
        state.lecturersLoading = false
      })
      .addCase(assignLecturerThunk.pending, (state) => {
        state.submitting = true
      })
      .addCase(assignLecturerThunk.fulfilled, (state, action) => {
        state.submitting = false
        // Remove the proposal from admin list (it's now ASSIGNED, not SUBMITTED)
        state.submittedProposals = state.submittedProposals.filter(
          (p) => p._id !== action.payload._id
        )
      })
      .addCase(assignLecturerThunk.rejected, (state, action) => {
        state.submitting = false
        state.error = action.payload as string
      })
  },
})

export const { clearAdminError } = adminSlice.actions
export default adminSlice.reducer
