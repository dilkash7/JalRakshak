# JalRakshak — Smart Water Conservation & Leak Reporting System

> **Developed by Team Elevate**  
> *Cleaner Water • Safer Communities*

JalRakshak is an enterprise-grade civic technology platform that empowers citizens to report freshwater pipeline breaches, surface leaks, and municipal valve failures in real time. The platform provides transparent, privacy-safe public status tracking alongside an authenticated municipal administration portal for field dispatch, triage, and resolution management.

---

## 🌟 Key Architectural Features

- **Pixel-Fidelity Homepage:** Direct reproduction of the Team Elevate reference mockup, featuring a high-contrast forest-green and warm-white palette, responsive metric cards, a 3-step action roadmap, and rich imagery.
- **Unguessable Reference Identifiers:** Reports are assigned non-sequential IDs formatted as `JR-XXXXXXXXXX` (using a 33-character unambiguous alphabet that excludes `0`, `O`, `1`, `I`, `l`). Over $1.5 \times 10^{15}$ combinations eliminate ID enumeration.
- **Strict Privacy Invariant (`toPublicReport`):** Public tracking responses pass through a single centralized allowlist serializer. Reporter names, telephone numbers, emails, exact coordinates, and internal staff notes are never exposed over public endpoints.
- **Zero-Config Local Development:** The platform includes an in-memory repository fallback. Developers and evaluators can run, test, and audit the application immediately without provisioning external cloud accounts.
- **Production-Grade Integrations:**
  - **Database:** MongoDB Atlas via Mongoose with connection pooling and compound indexing (`reportId`, `status`, `city`, `createdAt`).
  - **Asset Security:** Signed Cloudinary uploads (`POST /api/uploads/sign`) restricting files to 5 MB and validated formats (JPEG, PNG, WebP).
  - **Abuse Prevention:** Distributed token-bucket rate limiting via Upstash Redis in production, with an in-memory LRU fallback for local testing.
  - **Staff Security:** Auth.js / NextAuth JWT sessions with `httpOnly` secure cookies and `bcryptjs` password hashing. Zero hardcoded administrator credentials.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 14 (App Router), React 18, TypeScript (Strict Mode) |
| **Styling & UI** | Tailwind CSS, Lucide React Outline Icons |
| **Database** | MongoDB Atlas with Mongoose (with resilient in-memory dev store) |
| **Media Pipeline** | Cloudinary (Signed client uploads with server validation) |
| **Authentication** | Auth.js / NextAuth (JWT session, bcrypt password hashing, RBAC) |
| **Validation** | Zod (End-to-end type validation for forms and API routes) |
| **Rate Limiting** | Upstash Redis REST API / Local Memory Token Bucket |
| **Testing** | Vitest (Unit tests) + Playwright (E2E browser & visual regression) |
| **Deployment** | Vercel Serverless Edge Configuration |

---

## 🗺️ Application Routes

### Public Pages
- `/` — Homepage matching the exact reference mockup with hero drop asset, live stats strip, 3-step timeline, and mission river card.
- `/report` — Multi-step leak reporting wizard with GPS auto-detection ("Use My Location"), photo upload preview, review step, and copyable Report ID.
- `/track` — Public tracking search by Report ID, plus a paginated feed of recent community reports with category and status filters.
- `/track/[id]` — Real-time public resolution stepper, verified category, general area, and public resolution summary.
- `/save-water` — Actionable household conservation guides, silent leak 15-minute diagnostic meter test, interactive savings calculator, and FAQ accordion.
- `/about` — Team Elevate mission, urban water loss challenges, and platform architecture.

### Staff Administration Portal
- `/admin/login` — Protected staff login with rate limiting and secure session cookie issuance.
- `/admin` — Municipal operations dashboard featuring KPI cards, filterable report queue, search by location, and status badges.
- `/admin/reports/[id]` — Triage console: status transitions, staff assignments, internal notes thread, and public resolution publishing.

### API Endpoints
- `POST /api/reports` — Idempotent citizen report submission.
- `GET /api/reports` — Paginated community feed (strictly sanitized via `toPublicReport()`).
- `GET /api/reports/[id]` — Single report lookup by `JR-` ID.
- `GET /api/stats` — Real-time aggregate platform statistics (Total Reports, In Progress, Resolved, Litres Saved).
- `POST /api/uploads/sign` — Cloudinary signed upload parameters.
- `POST /api/auth/login` — Staff credentials authentication.
- `POST /api/auth/logout` — Clear staff session cookie.
- `GET /api/auth/me` — Verify authenticated session.
- `GET /api/admin/reports` — Authenticated full report list for dispatch staff.
- `GET /api/admin/reports/[id]` — Authenticated full report detail.
- `PATCH /api/admin/reports/[id]` — Status transitions, staff assignments, and internal notes.
- `GET /api/admin/analytics` — Status breakdown and regional incident statistics.

---

## 🚀 Quickstart & Local Development

### 1. Clone & Install Dependencies
```bash
cd Jalrakshak
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

For zero-config local development, you can start the application immediately. Leave `MONGODB_URI`, `CLOUDINARY_*`, and `UPSTASH_*` blank; the platform will operate using its resilient development stores.

### 3. Provision the Administrator Account
The seed script reads `ADMIN_EMAIL` and `ADMIN_PASSWORD` from your environment. Run:
```bash
ADMIN_EMAIL="admin@jalrakshak.org" ADMIN_PASSWORD="YourStrongPassword123!" npm run seed
```
*(On Windows PowerShell:)*
```powershell
$env:ADMIN_EMAIL="admin@jalrakshak.org"; $env:ADMIN_PASSWORD="YourStrongPassword123!"; npm run seed
```

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Quality Assurance

### Run Unit Tests
```bash
npm test
```
Executes the Vitest test suite verifying:
- Unambiguous `JR-XXXXXXXXXX` nanoid generation and collision resistance.
- `toPublicReport()` privacy guarantees (zero leakage of reporter name, phone, email, private coordinates, or internal notes).
- Zod schema validation for all API inputs.

### Run Type Checking
```bash
npx tsc --noEmit
```

### Run Production Build
```bash
npm run build
```

---

## 🔒 Security Invariants

1. **Zero Raw Database Leakage:** Mongoose documents are never directly serialized to public JSON. The allowlisted `toPublicReport()` function is the single gatekeeper.
2. **Idempotency Protection:** Clients transmit an `idempotencyKey` UUID v4 header/body payload. Duplicate submissions within 15 minutes are deduplicated server-side.
3. **No Hardcoded Credentials:** All credentials, JWT signing keys, and administrator passwords are read strictly from runtime environment variables.
4. **Server-Side Authorization:** Every administrative route (`/api/admin/*` and `/admin/*`) independently checks the verified session cookie on the server.

---

## ☁️ Deployment Guide (Vercel & MongoDB Atlas)

1. **MongoDB Atlas:** Create a free M0 cluster, configure a database user, and copy the connection string into Vercel's `MONGODB_URI`.
2. **Cloudinary:** Register for a free Cloudinary account and set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`.
3. **Upstash Redis:** Create an Upstash serverless Redis database and set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`.
4. **Deploy to Vercel:**
   - Link the repository to Vercel.
   - Configure the environment variables specified in `.env.example`.
   - Trigger deployment.
   - Run `npm run seed` via Vercel CLI or build hook to initialize the production administrator.

---

## 📄 License & Attribution

Designed and engineered by **Team Elevate** for the **JalRakshak** Smart Water Conservation and Civic Reporting Initiative.
