# CareSync — Frontend

React single-page application for the CareSync caregiver portal. Communicates with the [CareSync backend API](https://github.com/hsc996/congenial-goggles).

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Key Features](#key-features)
3. [Multi-Tenancy & Auth Flow](#multi-tenancy--auth-flow)
4. [Routes](#routes)
5. [Component Overview](#component-overview)
6. [API Layer](#api-layer)
7. [Tech Stack](#tech-stack)

---

## Project Structure

```
src/
├── api/
│   ├── axiosInstance.jsx   # Axios instance with JWT injection + token refresh interceptor
│   ├── auth.jsx            # Auth API calls (signup, signin, logout, refresh, reset)
│   └── patient.js          # Patient, shift, handover, medication API calls
├── contexts/
│   ├── AuthContext/
│   │   ├── AuthContext.jsx         # Auth context definition
│   │   └── AuthProvider.jsx    # Provides userJwt, currentUser, setUserJwt
│   └── NotificationContext/
│       ├── NotificationContext.jsx
│       └── NotificationProvider.jsx
├── routes/
│   ├── LandingPage.jsx
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx        # Create company or join via invite code
│   ├── PatientDashboard.jsx    # Main calendar view
│   ├── ForgotPasswordPage.jsx
│   └── ResetPasswordPage.jsx
├── components/
│   ├── Dashboard/
│   │   ├── CaregiverCal.jsx        # Monthly calendar grid
│   │   ├── DailySidebar.jsx        # Day detail panel (shifts, meds, ADLs, notes)
│   │   ├── PatientHeader.jsx       # Patient info bar
│   │   └── PatientSidebar.jsx      # Company patient list + user list
│   ├── PatientPage/
│   │   └── PatientProfile.jsx      # Full patient profile / edit view
│   ├── Notifications/
│   │   ├── notificationService.jsx # useNotificationService hook
│   │   └── ToastContainer.jsx
│   ├── LandingPage/
│   │   └── MainNav.jsx
│   ├── ProtectedRoute.jsx          # Redirects to /signin if no valid JWT
│   ├── MagneticButton.jsx
│   └── ui/
│       └── Accordion.jsx
├── App.jsx
└── main.jsx
```

---

## Key Features

- **Monthly shift calendar** — colour-coded day cells, dot indicator when shifts exist
- **Daily sidebar** — shifts, medications with administration recording/unvalidation, ADLs, handover notes
- **Patient profile** — full demographics, medication schedule, care task schedule, emergency contacts, profile image upload
- **Multi-tenant registration** — create a new company (become Admin) or join one with an invite code
- **Token refresh** — silent access token refresh via interceptor; users are never logged out mid-session unless the refresh token also expires
- **Toast notifications** — success/error feedback throughout

---

## Multi-Tenancy & Auth Flow

### Registration

The register page presents a toggle:

| Mode | What happens |
|---|---|
| **Create company** | User enters a company name. A new `Company` document is created server-side; this user becomes the `Admin`. An invite code is auto-generated. |
| **Join with invite code** | User enters the invite code provided by their Admin. They join the existing company as a `User`. |

### JWT

After login or registration the server returns an **access token** (15 min) and a **refresh token** (7 days). Both are stored in `localStorage`. The `axiosInstance` interceptor automatically:

1. Attaches `Authorization: Bearer <token>` to every request
2. On a 401 response, calls `POST /auth/refresh` once to get a new access token
3. Retries the original request with the new token
4. If refresh fails, clears storage and redirects to `/signin`

### `currentUser` shape (decoded from JWT)

```js
{
  id:        string,
  username:  string,
  role:      'Admin' | 'User',
  firstName: string,
  lastName:  string,
  companyId: string,   // tenant identifier
}
```

`companyId` is embedded in the JWT so the frontend always knows the tenant without an extra API call, though it is not used directly for filtering on the client — all filtering is enforced server-side.

---

## Routes

| Path | Component | Access |
|---|---|---|
| `/` | `LandingPage` | Public |
| `/signin` | `LoginPage` | Public |
| `/signup` | `RegisterPage` | Public |
| `/forgot-password` | `ForgotPasswordPage` | Public |
| `/reset-password` | `ResetPasswordPage` | Public |
| `/dashboard` | `PatientDashboard` | Protected |
| `/patient/:id` | `PatientProfile` | Protected |

`ProtectedRoute` wraps authenticated routes — redirects to `/signin` if `userJwt` or `currentUser` is absent.

---

## Component Overview

### `PatientDashboard`

Top-level page that owns all dashboard state:

- Fetches the patient list via `PatientSidebar` and selects the first patient automatically
- Fetches shifts for the selected patient + current month; uses a shared-promise ref (`shiftsFetchRef`) to ensure only one HTTP request is made per patient+month regardless of how many times the effect fires
- Renders `CalendarGrid`, `DailySidebar`, and `PatientHeader`
- Passes down shift data, handover notes, and medication records as props

### `PatientSidebar`

- Lists all company patients (fetched on mount)
- Lists all company users in a collapsible accordion
- Calls `onSelect` when a patient is clicked; auto-selects the first patient on load

### `DailySidebar`

- Shows shifts, medications, ADLs, and handover notes for the selected date
- Medication rows have inline Validate / Unvalidate actions

### `CaregiverCal`

Pure presentational grid — renders day cells with shift indicators. All data is passed in via props; it makes no API calls.

---

## API Layer

### `axiosInstance.jsx`
Singleton Axios instance. Base URL from `VITE_API_URL` env var. Handles JWT injection and silent token refresh.

### `auth.jsx`
```js
authAPI.signup(firstName, lastName, username, email, password, { companyName?, inviteCode? })
authAPI.signin(email, password)
authAPI.refreshToken(refreshToken)
authAPI.logout()
authAPI.requestPasswordReset(email)
authAPI.resetPassword(token, newPassword)
```

### `patient.js`
```js
patientAPI.getAllPatients()
patientAPI.getPatient(id)
patientAPI.getPatientShifts(id, year, month)          // → { 'YYYY-MM-DD': [shift, ...] }
patientAPI.updatePatient(id, data)
patientAPI.getHandoverNotes(id, date)
patientAPI.getMedicationAdministrations(patientId, date)
patientAPI.recordMedicationAdministration(patientId, data)
patientAPI.unvalidateMedicationAdministration(patientId, recordId, reason)
patientAPI.uploadImage(id, file, onProgress)
```

---

## Tech Stack

| | |
|---|---|
| Framework | React 18 |
| Build tool | Vite |
| Routing | React Router v6 |
| Styling | Tailwind CSS |
| Animation | Motion (Framer Motion v11+) |
| HTTP | Axios |
| Icons | Lucide React |
