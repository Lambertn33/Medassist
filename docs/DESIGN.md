# MedAssist – Consultation Overload Solution

### Senior Software Engineer Challenge – e-fiche

---

## 1. Problem Selection

Chosen Problem: **Problem 2 – Consultation Overload**

> Rural clinics often face consultation overload, where a limited number of nurses must attend to many patients, leading to inefficiency and burnout.  
> The goal is to create a system that helps streamline patient consultations and encounter recording, even in low-connectivity environments.

---

## 2. Problem Understanding

- **Context:** In many rural health facilities, nurses are responsible for multiple tasks—patient registration, vitals collection, diagnosis, and reporting.  
- **Core issue:** Data entry and patient follow-up are often manual or delayed, increasing waiting time and workload.  
- **Goal:** Build a solution that improves consultation flow and reduces redundancy while remaining simple enough for rural clinics.

---

## 3. Proposed Solution – MedAssist

**MedAssist** is a lightweight, modular **consultation assistant** designed to help nurses record and manage patient encounters efficiently, even with intermittent internet.

### Key Features
- Record and view **patients**, **encounters**, **observations**, **diagnoses**, and **treatments**.
- Track encounter progress via lifecycle statuses (`initialized`, `in_progress`, `completed`, `cancelled`).
- Operate with **offline-friendly design** (local caching + sync-ready backend).
- Built with a **modern full-stack architecture**:  
  Laravel (API) + Next.js (frontend) + Docker + GitHub Actions (CI/CD).

---

## 4. System Architecture

### Backend (Laravel 12)
- RESTful API built with Laravel, running in Docker (`backend/`).
- Models:
  - **User:** system users (nurse, doctor, admin)
  - **Patient:** patient demographic data
  - **Encounter:** one consultation session (ties nurse and patient)
  - **Observation:** vital signs (temperature, BP, HR, oxygen saturation)
  - **Diagnosis:** identified condition(s)
  - **Treatment:** prescribed medication/procedure/counseling
- API will be consumed by a React/Next.js frontend.

### Frontend (React + Vite + TypeScript)
- Modern single-page application (SPA) built with React 19 and TypeScript.
- Nurse dashboard to list patients and encounters.
- Forms for adding observations, diagnoses, and treatments.
- Uses REST API from the backend via Axios and React Query.
- Fully responsive design with mobile-first approach.

### Infrastructure
- **Docker Compose** orchestrates PHP, MySQL, and Node containers.
- **CI/CD** via GitHub Actions:
  - Runs migrations and PHPUnit tests on every Pull Request.
  - Enforces key generation and environment setup automatically.

---

## 5. Technical Stack

| Layer | Technology | Reason |
|--------|-------------|--------|
| **Backend** | Laravel 12 (PHP 8.3) | Robust API layer, expressive ORM, and queue-ready |
| **Database** | MySQL 8 | Familiar, simple to run in Docker |
| **Frontend** | React 19 + Vite + TypeScript | Fast development, excellent DX, modern tooling |
| **UI Framework** | Tailwind CSS 4 | Utility-first CSS, rapid UI development |
| **State Management** | React Query (TanStack Query) | Server state management, caching, synchronization |
| **Routing** | React Router 7 | Client-side routing with protected routes |
| **HTTP Client** | Axios | Promise-based HTTP requests |
| **Icons** | React Icons | Comprehensive icon library |
| **Auth** | Laravel Sanctum | Token-based authentication for APIs |
| **Containerization** | Docker + Docker Compose | Reproducible environment |
| **CI/CD** | GitHub Actions | Automatic testing on PRs |
| **PM Tool** | GitHub Projects | Task and progress tracking |

---

## 6. Data Model Overview

### Entity Relationships

```
User (nurse, doctor, admin)
 └── hasMany → Encounter
Encounter
 ├── belongsTo → User
 ├── belongsTo → Patient
 ├── hasMany → Observation
 ├── hasMany → Diagnosis
 └── hasMany → Treatment
Patient
 └── hasMany → Encounter
```

### Encounter Lifecycle

```
initialized → in_progress → completed
        ↘︎ cancelled
```

### Observation Types (MVP)
- temperature (°C)
- blood_pressure (mmHg)
- heart_rate (bpm)
- oxygen_saturation (%)

### Treatment Types (MVP)
- medication
- procedure
- counseling

---

## 7. Authentication & User Management

### 7.1 Authentication

MedAssist uses **Laravel Sanctum** for token-based API authentication.

- Users authenticate via:
  - `POST /api/auth/login` – returns a personal access token and user profile.
  - `POST /api/auth/logout` – revokes the current token.

- Tokens are stored in the `personal_access_tokens` table and are required as:
  - `Authorization: Bearer <token>` in API requests.
- A **default system admin** is created via database seeding to bootstrap the system. Other users are created by this admin via the admin APIs.

The auth logic is implemented using a **service + controller** pattern:
- `AuthService` contains the core login/logout logic (password check, token issuance, last login tracking).
- `AuthController` is thin and delegates to the service.

### 7.2 Roles

The system defines three roles via the `User` model:

- `admin`
- `doctor`
- `nurse`

These roles are stored on the `users` table and used to control access to admin endpoints (such as user management) and, in future, to patient and encounter features.

Helper methods like `User::isAdmin()` keep role checks explicit and self-documenting in the code.

### 7.3 Admin User Management

User management is scoped to administrators and exposed under `/api/admin/users`:

- `GET /api/admin/users` – list all users, with an optional `search` parameter (matching `name` or `email`).
- `POST /api/admin/users` – create a new user (doctor, nurse, clerk, or admin).
- `GET /api/admin/users/{id}` – view a single user’s profile.

All admin user endpoints are protected by:

- `auth:sanctum` – the caller must be authenticated.
- an `admin` or `role` middleware – the caller must have role `admin`.

User creation uses standard validation in the controller:

- `name` – required string
- `email` – required, unique
- `password` – required, minimum length, `confirmed`
- `role` – must be one of the predefined roles (`User::ROLES`)

The `UsersService` encapsulates user listing/creation/retrieval logic, while the `UsersController` handles HTTP concerns (validation, responses, error codes).

--

## 8. Patients Management

### 8.1 Goals

In many rural clinics, nurses or doctors must quickly register patients at the point of care before starting a consultation.  
MedAssist exposes a simple Patients API to:

- Register new patients quickly.
- Search and view existing patients.
- Update patient demographics when details change.
- Allow only admins to delete patients (for data protection).

Patients are a shared resource across all roles (admin, doctor, nurse), so the patients module lives under a common controller namespace and is reused by all.

### 8.2 API Design

Patients are managed via a REST-style JSON API under `/api/patients`:

- `GET /api/patients?search=...`  
  List patients, optionally filtered by `search` (matches first name, last name, national ID, or phone).

- `POST /api/patients`  
  Create a new patient record.

- `GET /api/patients/{id}`  
  View a single patient.

- `PUT /api/patients/{id}`  
  Update an existing patient.

- `DELETE /api/patients/{id}`  
  Delete a patient (soft delete if enabled on the model).

Example fields for patients (MVP):

- `first_name`, `last_name`
- `national_id` : (16 digits)
- `phone`
- `date_of_birth`
- `gender` (`MALE`, `FEMALE`)
- `address`
-  `phone`
- `emergency_contact_name`,
- `emergency_contact_phone`

The logic is implemented with a **service + controller** pattern:

- `PatientsService` contains querying, creation, update, and delete logic.
- `PatientsController` handles HTTP concerns (validation, status codes, error handling).

### 8.3 Access Control

Access control is role-based and enforced via a custom `role` middleware plus `auth:sanctum`:

- All endpoints require authentication.
- **Create and edit (update)**: accessible all users: `admin`, `doctor`, and `nurse`.
- **View/list**: accessible to all users (`admin`, `doctor`, `nurse`).
- **Delete**: restricted to `admin` only.

---
## 9. Encounters Management

### 9.1 Purpose

Encounters are the **core unit of clinical activity** in MedAssist.  
Each encounter represents one consultation session between a patient and a healthcare provider (nurse or doctor).  
It connects all clinical records — observations, diagnoses, and treatments — under one workflow.

### 9.2 Data Model

Each encounter record stores:

| Field | Type | Description |
|--------|------|-------------|
| `id` | integer | Primary key |
| `patient_id` | integer | References the patient involved |
| `user_id` | integer | Nurse or doctor who initiated the encounter |
| `status` | enum | `initialized`, `in_progress`, `completed`, `cancelled` |
| `started_at` | datetime | When the consultation began |
| `ended_at` | datetime | When the consultation ended |
| `summary` | string | Optional brief summary |
| `is_synced` | boolean | For offline sync support (default `true`) |

### 9.3 Access Control

- All authenticated clinical staff (admin, doctor, nurse) can:
  - Create encounters for patients
  - View encounters
  - Start and end consultations
- There is **no delete** endpoint to preserve data integrity.
- Access control is handled using `auth:sanctum` and `role` middleware.

### 9.4 Lifecycle & Business Logic

| Step | Status | Triggered By | Description |
|------|---------|--------------|-------------|
| 1. | `initialized` | Nurse / Doctor / Admin | Encounter is created but consultation not yet started |
| 2. | `in_progress` | Nurse / Doctor / Admin | Consultation begins — `started_at` timestamp is set |
| 3. | `completed` | Nurse / Doctor / Admin | Consultation ends — `ended_at` timestamp is set |
| 4. | `cancelled` | Nurse / Doctor / Admin | Consultation aborted

Transitions:

- `initialized → in_progress` when starting consultation  
- `in_progress → completed` when ending consultation  

---

### 9.5 Core Endpoints

| Endpoint | Method | Description |
|-----------|--------|-------------|
| `/api/encounters` | `GET` | List all encounters, optionally filtered by `patient_id` or `status` |
| `/api/encounters` | `POST` | Create a new encounter (`status = initialized`) |
| `/api/encounters/{id}` | `GET` | View details of one encounter |
| `/api/encounters/{id}/start-consultation` | `PUT` | Transition `initialized → in_progress` and set `started_at` |
| `/api/encounters/{id}/end-consultation` | `PUT` | Transition `in_progress → completed` and set `ended_at` |
| `/api/encounters/{id}/cancel-consultation` | `PUT` | Transition `in_progress → canceled` and set `ended_at` |

**Note:**  
There are no generic `update` or `delete` endpoints.  
Encounters are immutable medical records once completed.

---

### 9.6 Timestamp Semantics

| Field | Description |
|--------|-------------|
| `created_at` | When the encounter was registered (patient check-in) |
| `started_at` | When the consultation officially began |
| `ended_at` | When the consultation ended |

This design enables metrics such as:
- **Waiting Time:** `started_at - created_at`
- **Consultation Duration:** `ended_at - started_at`

---

## 10. Observations Management

### 10.1 Purpose

Observations represent patient vital signs recorded during a consultation.  
They are linked to a specific encounter and provide essential data such as temperature, blood pressure, heart rate, and oxygen saturation.

---

### 10.2 Core Endpoints

| Endpoint | Method | Description |
|-----------|--------|-------------|
| `/api/encounters/{encounterId}/observations` | `GET` | Retrieve all observations for a given encounter. |
| `/api/encounters/{encounterId}/observations` | `POST` | Record a new observation during an ongoing consultation. |

Both endpoints require authentication (`auth:sanctum`) and are available to **admin**, **doctor**, and **nurse** roles.

---

### 10.3 Observation Structure

| Field | Type | Description |
|--------|------|-------------|
| `id` | integer | Primary key |
| `encounter_id` | integer | Reference to the encounter |
| `type` | enum | One of `TEMPERATURE`, `BLOOD_PRESSURE`, `HEART_RATE`, `OXYGEN_SATURATION` |
| `value` | string | Measurement value (e.g., `38.5`, `120/80`) |
| `unit` | string | Measurement unit (e.g., `°C`, `mmHg`) |
| `recorded_at` | datetime | Timestamp of when measurement was recorded which default is now|

---

Observations are immutable: once recorded, they cannot be updated or deleted.  
If a measurement is incorrect, a new observation should be recorded instead.

---

### 10.4 Design Decision

- Observations are **encounter-scoped** to keep the context of each consultation intact.  
- Data is **append-only** for auditability and clinical safety.  
- Updates and deletions are intentionally omitted to preserve medical integrity.  
- Each observation is lightweight, timestamped, and easy to sync in offline environments.

---

### 10.5 Future Enhancements (If Given 6 Months)

- Support for global filters (e.g., `/api/observations?patient_id=5&type=TEMPERATURE`) for analytics.
- Observation trends and visual dashboards (temperature charts, BP over time).
- Add `is_corrected` flag for invalidated readings.
- Offline caching and sync retries for poor network areas.

--

## 11. Diagnoses Management

### 11.1 Purpose

Diagnoses represent the clinical conditions identified during a patient encounter.  
Each diagnosis belongs to a specific encounter and helps capture the doctor’s or nurse’s medical assessment at the end of consultation.

---

### 11.2 Data Model

| Field | Type | Description |
|--------|------|-------------|
| `id` | integer | Primary key |
| `encounter_id` | integer | Reference to the related encounter |
| `code` | string (nullable) | Optional standardized code (e.g., ICD-10 code) |
| `label` | string | Description of the condition (e.g., "Malaria, unspecified") |
| `is_primary` | boolean | Indicates if this is the main diagnosis for the encounter |
| `created_at` | datetime | When the diagnosis was recorded |
| `updated_at` | datetime | Last modification timestamp (for audit) |

**Relationships:**
- Each `Diagnosis` belongs to one `Encounter`.
- An `Encounter` can have multiple diagnoses.

---

### 11.3 Access Control

- Only authenticated users with `admin`, `doctor`, or `nurse` roles can create or view diagnoses.
- Diagnoses are append-only and cannot be updated or deleted in the MVP to preserve medical record integrity.

---

### 11.4 Core Endpoints

| Endpoint | Method | Description |
|-----------|--------|-------------|
| `/api/encounters/{encounterId}/diagnoses` | `GET` | Retrieve all diagnoses for a given encounter. |
| `/api/encounters/{encounterId}/diagnoses` | `POST` | Record a new diagnosis for the encounter. |

All routes are protected by `auth:sanctum` and restricted to the `admin`, `doctor`, and `nurse` roles.

--

## 12. Treatments Management

### 12.1 Purpose

Treatments represent the actions taken as a result of an encounter’s clinical assessment.  
They can be medications, procedures, or counseling/advice given to the patient.

Treatments are always linked to a specific encounter and are **append-only**: once recorded, they are not updated or deleted in the MVP.

---

### 12.2 Data Model

| Field         | Type      | Description                                      |
|--------------|-----------|--------------------------------------------------|
| `id`         | integer   | Primary key                                      |
| `encounter_id` | integer | Reference to the related encounter               |
| `type`       | enum      | One of `MEDICATION`, `PROCEDURE`, `COUNSELING`   |
| `description` | string   | Human-readable description of the treatment      |
| `created_at` | datetime  | When the treatment was recorded                  |
| `updated_at` | datetime  | Last modification timestamp (for audit)          |

**Relationships:**

- Each `Treatment` belongs to one `Encounter`.
- An `Encounter` can have multiple treatments (e.g., multiple drugs, counseling + drug, etc.).

---

### 12.3 Access Control

All authenticated clinical staff (`admin`, `doctor`, `nurse`) can create and view treatments for encounters.

Treatments are append-only in the MVP: there are no update or delete operations to keep the medical record traceable.

---

### 12.4 Business Rules & Preconditions

A **treatment cannot be created** for an encounter unless all of the following are true:

1. The encounter **exists**.
2. The encounter is in the **`in_progress`** state.
3. The encounter has **at least one observation** recorded.
4. The encounter has **at least one diagnosis** recorded.

This enforces a realistic clinical workflow:

- Vitals must be captured.
- A diagnosis must be documented.
- Only then can a treatment be prescribed or recorded.

The encounter **can** be completed without a treatment (e.g., counseling-only visits), but any treatment that is created must respect the above preconditions.

If any of the conditions are not met, the API returns HTTP `422` with an explanatory message.

---

### 12.5 Core Endpoints

| Endpoint                                       | Method | Description                                    |
|-----------------------------------------------|--------|------------------------------------------------|
| `/api/encounters/{encounterId}/treatments`    | `GET`  | List all treatments for a given encounter.     |
| `/api/encounters/{encounterId}/treatments`    | `POST` | Record a new treatment for the encounter.      |

All routes are protected by `auth:sanctum` and require `admin`, `doctor`, or `nurse` roles.

---

## 13. DevOps & Process

| Aspect | Implementation |
|--------|----------------|
| **Version Control** | GitHub (feature-branch workflow, PR reviews) |
| **CI/CD** | GitHub Actions running tests for every PR |
| **Docker** | Laravel + MySQL setup in one command (`docker-compose up`) |
| **Environment Setup** | `.env` generated automatically in CI |
| **PM Integration** | GitHub Project board with issues linked in PRs |
| **Documentation** | README for setup, DESIGN.md for reasoning |

---

## 14. Tradeoffs & Design Decisions

| Decision | Justification |
|-----------|----------------|
| Single-clinic setup | Simpler MVP; can expand to multi-clinic in future iteration. |
| 4 observation types only | Focus on most essential vitals for rural clinics. |
| Enum statuses instead of state machine | Simpler implementation; future version can add Spatie state transitions. |
| Laravel over Node for backend | Faster prototyping and well-suited for CRUD-heavy systems. |

---

## 15. Future Vision (If Given 6 More Months)

- **Multi-clinic Management** — allow each clinic to manage its own patients and staff.
- **Offline Mode with Sync** — local storage and synchronization queue for disconnected environments.
- **FHIR Integration** — standardize data exchange with national EMR systems.
- **Analytics Dashboard** — visualize encounter data and patient metrics.
- **Role-based Access Control (RBAC)** using Spatie permissions.
- **Data Management Enhancements** — pagination, table sorting, column filtering, and bulk operations for better data handling in large datasets.
- **Reports Module** — comprehensive reporting system for each module (patients, encounters, observations, diagnoses, treatments) with date range selection, both as an interactive reports module within the application and downloadable formats (PDF, Excel, CSV) for external use and record-keeping.
- **Audit Trail & Activity Logging** — comprehensive logging of all system activities (user actions, data changes, access logs) for compliance, security, and accountability in medical record management.
- **Notifications & Alerts System** — real-time notifications for critical observations (e.g., high fever, abnormal blood pressure), follow-up reminders, appointment alerts, and system-wide announcements to improve patient care coordination.
- **Patient History Timeline** — comprehensive chronological view of all patient encounters, observations, diagnoses, and treatments across time, enabling better continuity of care and trend analysis.
- **Print Functionality** — ability to print encounter summaries, patient records, prescriptions, and reports in standardized formats for physical filing and external documentation needs.
- **Appointment Scheduling** — appointment booking system to manage patient flow, reduce waiting times, and optimize clinic resources with calendar views and scheduling conflicts detection.
- **Follow-up Management** — track and manage patient follow-up appointments, automated reminders for scheduled follow-ups, and flag patients requiring attention based on previous diagnoses or treatments.

---

## 16. References

- Laravel Docs – [https://laravel.com/docs](https://laravel.com/docs)
- React Docs – [https://react.dev](https://react.dev)
- React Router Docs – [https://reactrouter.com](https://reactrouter.com)
- TanStack Query (React Query) Docs – [https://tanstack.com/query](https://tanstack.com/query)
- Tailwind CSS Docs – [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
- Vite Docs – [https://vite.dev](https://vite.dev)
- e-fiche Challenge Instructions

---

## 17. Frontend Architecture

### 17.1 Technology Stack

The frontend is built as a modern single-page application (SPA) using:

- **React 19** – UI library for building interactive user interfaces
- **TypeScript** – Type-safe JavaScript for better developer experience and code quality
- **Vite** – Fast build tool and development server
- **React Router 7** – Client-side routing with protected routes
- **TanStack Query (React Query)** – Server state management, caching, and synchronization
- **Axios** – HTTP client for API communication
- **Tailwind CSS 4** – Utility-first CSS framework for rapid UI development
- **React Icons** – Comprehensive icon library (FontAwesome, Material Design, etc.)

### 17.2 Application Pages

The application consists of the following main pages:

#### Public Pages

1. **HomePage** (`/`)
   - Landing page showcasing MedAssist features
   - Displays feature cards (Patient Management, Encounter Tracking, Observations & Diagnoses, etc.)
   - Call-to-action buttons for authenticated/unauthenticated users
   - Responsive grid layout

2. **LoginPage** (`/login`)
   - User authentication form
   - Email and password input fields
   - Redirects authenticated users to dashboard
   - Protected by `PublicRoute` (redirects if already logged in)

3. **NotFoundPage** (`*`)
   - 404 error page for unmatched routes
   - Displays friendly error message with navigation options
   - "Back to Home" and "Go Back" buttons

#### Protected Pages (Require Authentication)

4. **DashboardIndex** (`/dashboard`)
   - Overview dashboard showing key metrics
   - Total patients, encounters, and observations counts
   - Latest encounters list with status badges
   - Quick access cards to main modules

5. **PatientsPage** (`/dashboard/patients`)
   - List all patients with search functionality
   - Patient table displaying: ID, name, national ID, phone, gender, date of birth
   - "Add Patient" button (opens modal form)
   - "Edit" and "Delete" buttons (delete only for admins)
   - Search filters by first name, last name, national ID, or phone
   - Navigate to patient details on row click

6. **PatientDetailsPage** (`/dashboard/patients/:id`)
   - Detailed view of a single patient
   - Patient information section (demographics, contact details, emergency contact)
   - Encounters list for the patient
   - "Back" button (navigates to previous page)
   - "Edit Patient" button (opens edit modal)
   - "Create Encounter" button (creates new encounter and navigates to encounter details)
   - Loading and disabled states during encounter creation

7. **EncountersPage** (`/dashboard/encounters`)
   - List all encounters with filtering
   - Filter by patient (dropdown) and status (dropdown)
   - Encounter table displaying: ID, patient name, provider, status, started date, duration
   - Status badges (INITIALIZED, IN_PROGRESS, COMPLETED, CANCELED)
   - Navigate to encounter details on row click
   - "All" option in filters to reset selections

8. **EncountersDetailsPage** (`/dashboard/encounters/:encounterId`)
   - Detailed view of a single encounter
   - Tabbed interface with four tabs:
     - **Overview**: Encounter summary, patient info, provider, timestamps, duration
     - **Observations**: List of vital signs with "Add Observation" button
     - **Diagnoses**: List of diagnoses with "Add Diagnosis" button
     - **Treatments**: List of treatments with "Add Treatment" button
   - Action buttons based on encounter status:
     - `INITIALIZED`: "Start Consultation" button
     - `IN_PROGRESS`: "End Consultation" and "Cancel Consultation" buttons
     - `COMPLETED`: Status indicator
     - `CANCELED`: Status indicator
   - "Back to All Encounters" link at the top
   - Lazy loading for observations, diagnoses, and treatments (fetched when tab is opened)
   - Modals for adding observations, diagnoses, and treatments
   - End consultation modal with summary textarea

9. **UsersPage** (`/dashboard/users`) – Admin Only
   - List all system users
   - User table displaying: name, email, role, last login, account status
   - Search functionality (filters by name or email)
   - "Add User" button (opens modal form)
   - "Change Status" button for each user (activates/deactivates account)
   - Role badges (ADMIN, DOCTOR, NURSE)
   - Protected by `AdminRoute` (only accessible to users with ADMIN role)

### 17.3 Main Functional Requirements

#### Authentication & Authorization

- **Token-based Authentication**: Uses Laravel Sanctum tokens stored in `localStorage`
- **Auth Context**: Global authentication state management via React Context
- **Protected Routes**: `ProtectedRoute` component guards authenticated pages
- **Public Routes**: `PublicRoute` component redirects authenticated users away from login
- **Admin Routes**: `AdminRoute` component restricts access to admin-only pages
- **Auto-logout**: Users are automatically logged out when account status changes

#### Patient Management

- **List Patients**: View all patients with search and pagination
- **Create Patient**: Modal form with validation (first name, last name, national ID, phone, date of birth, gender, address, emergency contact)
- **View Patient Details**: Comprehensive patient information with encounter history
- **Edit Patient**: Update patient demographics via modal form
- **Delete Patient**: Soft delete (admin only)
- **Create Encounter**: Quick encounter creation from patient details page

#### Encounter Management

- **List Encounters**: View all encounters with filtering by patient and status
- **View Encounter Details**: Tabbed interface showing overview, observations, diagnoses, and treatments
- **Start Consultation**: Transition encounter from `INITIALIZED` to `IN_PROGRESS`
- **End Consultation**: Transition encounter from `IN_PROGRESS` to `COMPLETED` (requires at least one observation and one diagnosis)
- **Cancel Consultation**: Transition encounter from `IN_PROGRESS` to `CANCELED`
- **Add Observations**: Record vital signs (temperature, blood pressure, heart rate, oxygen saturation) during active consultation
- **Add Diagnoses**: Record clinical conditions with optional ICD code and primary diagnosis flag
- **Add Treatments**: Record medications, procedures, or counseling with dosage, duration, and notes

#### User Management (Admin Only)

- **List Users**: View all system users with search
- **Create User**: Modal form with validation (name, email, password, role)
- **Update Account Status**: Activate or deactivate user accounts (automatically logs out affected users)

#### UI/UX Features

- **Responsive Design**: Mobile-first approach with breakpoints for tablet and desktop
- **Loading States**: Spinner components during API calls
- **Error Handling**: Toast notifications for success and error messages
- **Form Validation**: Client-side and server-side validation with error display
- **Optimistic Updates**: Immediate UI updates with cache invalidation for better UX
- **Lazy Loading**: Data fetched only when needed (e.g., observations when tab is opened)
- **Modal Forms**: Reusable modal component for creating/editing entities
- **Status Badges**: Visual indicators for encounter statuses and user roles
- **Navigation**: Fixed navbar with role-based menu items and mobile hamburger menu

#### State Management

- **Server State**: Managed by React Query with automatic caching, refetching, and synchronization
- **Client State**: Local component state for UI interactions (modals, forms, tabs)
- **Auth State**: Global authentication state via React Context
- **Cache Management**: Query invalidation and refetching on mutations for data consistency

#### API Integration

- **Centralized API Functions**: Organized by domain (auth, patients, encounters, users, dashboard)
- **Error Handling**: Centralized error handling utility (`handleAxiosError`)
- **Auth Headers**: Reusable function for adding authentication tokens to requests
- **Base URL Configuration**: Centralized API endpoint configuration

---

## 18. Summary

> **MedAssist** is a lightweight Laravel + React platform that helps rural nurses record consultations quickly and efficiently.  
> It focuses on simplicity, maintainability, and real-world practicality — with a design that can evolve into a full clinic management platform in the next phase.
