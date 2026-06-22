import api from "./api"

// POST /api/v1/proposals
export const createProposal = async (title: string, description: string) => {
  const res = await api.post("/proposals", { title, description })
  return res.data.data
}

// GET /api/v1/proposals/my
export const getMyProposals = async () => {
  const res = await api.get("/proposals/my")
  return res.data.data
}

// GET /api/v1/proposals/:id
export const getProposalById = async (id: string) => {
  const res = await api.get(`/proposals/${id}`)
  return res.data.data
}

// PATCH /api/v1/proposals/:id
export const updateProposal = async (
  id: string,
  title: string,
  description: string
) => {
  const res = await api.patch(`/proposals/${id}`, { title, description })
  return res.data.data
}

// POST /api/v1/proposals/:id/submit
export const submitProposal = async (id: string) => {
  const res = await api.post(`/proposals/${id}/submit`)
  return res.data.data
}

// GET /api/v1/proposals/:id/feedback
export const getProposalFeedback = async (id: string) => {
  const res = await api.get(`/proposals/${id}/feedback`)
  return res.data.data
}

// PATCH /api/v1/proposals/comments/:commentId/resolve
export const resolveComment = async (commentId: string) => {
  const res = await api.patch(`/proposals/comments/${commentId}/resolve`)
  return res.data.data
}
