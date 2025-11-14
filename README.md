# MedAssist – Consultation Overload Solution

A lightweight, modular consultation assistant designed to help nurses record and manage patient encounters efficiently, even with intermittent internet connectivity.

## Overview

MedAssist is a full-stack web application built to streamline patient consultations and encounter recording in rural clinics. It addresses the challenge of consultation overload by providing an efficient, user-friendly system for managing patients, encounters, observations, diagnoses, and treatments.

## Features

- **Patient Management**: Register, search, view, and manage patient demographics
- **Encounter Tracking**: Create and manage consultation sessions with lifecycle status tracking
- **Clinical Records**: Record observations (vital signs), diagnoses, and treatments
- **User Management**: Admin-only user management with role-based access control
- **Dashboard**: Overview of key metrics and latest encounters
- **Responsive Design**: Mobile-first design that works on all devices
- **Authentication**: Secure token-based authentication using Laravel Sanctum

## Technology Stack

### Backend
- **Laravel 12** (PHP 8.3) - RESTful API
- **MySQL 8** - Database
- **Laravel Sanctum** - Authentication

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router 7** - Client-side routing
- **TanStack Query** - Server state management
- **Axios** - HTTP client
- **Tailwind CSS 4** - Styling
- **React Icons** - Icon library

### Infrastructure
- **Docker & Docker Compose** - Containerization
- **GitHub Actions** - CI/CD

## Prerequisites

- Docker and Docker Compose installed
- Git

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MedAssist
   ```

2. **Start the application**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000/api

4. **Default Credentials**

   The database seeder creates three default users for testing:

   | Role | Email | Password |
   |------|-------|----------|
   | Admin | admin@medassist.com | admin123 |
   | Doctor | doctor@medassist.com | doctor123 |
   | Nurse | nurse@medassist.com | nurse123 |

   **Note**: These are default credentials for development. Change them in production!

## Project Structure

```
MedAssist/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── api/           # API integration functions
│   │   ├── components/    # React components
│   │   ├── contexts/      # React contexts (Auth)
│   │   ├── hooks/         # Custom React hooks
│   │   ├── interfaces/    # TypeScript interfaces
│   │   ├── pages/         # Page components
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                 # Laravel backend application
│   ├── app/
│   │   ├── Http/
│   │   │   └── Controllers/  # API controllers
│   │   ├── Models/           # Eloquent models
│   │   └── Services/        # Business logic services
│   ├── database/
│   │   ├── migrations/      # Database migrations
│   │   └── seeders/        # Database seeders
│   └── routes/
│       └── api.php          # API routes
├── docker-compose.yml      # Docker configuration
└── README.md
```

## Development

### Backend Development

1. **Navigate to server directory**
   ```bash
   cd server
   ```

2. **Install dependencies** (if not using Docker)
   ```bash
   composer install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Run migrations**
   ```bash
   php artisan migrate
   ```

5. **Seed database**
   ```bash
   php artisan db:seed
   ```

6. **Run tests**
   ```bash
   php artisan test
   ```

### Frontend Development

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Patients
- `GET /api/patients` - List patients (with optional search)
- `POST /api/patients` - Create patient
- `GET /api/patients/{id}` - Get patient details
- `PUT /api/patients/{id}` - Update patient
- `DELETE /api/patients/{id}` - Delete patient (admin only)

### Encounters
- `GET /api/encounters` - List encounters (with optional filters)
- `POST /api/encounters` - Create encounter
- `GET /api/encounters/{id}` - Get encounter details
- `PUT /api/encounters/{id}/start-consultation` - Start consultation
- `PUT /api/encounters/{id}/end-consultation` - End consultation
- `PUT /api/encounters/{id}/cancel-consultation` - Cancel consultation

### Observations
- `GET /api/encounters/{encounterId}/observations` - List observations
- `POST /api/encounters/{encounterId}/observations` - Create observation

### Diagnoses
- `GET /api/encounters/{encounterId}/diagnoses` - List diagnoses
- `POST /api/encounters/{encounterId}/diagnoses` - Create diagnosis

### Treatments
- `GET /api/encounters/{encounterId}/treatments` - List treatments
- `POST /api/encounters/{encounterId}/treatments` - Create treatment

### Users (Admin Only)
- `GET /api/admin/users` - List users
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/{id}/account-status` - Update account status

### Dashboard
- `GET /api/dashboard` - Get dashboard statistics

## User Roles

- **ADMIN**: Full system access, including user management
- **DOCTOR**: Can manage patients, encounters, and clinical records
- **NURSE**: Can manage patients, encounters, and clinical records

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Write/update tests if applicable
4. Submit a pull request

## Documentation

For detailed design decisions and architecture, see [docs/DESIGN.md](docs/DESIGN.md).

## License

This project is part of a senior software engineer challenge.

## Support

For issues and questions, please open an issue in the repository.
