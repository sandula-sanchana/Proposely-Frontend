import api from "./api"

// GET /api/v1/lecturer/proposals/my
export const getMyAssignedProposals = async () => {
  const res = await api.get("/lecturer/proposals/my")
  return res.data.data
}

// GET /api/v1/lecturer/proposals/:id/versions
export const getProposalVersions = async (id: string) => {
  const res = await api.get(`/lecturer/proposals/${id}/versions`)
  return res.data.data
}

// GET /api/v1/lecturer/proposals/:id/comments
export const getProposalComments = async (id: string) => {
  const res = await api.get(`/lecturer/proposals/${id}/comments`)
  return res.data.data
}

// POST /api/v1/lecturer/proposals/:id/comments
export const addProposalComment = async (
  id: string,
  commentText: string,
  selectedText?: string,
  startIndex?: number,
  endIndex?: number
) => {
  const res = await api.post(`/lecturer/proposals/${id}/comments`, {
    commentText,
    selectedText,
    startIndex,
    endIndex,
  })
  return res.data.data
}

// PATCH /api/v1/lecturer/proposals/:id/review
export const reviewProposal = async (
  id: string,
  decision: string,
  feedback: string
) => {
  const res = await api.patch(`/lecturer/proposals/${id}/review`, {
    decision,
    feedback,
  })
  return res.data.data
}

// POST /api/v1/lecturer/proposals/:id/ai-review
export const generateAIReview = async (id: string) => {
  const res = await api.post(`/lecturer/proposals/${id}/ai-review`)
  return res.data.data
}

// GET /api/v1/lecturer/proposals/:id/ai-reviews
export const getAIReviewHistory = async (id: string) => {
  const res = await api.get(`/lecturer/proposals/${id}/ai-reviews`)
  return res.data.data
}
