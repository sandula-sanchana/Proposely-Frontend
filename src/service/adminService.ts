import api from "./api"

// GET /api/v1/admin/proposals  (only SUBMITTED proposals)
export const getAllSubmittedProposals = async () => {
  const res = await api.get("/admin/proposals")
  return res.data.data
}

// PATCH /api/v1/admin/proposals/:id/assign
export const assignLecturer = async (proposalId: string, lecturerId: string) => {
  const res = await api.patch(`/admin/proposals/${proposalId}/assign`, {
    lecturerId,
  })
  return res.data.data
}

// GET /api/v1/admin/lecturers  — fetch all users with LECTURER role
export const getLecturers = async () => {
  const res = await api.get("/admin/lecturers")
  return res.data.data as { _id: string; name: string; email: string }[]
}
