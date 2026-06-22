# Proposely — Frontend

> A smart academic research proposal management platform built for students, lecturers, and administrators.

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Redux](https://img.shields.io/badge/Redux_Toolkit-2.x-764ABC?logo=redux&logoColor=white)](https://redux-toolkit.js.org)

---

## 🌐 Live Demo

**Deployed URL:** [https://proposely-frontend.vercel.app/](https://proposely-frontend.vercel.app/)


---

## 📖 About

Proposely is a role-based proposal management web application designed for academic institutions. Students write and submit research proposals, lecturers review and provide feedback, and admins oversee the workflow by assigning proposals to lecturers. The system includes AI-assisted review capabilities powered by Google Gemini on the backend.

---

## ✨ Features

| Role | Capabilities |
|---|---|
| **Student** | Register & log in, create/edit proposals with a rich markdown editor, submit proposals for review, view lecturer feedback & resolve comments |
| **Lecturer** | View assigned proposals, add inline comments, trigger AI-assisted reviews, approve or reject proposals |
| **Admin** | View all submitted proposals, assign lecturers to proposals |

**Technical highlights:**
- Role-based protected routing (React Router v7)
- Global state management with Redux Toolkit (proposals, lecturer, admin slices)
- JWT authentication via `AuthContext` with localStorage hydration
- Code-split lazy loading for all page components
- Markdown proposal editor (`@uiw/react-md-editor`)
- Responsive UI with Tailwind CSS v4

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Language | TypeScript 6 |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 |
| State Management | Redux Toolkit + React-Redux |
| Routing | React Router DOM v7 |
| HTTP Client | Axios |
| Markdown Editor | @uiw/react-md-editor |
| Icons | Lucide React |

---

## 📁 Project Structure

```
src/
├── context/
│   └── AuthContext.tsx        # JWT auth context & user state
├── hooks/
│   └── useAuth.ts             # Auth hook
├── pages/
│   ├── Home.tsx               # Landing page with role-based redirect
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── student/
│   │   ├── StudentDashboard.tsx
│   │   ├── CreateProposal.tsx
│   │   ├── EditProposal.tsx
│   │   └── ProposalFeedback.tsx
│   ├── lecturer/
│   │   ├── LecturerDashboard.tsx
│   │   ├── ProposalReview.tsx
│   │   └── AIReviewPage.tsx
│   └── admin/
│       └── AdminDashboard.tsx
├── router/
│   └── index.tsx              # All routes + RequireAuth guard
├── store/
│   ├── index.ts               # Redux store config
│   └── slices/
│       ├── proposalSlice.ts
│       ├── lecturerSlice.ts
│       └── adminSlice.ts
└── main.tsx                   # App entry point
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- npm or yarn
- Proposely Backend running (see [Backend repo](https://github.com/sandula-sanchana/Proposely-Backend))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/sandula-sanchana/Proposely-Frontend.git
cd Proposely-Frontend

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env
# OR create it manually (see Environment Variables below)

# 4. Start the development server
npm run dev
```

The app will run at `http://localhost:5173`.

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

| Variable | Description | Example |
|---|---|---|
| `VITE_API_BASE_URL` | Base URL of the Proposely backend API | `http://localhost:5000/api/v1` |

> For production, point this to your deployed backend URL.

---

## 🗺️ Application Routes

| Path | Page | Access |
|---|---|---|
| `/` | Home / Landing | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/student/dashboard` | Student Dashboard | STUDENT only |
| `/student/create` | Create Proposal | STUDENT only |
| `/student/proposals/:id/edit` | Edit Proposal | STUDENT only |
| `/student/proposals/:id/feedback` | View Feedback | STUDENT only |
| `/lecturer/dashboard` | Lecturer Dashboard | LECTURER only |
| `/lecturer/proposals/:id` | Proposal Review | LECTURER only |
| `/lecturer/proposals/:id/ai-review` | AI Review | LECTURER only |
| `/admin/dashboard` | Admin Dashboard | ADMIN only |

---

## 🔐 Authentication Flow

1. User logs in → backend returns `{ token, user }` in the response body.
2. Token and user object are saved to `localStorage`.
3. `AuthContext` reads from `localStorage` on mount to hydrate state (no `/auth/me` call on load).
4. All protected routes are wrapped in a `RequireAuth` component that checks role.
5. On logout, `localStorage` is cleared and the user is redirected to `/login`.

---

## 🧱 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 🚢 Deployment (Vercel)

```bash
# Build the app
npm run build

# Deploy via Vercel CLI
npx vercel --prod
```

Or connect the GitHub repo directly to [vercel.com](https://vercel.com) and set the environment variable `VITE_API_BASE_URL` in the project settings.

---

## 🔗 Related

- [Proposely Backend](https://github.com/sandula-sanchana/Proposely-Backend) — Express 5 + MongoDB + JWT REST API
