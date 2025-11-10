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

### Frontend (Next.js 15)
- Nurse dashboard to list patients and encounters.
- Forms for adding observations and treatments.
- Uses REST API from the backend via Axios or React Query.

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
| **Frontend** | Next.js 15 + TypeScript | Great developer experience, SSR-ready |
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

## 9. DevOps & Process

| Aspect | Implementation |
|--------|----------------|
| **Version Control** | GitHub (feature-branch workflow, PR reviews) |
| **CI/CD** | GitHub Actions running tests for every PR |
| **Docker** | Laravel + MySQL setup in one command (`docker-compose up`) |
| **Environment Setup** | `.env` generated automatically in CI |
| **PM Integration** | GitHub Project board with issues linked in PRs |
| **Documentation** | README for setup, DESIGN.md for reasoning |

---

## 10. Tradeoffs & Design Decisions

| Decision | Justification |
|-----------|----------------|
| Single-clinic setup | Simpler MVP; can expand to multi-clinic in future iteration. |
| 4 observation types only | Focus on most essential vitals for rural clinics. |
| Enum statuses instead of state machine | Simpler implementation; future version can add Spatie state transitions. |
| Laravel over Node for backend | Faster prototyping and well-suited for CRUD-heavy systems. |

---

## 11. Future Vision (If Given 6 More Months)

- **Multi-clinic Management** — allow each clinic to manage its own patients and staff.
- **Offline Mode with Sync** — local storage and synchronization queue for disconnected environments.
- **FHIR Integration** — standardize data exchange with national EMR systems.
- **Analytics Dashboard** — visualize encounter data and patient metrics.
- **Role-based Access Control (RBAC)** using Spatie permissions.

---

## 12. References

- Laravel Docs – [https://laravel.com/docs](https://laravel.com/docs)
- Next.js Docs – [https://nextjs.org/docs](https://nextjs.org/docs)
- e-fiche Challenge Instructions

---

## 12. Summary

> **MedAssist** is a lightweight Laravel + Next.js platform that helps rural nurses record consultations quickly and efficiently.  
> It focuses on simplicity, maintainability, and real-world practicality — with a design that can evolve into a full clinic management platform in the next phase.
