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

## 7. DevOps & Process

| Aspect | Implementation |
|--------|----------------|
| **Version Control** | GitHub (feature-branch workflow, PR reviews) |
| **CI/CD** | GitHub Actions running tests for every PR |
| **Docker** | Laravel + MySQL setup in one command (`docker-compose up`) |
| **Environment Setup** | `.env` generated automatically in CI |
| **PM Integration** | GitHub Project board with issues linked in PRs |
| **Documentation** | README for setup, DESIGN.md for reasoning |

---

## 8. Tradeoffs & Design Decisions

| Decision | Justification |
|-----------|----------------|
| Single-clinic setup | Simpler MVP; can expand to multi-clinic in future iteration. |
| 4 observation types only | Focus on most essential vitals for rural clinics. |
| Enum statuses instead of state machine | Simpler implementation; future version can add Spatie state transitions. |
| Laravel over Node for backend | Faster prototyping and well-suited for CRUD-heavy systems. |

---

## 9. Future Vision (If Given 6 More Months)

- 🏥 **Multi-clinic Management** — allow each clinic to manage its own patients and staff.
- 📡 **Offline Mode with Sync** — local storage and synchronization queue for disconnected environments.
- ⚕️ **FHIR Integration** — standardize data exchange with national EMR systems.
- 📊 **Analytics Dashboard** — visualize encounter data and patient metrics.
- 🔐 **Role-based Access Control (RBAC)** using Spatie permissions.

---

## 10. References

- Laravel Docs – [https://laravel.com/docs](https://laravel.com/docs)
- Next.js Docs – [https://nextjs.org/docs](https://nextjs.org/docs)
- e-fiche Challenge Instructions

---

## 11. Summary

> **MedAssist** is a lightweight Laravel + Next.js platform that helps rural nurses record consultations quickly and efficiently.  
> It focuses on simplicity, maintainability, and real-world practicality — with a design that can evolve into a full clinic management platform in the next phase.
