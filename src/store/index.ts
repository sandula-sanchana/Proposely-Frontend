import { configureStore } from "@reduxjs/toolkit"
import proposalReducer from "./slices/proposalSlice"
import lecturerReducer from "./slices/lecturerSlice"
import adminReducer from "./slices/adminSlice"

export const store = configureStore({
  reducer: {
    proposals: proposalReducer,
    lecturer: lecturerReducer,
    admin: adminReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
