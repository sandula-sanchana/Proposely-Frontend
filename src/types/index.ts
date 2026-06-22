// ─── Users ───────────────────────────────────────────────────
export type UserRole = "ADMIN" | "STUDENT" | "LECTURER";
export type AuthProvider = "LOCAL" | "GOOGLE";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  authProvider: AuthProvider;
}

// ─── Proposals ───────────────────────────────────────────────
export type ProposalStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "ASSIGNED"
  | "CHANGES_REQUESTED"
  | "APPROVED"
  | "REJECTED";

export interface ProposalVersion {
  _id: string;
  proposal: string;
  versionNumber: number;
  content: string;
  contentHash: string;
  submittedBy: Partial<User>;
  locked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Proposal {
  _id: string;
  title: string;
  description: string;
  student: Partial<User>;
  assignedLecturer?: Partial<User>;
  status: ProposalStatus;
  latestVersion?: ProposalVersion;
  createdAt: string;
  updatedAt: string;
}

// ─── Comments ─────────────────────────────────────────────────
export interface ProposalComment {
  _id: string;
  proposal: string;
  proposalVersion: Partial<ProposalVersion>;
  lecturer: Partial<User>;
  commentText: string;
  selectedText?: string;
  startIndex?: number;
  endIndex?: number;
  resolved: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Reviews ──────────────────────────────────────────────────
export type ReviewDecision = "APPROVED" | "REJECTED" | "CHANGES_REQUESTED";

export interface ProposalReview {
  _id: string;
  proposal: string;
  proposalVersion: Partial<ProposalVersion>;
  lecturer: Partial<User>;
  decision: ReviewDecision;
  feedback: string;
  createdAt: string;
  updatedAt: string;
}

// ─── AI Reviews ───────────────────────────────────────────────
export type AISuggestedDecision = "APPROVED" | "CHANGES_REQUESTED" | "REJECTED" | "UNKNOWN";
export type AIConfidenceLevel = "HIGH" | "MEDIUM" | "LOW" | "UNKNOWN";

export interface ProposalAIReview {
  _id: string;
  proposal: string;
  previousVersion: Partial<ProposalVersion>;
  latestVersion: Partial<ProposalVersion>;
  lecturer: Partial<User>;
  aiReviewText: string;
  suggestedDecision: AISuggestedDecision;
  confidenceLevel: AIConfidenceLevel;
  createdAt: string;
  updatedAt: string;
}

// ─── Feedback bundle (student view) ───────────────────────────
export interface ProposalFeedbackData {
  proposalStatus: ProposalStatus;
  latestVersion: ProposalVersion | null;
  currentVersionComments: ProposalComment[];
  previousVersionComments: ProposalComment[];
  currentVersionReviews: ProposalReview[];
  previousReviews: ProposalReview[];
  allComments: ProposalComment[];
  allReviews: ProposalReview[];
}
