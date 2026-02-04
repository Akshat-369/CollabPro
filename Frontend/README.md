# CollabPro Frontend

CollabPro is a modern, comprehensive platform designed to connect workers/freelancers with project managers. This frontend application provides a rich interface for managing projects, applications, profiles, payments, and team collaboration.

## � Key Concept: Dynamic User Roles

Unlike traditional platforms where users are strictly "Freelancers" or "Clients", CollabPro features a **dynamic role system**:
- **Manager Mode:** When a user creates a project, they automatically become the **Manager** of that project. These appear in the "My Projects" tab.
- **Worker Mode:** The same user can apply to other projects. Once accepted as a member, these projects appear in the "Worker" tab.
- **Unified Profile:** A single user account handles both roles simultaneously, allowing seamless switching between managing their own projects and contributing to others.

## �🚀 Tech Stack

- **Core:** React 18, TypeScript
- **Build Tool:** Vite
- **Routing:** React Router DOM
- **Icons:** Lucide React
- **Styling:** CSS Modules / Styled Components (inferred structure)
- **State Management:** React Context API

## 📂 Project Structure

 The application follows a modular architecture located in `src/modules`, ensuring separation of concerns and scalability.

```
Frontend/
├── context/            # Global State (Project, Theme, User)
├── Data/               # Static data, mock data, and TS types
├── shared/             # Reusable components and utilities
│   ├── components/     # e.g., RichTextEditor
│   ├── ui/             # e.g., Button
│   └── utils/          # e.g., companyUtils (Logo fetching)
└── src/
    ├── modules/        # Feature-based groupings
    ├── layout/         # Global layout (Navbar, Footer)
    └── ...
```

## 📦 Modules & Features

### 1. Authentication (`/src/modules/auth`)
Handles user access.
- **Components:** `LoginForm`, `SignUpForm`
- **Pages:** `LoginPage`, `SignUpPage`

### 2. Landing Page (`/src/modules/landing`)
The public facing entry point.
- **Sections:** Hero banner, Categories, How It Works, Testimonials, and Trusted Companies.

### 3. Dashboard (`/src/modules/dashboard`)
The main hub for users after logging in, providing an overview of their activities.

### 4. Project Management (`/src/modules/projects`)
The core functionality for managing the project lifecycle.
- **Creation:** `CreateProjectPage`
- **Discovery:** `ApplyPage`, `ProjectDetailsPage`, `ApplyForm`
- **Management:** `ManageProjectsPage`, `ProjectDashboardPage`
- **Cards:** Specialized cards for Managers vs. Workers.

### 5. Browse Projects (`/src/modules/browse`)
Functionality for workers to explore available projects (`BrowsePage`, `ProjectCard`).

### 6. Candidates & Applications (`/src/modules/candidates`)
Tools for managers to review applications.
- **Features:** `ApplicationModal`, `CandidateCard`, `ProposalsTab`.

### 7. Task Management (`/src/modules/tasks`)
A collaborative Kanban-style board for tracking work.
- **Features:** `TaskBoard`, `Navigating Tasks`, `TaskDetailModal`.

### 8. User Profile (`/src/modules/profile`)
Comprehensive profile building for verifying credibility.
- **Sections:** Experience, Skills, Certifications, and About info.

### 9. Teams (`/src/modules/team`)
Management of project team members (`MembersTab`, `TeamMemberCard`).

### 10. Payments (`/src/modules/payments`)
Financial tracking interfaces for both outgoing (Manager) and incoming (Worker) payments.

## 🛠 Shared Resources

- **Contexts:**
  - `ProjectContext`: Project state and data.
  - `ThemeContext`: UI theme management.
  - `UserContext`: User authentication and profile state.
- **Utils:**
  - `companyUtils`: Helpers for fetching company logos and metadata.
- **Components:**
  - `RichTextEditor`: For rich content input in forms.

## 💻 Getting Started

### Prerequisites
- Node.js (Latest LTS recommended)
- npm or yarn

### Installation

1. Navigate to the frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## 📝 Configuration

- **Vite Config:** Located at `vite.config.ts`.
- **TypeScript:** Configured via `tsconfig.json`.

---
*Generated for CollabPro Local Environment*
