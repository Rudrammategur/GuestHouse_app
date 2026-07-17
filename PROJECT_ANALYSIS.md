# Guest House Booking System — Project Analysis

**Generated:** June 23, 2026  
**Stack:** React (Vite) · Node.js (Express 5) · Microsoft SQL Server  
**Repository root:** `guesthouse_booking_app/`

---

## Executive Summary

This is an institutional ERP-style application for **Guest House accommodation** and **Transport** booking at IIT Mandi (branding/assets reference IIIT/IIT). The guest house workflow is the most developed module: Applicant → Verifier → Approver → Guest House Incharge → Room Allocation → Check-In → Check-Out.

The project is in a **prototype / integration-in-progress** state. The frontend has rich UI for most roles, but the backend largely returns **hardcoded mock data**. Real SQL Server integration exists in commented-out code and one migration script; only `workflowService.getWorkflowUsers()` actively queries the database today.

---

## 1. Folder Structure

```
guesthouse_booking_app/
├── backend/
│   ├── config/
│   │   ├── currentUser.js          # Hardcoded backend user (EMP001)
│   │   ├── db.js                   # SQL Server connection pool (mssql)
│   │   ├── mailConfig.js
│   │   └── workflowConfig.js       # Static verifier/approver/incharge IDs
│   ├── controllers/                # Request handlers (mostly mock responses)
│   ├── database/
│   │   └── migrations/
│   │       └── 001_guest_house_allocation.sql
│   ├── routes/                     # Express route definitions
│   ├── services/                   # Business logic (email, workflow, assignment)
│   ├── templates/emails/           # HTML email templates
│   ├── server.js                   # App entry point
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/                 # Logos, hero image
│   │   ├── components/             # Shared UI (Dashboard, Common, Modal)
│   │   ├── context/                # UserContext (role switching)
│   │   ├── pages/                  # Route-level screens by role/module
│   │   ├── styles/                 # Per-module CSS files
│   │   ├── App.jsx                 # React Router configuration
│   │   └── main.jsx                # App bootstrap + ToastContainer
│   ├── WORKFLOW.md                 # Documented business workflow
│   ├── vite.config.js
│   └── package.json
│
└── PROJECT_ANALYSIS.md             # This document
```

### Backend source files (excluding `node_modules`)

| Area | Files |
|------|-------|
| Entry | `server.js` |
| Config | `db.js`, `currentUser.js`, `workflowConfig.js`, `mailConfig.js` |
| Controllers | `guestHouseBookingController`, `guestHouseInchargeController`, `verifierController`, `approverController`, `masterController`, `guestTypeController`, `expenditureHeadController`, `userController`, `roomChargeController` |
| Routes | `guestHouseBookingRoutes`, `guestHouseInchargeRoutes`, `verifierRoutes`, `approverRoutes`, `masterRoutes`, `guestTypeRoutes`, `expenditureHeadRoutes`, `userRoutes`, `roomChargeRoutes`, `transportRoutes` (empty) |
| Services | `workflowService`, `assignmentService`, `emailService`, `currentUserService`, `notificationService` (empty) |
| Templates | `applicationSubmitted`, `applicationVerified`, `applicationApproved`, `applicationRejected`, `roomAllocated` |

### Frontend source layout

| Area | Purpose |
|------|---------|
| `pages/guesthouse/` | Applicant booking form, preview, my bookings |
| `pages/Verifier/` | Verifier dashboard and actions |
| `pages/Approver/` | Approver dashboard and actions |
| `pages/guesthouseIncharge/` | Allocation, check-in/out, receipt, calendar |
| `pages/Transport/` | Transport applicant flows |
| `pages/transportIncharge/` | Transport allocation (mock data) |
| `pages/user/` | Employee dashboard |
| `components/Dashboard/` | Reusable dashboard table, cards, application view |
| `components/Common/` | Form inputs (mobile, email, nationality) |

---

## 2. Frontend Architecture

### Technology stack

| Layer | Choice |
|-------|--------|
| Framework | React 19 |
| Build tool | Vite 8 |
| Routing | React Router DOM 7 |
| HTTP | Axios |
| Notifications | react-toastify |
| Date picking | react-datepicker |
| Icons | react-icons |
| State | React Context (`UserContext`) — **Redux Toolkit is installed but unused** |
| Auth | None (dev `UserSwitcher` mock) |
| Styling | Plain CSS per module (`styles/*.css`, component-scoped CSS) |

### Application bootstrap

```
main.jsx
  └── UserProvider (UserContext)
        └── App (BrowserRouter + Routes)
        └── ToastContainer
```

### Routing model

Routes are declared centrally in `App.jsx`. There is **no route guard** — any user can navigate to any URL. Role simulation is done via `UserSwitcher`, which is intended for development but is currently placed incorrectly (see Bugs).

### Data fetching pattern

- Most pages call `axios` directly with hardcoded `http://localhost:5000` URLs.
- Some newer pages (e.g. `GuestHouseForm`, `GHInchargeDashboard`) use `import.meta.env.VITE_API_URL || "http://localhost:5000"`.
- No centralized API client, interceptors, or error boundary layer.
- Draft persistence: `GuestHouseForm` saves form state to `localStorage` under `guestHouseDraft`.

### Module entry points

| Path | Screen |
|------|--------|
| `/` | MainDashboard — choose Guest House or Transport |
| `/guesthouse-dashboard` | Guest House module hub |
| `/transport-dashboard` | Transport module hub |
| `/guesthouse` | New booking form |
| `/verifier` | Verifier dashboard |
| `/approver` | Approver dashboard |
| `/gh-incharge` | Guest House Incharge dashboard |
| `/gh-incharge/checkins` | Check-in list |
| `/gh-incharge/checkin/:bookingId` | Check-in form |

---

## 3. Backend Architecture

### Technology stack

| Layer | Choice |
|-------|--------|
| Runtime | Node.js (CommonJS) |
| Framework | Express 5 |
| Database driver | `mssql` (SQL Server) |
| Also installed | `mysql2` (**unused**), `nodemailer`, `dotenv`, `cors` |
| Auth | None — static `getCurrentUser()` |
| Email | Ethereal test SMTP via nodemailer |

### Layered structure

```
HTTP Request
    ↓
server.js (middleware: cors, express.json, route mounting)
    ↓
routes/*.js (URL → controller method)
    ↓
controllers/*.js (validation, response — mostly mock)
    ↓
services/*.js (workflow, email, assignment — partially implemented)
    ↓
config/db.js → SQL Server (poolPromise)
```

### Registered API prefixes (`server.js`)

| Prefix | Router |
|--------|--------|
| `/api/guest-types` | guestTypeRoutes |
| `/api/expenditure-heads` | expenditureHeadRoutes |
| `/api/guesthouse-bookings` | guestHouseBookingRoutes |
| `/api/verifier` | verifierRoutes |
| `/api/approver` | approverRoutes |
| `/api/user` | userRoutes |
| `/api/master` | masterRoutes |
| `/api/guesthouse-incharge` | guestHouseInchargeRoutes |

**Not registered in server.js:** `roomChargeRoutes`, `transportRoutes`, legacy inline routes in commented blocks.

### Implementation maturity

| Controller | DB integration | Notes |
|------------|------------------|-------|
| `guestHouseBookingController` | Mock only | Returns fixed `BookingID: 101` |
| `verifierController` | Mock only | In-memory array; hardcoded `EMP004` |
| `approverController` | Mock only | Static JSON arrays |
| `guestHouseInchargeController` | Mock only | In-memory `applications` array |
| `masterController` | Mock only | Static guest house / room / tariff data |
| `guestTypeController` | Mock only | Static guest types |
| `expenditureHeadController` | Mock only | Static array |
| `userController` | Config file | Returns `config/currentUser.js` |
| `workflowService` | **Live DB** | Queries `GuestHouseUserAccess` |

Large blocks of production-ready SQL (transactions, room overlap checks, serializable isolation) exist as **commented code** in incharge and booking controllers — indicating planned but not activated integration.

---

## 4. Database Flow

### Connection

`backend/config/db.js` connects via environment variables:

- `DB_USER`, `DB_PASSWORD`, `DB_SERVER`, `DB_DATABASE`
- Uses `mssql` connection pool with `encrypt: false`, `trustServerCertificate: true`

### Schema (inferred from migration + commented SQL)

```
┌─────────────────────┐     ┌──────────────────────────────┐
│  GuestTypeMaster    │     │  CONTRACTSERVICES..          │
│  RoomTypeMaster     │     │  GuestHouseMaster            │
│  GuestHouseTariff   │     └──────────────┬───────────────┘
└──────────┬──────────┘                    │
           │                               │
           ▼                               ▼
┌──────────────────────────────────────────────────────────┐
│              GuestHouseBookings (BookingID PK)            │
│  GuestTypeID, GuestHouseID, RoomTypeID, BookedBy,        │
│  ArrivalDateTime, DepartureDateTime, BookingStatus, ...  │
└────────────┬─────────────────────────────┬───────────────┘
             │                             │
             ▼                             ▼
┌────────────────────────────┐   ┌─────────────────────────┐
│ GuestHouseBookingRoomDetails │   │ GuestHouseRoomAllocation │
│ GHBookingID, RoomTypeID,     │   │ GHBookingID,             │
│ NoOfRooms                    │   │ GuestHouseRoomID,        │
└────────────────────────────┘   │ AllocatedBy, AllocatedDate│
                                   └────────────┬────────────┘
                                                │
                                                ▼
                                   ┌─────────────────────────┐
                                   │ GuestHouseRoomMaster     │
                                   │ (room inventory)         │
                                   └─────────────────────────┘

┌─────────────────────────┐
│ GuestHouseUserAccess    │  ← Only table actively queried today
│ RoleName, EmployeeID    │
└─────────────────────────┘

┌─────────────────────────┐
│ GuestHouseWorkflowHistory│  ← Documented in WORKFLOW.md, not implemented
└─────────────────────────┘
```

### Migration script

`backend/database/migrations/001_guest_house_allocation.sql` adds:

- Columns to `GuestHouseBookings`: `GuestHouseID`, `MealsRequired`, `SpecialRequirements`, `TotalRoomsReq`, `ExpenditureHead`, `ProjectNumber`
- Table `GuestHouseBookingRoomDetails` (multi room-type requirements per booking)
- Table `GuestHouseRoomAllocation` (physical room assignment)
- Index on allocation by room

### Intended booking lifecycle (status flow)

```
Submitted → Verified → Approved → Allocated → Checked-In → Checked-Out
                ↘ Rejected (at Verifier or Approver stage)
```

### Current DB reality

- **Most writes and reads never reach SQL Server** — controllers return mock JSON.
- Commented SQL references inconsistent table names (`GuestHouseBookings` vs `GuestHouseRoomBookings`), suggesting schema evolution not fully reconciled.
- No ORM; raw parameterized SQL via `mssql` request API.
- No migration runner — single SQL file must be applied manually.

---

## 5. API Flow

### Guest House — end-to-end (intended)

```
┌──────────┐   POST /api/guesthouse-bookings    ┌──────────┐
│ Applicant│ ─────────────────────────────────► │ Backend  │
│  (Form)  │ ◄── { BookingID, success } ──────── │ (mock)   │
└──────────┘                                     └────┬─────┘
                                                      │
┌──────────┐   GET /api/verifier/pending-applications │
│ Verifier │ ◄───────────────────────────────────────┤
│          │   PUT /api/verifier/status/:bookingId     │
└──────────┘ ────────────────────────────────────────►│
                                                      │
┌──────────┐   GET /api/approver/pending-applications │
│ Approver │ ◄───────────────────────────────────────┤
│          │   PUT /api/approver/status/:bookingId     │
└──────────┘ ────────────────────────────────────────►│
                                                      │
┌──────────┐   GET /api/guesthouse-incharge/...      │
│ GH Inchg │ ◄───────────────────────────────────────┤
│          │   POST .../allocations                  │
└──────────┘ ────────────────────────────────────────►│
```

### Complete API inventory

#### Implemented and mounted

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/guesthouse-bookings` | Submit application (mock) |
| GET | `/api/guest-types` | List guest types (mock) |
| GET | `/api/expenditure-heads` | List expenditure heads (mock) |
| GET | `/api/master/guesthouse-types` | Guest house list (mock) |
| GET | `/api/master/room-types/:guestHouseTypeId` | Room types (mock) |
| GET | `/api/master/tariff-details` | Tariff table (mock) |
| GET | `/api/master/application/:bookingId` | Application detail (mock) |
| GET | `/api/user/current-user` | Current employee (config) |
| GET | `/api/verifier/pending-applications` | Verifier queue (mock) |
| GET | `/api/verifier/dashboard-counts` | Verifier stats (mock) |
| GET | `/api/verifier/:bookingId` | Single application (mock) |
| PUT | `/api/verifier/status/:bookingId` | Verify/reject (logs only) |
| GET | `/api/approver/pending-applications` | Approver queue (mock) |
| GET | `/api/approver/dashboard-counts` | Approver stats (mock) |
| PUT | `/api/approver/status/:bookingId` | Approve/reject (logs only) |
| GET | `/api/guesthouse-incharge/applications` | All / action-required apps |
| GET | `/api/guesthouse-incharge/dashboard-counts` | Incharge stats |
| GET | `/api/guesthouse-incharge/applications/:bookingId` | Application detail |
| GET | `/api/guesthouse-incharge/applications/:bookingId/available-rooms` | Room picker |
| POST | `/api/guesthouse-incharge/applications/:bookingId/allocations` | Allocate rooms |
| GET | `/api/guesthouse-incharge/receipt/:bookingId` | Receipt data (mock) |

#### Called by frontend but **missing or broken** on backend

| Method | Endpoint | Used by |
|--------|----------|---------|
| GET | `/api/my-bookings/:userId` | MyGuestHouseBookings, GuestHouseRequests |
| GET | `/api/my-transport-bookings/:userId` | MyTransportBookings, TransportRequests |
| GET | `/api/dashboard-stats/:userId` | UserDashboard |
| POST | `/api/transport` | TransportForm |
| GET | `/api/admin/bookings` | AdminDashboard |
| GET | `/api/admin/stats` | AdminDashboard |
| DELETE | `/api/delete-booking/:id` | AdminDashboard |
| GET | `/api/approver/:bookingId` | ApproverApplicationPage |
| PUT | `/api/approver/:bookingId` | ApproverAction (**wrong path** — should be `/status/:bookingId`) |

#### Defined but not mounted

- `/api/room-charges` (`roomChargeRoutes`)
- Transport routes (`transportRoutes.js` is empty)

---

## 6. Component Hierarchy

### Top-level tree

```
App
├── MainDashboard
├── GuestHouseDashboard ──► GuestHouseForm ──► GuestHousePreview
├── TransportDashboard ──► TransportForm
├── UserDashboard
├── MyRequests ──► MyGuestHouseBookings / MyTransportBookings
├── RequestTracking
├── VerifierDashboard
│     ├── DashboardPage
│     │     ├── DashboardCards
│     │     └── DashboardTable
│     ├── ApplicationView          ⚠ missing import in VerifierDashboard
│     └── VerifierAction (TakeAction)
├── VerifierApplicationPage
│     ├── ApplicationView
│     └── VerifierAction
├── ApproverDashboard
│     └── (similar dashboard pattern)
├── ApproverApplicationPage
│     ├── ApplicationView
│     └── ApproverAction (TakeAction)
├── GHInchargeDashboard
│     └── DashboardCards + custom table
├── GHAllocationPage
│     ├── ApplicationView
│     └── RoomAllocationPanel
├── GHCheckInDashboard
├── GHCheckInPage
├── ReceiptPage
├── GuestHousePrintPage
│     └── ApplicationView
├── TransportInchargeDashboard
├── TransportAllocationPage
└── AdminDashboard
      ├── AdminHeader
      └── AdminSidebar
```

### Dashboard composition pattern

Most role dashboards follow:

```
Page
  └── DashboardPage (title, cards, table)
        ├── DashboardCards (stat cards)
        └── DashboardTable (application list + actions)
```

Guest House Incharge uses a **custom implementation** of the same pattern inline in `GHInchargeDashboard.jsx` rather than `DashboardPage`.

---

## 7. Reusable Components

| Component | Location | Used for |
|-----------|----------|----------|
| `DashboardPage` | `components/Dashboard/` | Verifier/Approver dashboard shell |
| `DashboardCards` | `components/Dashboard/` | KPI stat cards |
| `DashboardTable` | `components/Dashboard/` | Tabular application list |
| `ApplicationView` | `components/Dashboard/` | Read-only booking detail panel |
| `GuestHousePrintPage` | `components/Dashboard/` | Printable application view |
| `RoomAllocationPanel` | `pages/guesthouseIncharge/` | Room selection + charge calculation |
| `Modal` | `components/Modal/` | Generic modal overlay |
| `TariffModal` | `components/` | Tariff reference popup on booking form |
| `MobileNumberInput` | `components/Common/` | Country code + 10-digit validation |
| `EmailInput` | `components/Common/` | Email field with styling |
| `NationalityInput` | `components/Common/` | Nationality selector |
| `GuestHouseApplicationPDF` | `components/Common/` | PDF export (present, usage TBD) |
| `UserSwitcher` | `components/` | Dev role switcher |
| `AdminHeader` / `AdminSidebar` | `components/` | Admin layout chrome |
| `FormSection` | inline in `GuestHouseForm` | Section wrapper with step icon |

### Shared styles

- `theme.css` — CSS variables / global theme
- `dashboard.css` — ERP table and card styles
- Role-specific: `verifier.css`, `approver.css`, `ghIncharge.css`, `ghcheckIn.css`, etc.

---

## 8. Missing Features

Compared to `frontend/WORKFLOW.md` and UI stubs, the following are **not implemented or incomplete**:

### Authentication & authorization
- [ ] CIMS / SSO integration (planned in WORKFLOW.md)
- [ ] JWT or session-based auth
- [ ] Route guards by role
- [ ] Backend middleware to validate current user on each request

### Guest House workflow
- [ ] Persist bookings to SQL Server (controller is mock)
- [ ] `GuestHouseWorkflowHistory` audit trail table and API
- [ ] Dynamic verifier/approver assignment from DB (`assignmentService` uses static config)
- [ ] Email notifications wired to real workflow events (partial dead code in verifier)
- [ ] Check-out flow (`GHCheckOutDashboard.jsx`, `GHCheckOutPage.jsx` are **empty**)
- [ ] Check-in API integration (`GHCheckInPage` uses hardcoded booking data + `alert()`)
- [ ] Room availability calendar not routed in `App.jsx`
- [ ] Receipt generation tied to real charges (`roomChargeRoutes` not mounted)

### Applicant / user features
- [ ] `/api/my-bookings/:userId` — list user's applications
- [ ] `/api/dashboard-stats/:userId` — dashboard counters
- [ ] `RequestTracking` — static timeline, no API
- [ ] Cancel / amend booking

### Transport module
- [ ] Backend transport CRUD (`transportRoutes.js` empty)
- [ ] Transport incharge allocation API
- [ ] Transport workflow (verifier/approver analog)

### Admin module
- [ ] Admin API endpoints (`/api/admin/*`, delete booking)
- [ ] Guest house master data management (create/edit guest houses)

### Infrastructure
- [ ] Backend `start` / `dev` npm script
- [ ] Environment example (`.env.example`)
- [ ] Automated tests (frontend or backend)
- [ ] API documentation (OpenAPI/Swagger)
- [ ] Database migration runner
- [ ] File upload storage for ID proofs and supporting documents

### Dependencies declared but unused
- `@reduxjs/toolkit`, `react-redux`
- `firebase`
- `mysql2`

---

## 9. Potential Bugs

### Critical — will break build or runtime

| # | Issue | Location |
|---|-------|----------|
| 1 | **Invalid JSX at module scope** — `<UserSwitcher />` appears outside the `App` function, between imports and component definition. This is invalid JavaScript/JSX and should fail compilation. | `frontend/src/App.jsx:29` |
| 2 | **`ApplicationView` used but not imported** — VerifierDashboard renders `<ApplicationView>` without an import statement. | `frontend/src/pages/Verifier/VerifierDashboard.jsx` |
| 3 | **Case-sensitive import path** — `import GuestHousePreview from "./pages/GuestHouse/GuestHousePreview"` but folder is `guesthouse/`. Fails on Linux/macOS CI. | `frontend/src/App.jsx:19` |

### High — incorrect API integration

| # | Issue | Location |
|---|-------|----------|
| 4 | **Wrong approver API URL** — Frontend calls `PUT /api/approver/:bookingId` but backend expects `PUT /api/approver/status/:bookingId`. | `ApproverAction.jsx` |
| 5 | **Wrong toast branch** — Compares `status === "approved"` (lowercase) but radio values are `"Approved"` / `"Rejected"`. Success toast never shows on approve. | `ApproverAction.jsx:26` |
| 6 | **`EmployeeId` vs `EmployeeID` mismatch** — UserContext uses `EmployeeID`; many pages use `user.EmployeeId` (undefined), breaking my-bookings and dashboard API URLs. | UserContext vs MyGuestHouseBookings, UserDashboard, TransportForm |
| 7 | **Frontend calls APIs that do not exist** — my-bookings, transport, admin, dashboard-stats will 404. | Multiple pages |

### Medium — logic / data issues

| # | Issue | Location |
|---|-------|----------|
| 8 | **Unreachable / duplicate response in verifier** — `updateVerifierStatus` sends `res.json()` then unconditionally runs `sendEmail()` after the try/catch, which can cause "headers already sent" errors. | `verifierController.js:67-115` |
| 9 | **Hardcoded verifier employee** — Backend filters pending apps with `loggedInEmployee = "EMP004"` while UserSwitcher uses `EMP001` for Verifier role. UI role switch has no effect on API data. | `verifierController.js:28` |
| 10 | **Duplicate current-user services** — `routes/currentUserService.js` (EmployeeId) vs `services/currentUserService.js` (re-exports config) vs `config/currentUser.js` (EmployeeID). Inconsistent field names. | Backend |
| 11 | **Mock booking always returns ID 101** — Every form submission gets the same ID; allocation/check-in flows may show wrong data. | `guestHouseBookingController.js` |
| 12 | **DashboardTable hardcodes verifier routes** — Print/View buttons navigate to `/verifier/application/` regardless of which dashboard uses the table. | `DashboardTable.jsx` |
| 13 | **CSS filename case mismatch** — Import `../../styles/ghCheckIn.css` vs file `ghcheckIn.css` (case differs). Breaks on case-sensitive filesystems. | `GHCheckInPage.jsx` |

### Low — code quality

| # | Issue | Location |
|---|-------|----------|
| 14 | Unused imports in `main.jsx` (`StrictMode`, duplicate `createRoot`) | `main.jsx` |
| 15 | `openRoute` prop passed to `DashboardTable` but never used — selection uses hardcoded navigate instead | `DashboardTable.jsx` |
| 16 | `GuestHousePreview` uses `fetch(data.uploadedFileUrl)` without `await` on a non-Promise in some paths | `GuestHousePreview.jsx` |
| 17 | Occupant table has 6 columns in body but 5 in header (extra Remove column) | `GHCheckInPage.jsx` |

---

## 10. Areas for Improvement

### Architecture

1. **Centralize API layer** — Create `frontend/src/api/client.js` with base URL, auth headers, and consistent error handling.
2. **Unify user model** — Standardize on `EmployeeID` (or `EmployeeId`) across frontend context, backend services, and API payloads.
3. **Activate real DB layer** — Uncomment and reconcile SQL in controllers; remove mock arrays once verified against schema.
4. **Add auth middleware** — Express middleware reading session/JWT; pass user to controllers instead of static config.
5. **Split monolithic server.js** — Remove ~500 lines of commented legacy routes; keep only active route registration.

### Backend

6. **Mount missing routes** — Implement and register transport, admin, user bookings, room charges.
7. **Workflow service integration** — Wire `assignWorkflow()` to `GuestHouseUserAccess` table (commented code exists).
8. **Transaction safety** — The commented allocation logic uses `SERIALIZABLE` isolation and overlap checks; prioritize enabling this for production.
9. **Audit trail** — Implement `GuestHouseWorkflowHistory` inserts on every status change.
10. **npm scripts** — Add `"start": "node server.js"` and `"dev": "nodemon server.js"`.
11. **Remove unused deps** — Drop `mysql2` if SQL Server is the sole target.

### Frontend

12. **Fix App.jsx structure** — Move `<UserSwitcher />` inside `App` return (or a layout route); fix import casing.
13. **Protected routes** — Wrap role routes in a `RequireRole` component using `UserContext`.
14. **Complete check-out module** — Implement pages, routes, and API (mirror check-in pattern).
15. **Wire RoomAvailabilityCalendar** — Add route under GH Incharge; connect to room allocation data.
16. **Consistent dashboard abstraction** — Refactor GH Incharge to use `DashboardPage` or extract shared `ApplicationTable`.
17. **Remove dead dependencies** — Redux, Firebase if not planned.

### Database

18. **Schema consolidation** — Resolve `GuestHouseBookings` vs `GuestHouseRoomBookings` naming in SQL comments.
19. **Migration tooling** — Add numbered migrations and a runner (e.g. `db-migrate`, or simple Node script).
20. **Seed data script** — Guest types, room types, sample rooms for local dev.

### DevOps & quality

21. **Environment template** — Document required `DB_*` and `VITE_API_URL` variables.
22. **Testing** — API integration tests for booking → verify → approve → allocate flow.
23. **Linting in CI** — ESLint is configured but no pre-commit/CI enforcement visible.
24. **Case-sensitive CI** — Build on Linux to catch path casing bugs early.

### Security (before production)

25. Never store passwords in queries (legacy commented login used plain-text password comparison).
26. Validate and sanitize all SQL inputs (parameterized queries are used in commented code — good pattern to keep).
27. Restrict CORS to known frontend origin.
28. Do not hardcode personal email addresses in email service (`rudrammategur5@gmail.com`).

---

## Appendix A — Role → Route Map

| Role | Primary routes |
|------|----------------|
| Applicant | `/guesthouse`, `/my-guesthouse-bookings`, `/my-requests` |
| Verifier | `/verifier`, `/verifier/application/:id`, `/verify/:id` |
| Approver | `/approver`, `/approver/request/:id` |
| GH Incharge | `/gh-incharge`, `/guesthouse-incharge/allocation/:id`, `/gh-incharge/checkins` |
| Transport Incharge | `/transport-incharge`, `/transport-allocation/:id` |
| Admin | `/admin` |

## Appendix B — Documented vs Actual Workflow Status Values

| Stage | WORKFLOW.md | Code (typical) |
|-------|-------------|----------------|
| Submit | Pending | Submitted |
| After verify | Verified | Verified |
| After approve | Approved | Approved |
| After allocation | Allocated | Allocated |
| Check-in | Checked In | Checked-In (in SQL comments) |
| Check-out | Checked Out | Not implemented |

Status string inconsistency (`Pending` vs `Submitted`, `Checked In` vs `Checked-In`) should be normalized before DB integration.

---

*This analysis is based on a full read of source files under `backend/` (excluding `node_modules`) and `frontend/src/` as of the analysis date. No source files were modified during this review.*
