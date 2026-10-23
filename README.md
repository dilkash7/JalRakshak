# JalRakshak — Smart Water Conservation & Leak Reporting System

> **Developed by Team Elevate**  
> *Cleaner Water • Safer Communities*

JalRakshak is an enterprise-grade civic technology prototype that empowers citizens to report freshwater pipeline breaches, surface leaks, and municipal valve failures in real time. The platform provides transparent, privacy-safe public status tracking alongside an authenticated municipal administration portal for field dispatch, triage, and resolution management.

---

## 🌟 Key Architectural Features

- **Pixel-Fidelity Homepage:** Direct reproduction of the Team Elevate reference mockup, featuring a high-contrast forest-green and warm-white palette, responsive metric cards, a 3-step action roadmap, and rich imagery.
- **Browser-Only Data Storage:**
  - **`localStorage`:** Central repository for report records, staff accounts, administrative jurisdictions, triage notes, and demo sessions.
  - **`IndexedDB`:** Dedicated binary storage for citizen and resolution photographs. Zero Base64 quota overflow issues.
- **Deterministic Auto-Routing Engine:** Auto-routes citizen leak reports by matching the selected State, District, and Taluk with registered field officers. If multiple officers match, the engine assigns to the officer with the lowest open-report workload. Reports without a matching officer enter the **Unassigned Queue**.
- **Unguessable Reference Identifiers:** Reports are assigned non-sequential IDs formatted as `JR-XXXXXXXXXX` (using a 33-character unambiguous alphabet that excludes `0`, `O`, `1`, `I`, `l`). Over $1.5 \times 10^{15}$ combinations eliminate ID enumeration.
- **Strict Privacy Invariant (`toPublicReport`):** Public tracking responses pass through a single centralized allowlist serializer. Reporter names, telephone numbers, emails, exact coordinates, and internal staff notes are never exposed over public endpoints.
- **Zero-Config Vercel Deployment:** The prototype requires **ZERO external environment variables** or paid databases. It deploys to Vercel in 1 click and runs immediately out of the box.
- **In-App "Reset Demo Data" Action:** Evaluators can restore clean baseline competition demo reports, sample officers, and verified statistics at any time from the Admin Dashboard with one click.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 14 (App Router), React 18, TypeScript (Strict Mode) |
| **Styling & UI** | Tailwind CSS, Lucide React Outline Icons |
| **Data Storage** | Browser `localStorage` (Structured JSON records) |
| **Media Pipeline** | Browser `IndexedDB` (Binary Blobs & instant Object URLs) |
| **Authentication** | Client-Side Demo Session Auth (Admin & Field Officer Badge ID) |
| **Validation** | Zod (End-to-end type validation for forms and records) |
| **Testing** | Vitest (Automated unit tests covering routing, ID, serializers, validation) |
| **Deployment** | Vercel Serverless Edge Configuration (Zero-config) |

---

## 🗺️ Application Routes

### Public Pages
- `/` — Homepage matching the exact reference mockup with hero drop asset, live stats strip, 3-step timeline, and mission river card.
- `/report` — Multi-step leak reporting wizard with GPS auto-detection ("Use My Location"), IndexedDB photo storage, review step, and copyable Report ID.
- `/track` — Public tracking search by Report ID, plus a paginated feed of recent community reports with category and status filters.
- `/track/[id]` — Real-time public resolution stepper, verified category, general area, and public resolution summary.
- `/save-water` — Actionable household conservation guides, silent leak 15-minute diagnostic meter test, interactive savings calculator, and FAQ accordion.
- `/about` — Team Elevate mission, urban water loss challenges, and platform architecture with browser storage disclosure.

### Operations & Staff Portals
- `/admin/login` — Dedicated administrator login portal with quick-fill demo credentials.
- `/staff/login` — Taluk field officer login portal with dynamic quick-fill cards for all registered demo officers.
- `/admin` — Operations console:
  - **All Reports Queue:** Filter by status, category, taluk, and search query.
  - **Unassigned Queue:** Triage reports requiring manual officer assignment.
  - **Field Officers Directory:** Register new officers with automatic staff badge IDs, cascade State > District > Taluk, toggle active/suspended status, and view real-time open workloads.
  - **Reset Demo Data Action:** Modal confirmation to restore initial competition state.
- `/admin/reports/[id]` — Triage console: status transitions, staff assignments, internal notes thread, repair proof photos, and water-saved calculation.

---

## 🔑 Demonstration Credentials

| Role | Identifier / Email | Password | Assigned Area |
|---|---|---|---|
| **Master Admin** | `admin@jalrakshak.org` | `JalRakshak@2026Admin!` | All Jurisdictions |
| **Puttur Officer** | `STF-PUTTUR-01` | `JalRakshak@2026Staff!` | Karnataka > Dakshina Kannada > Puttur |
| **Mangaluru Officer** | `STF-MNG-01` | `JalRakshak@2026Staff!` | Karnataka > Dakshina Kannada > Mangaluru |

*(New officers registered via the Admin Console are assigned unique Badge IDs like `STF-KABNT-4819` and can log in immediately).*

---

## 🚀 Quickstart & Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
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
Executes the Vitest test suite (22 tests) verifying:
- Unambiguous `JR-XXXXXXXXXX` nanoid generation and collision resistance.
- Deterministic auto-routing by Taluk with lowest-workload tie breaking.
- `toPublicReport()` privacy guarantees (zero leakage of reporter name, phone, email, private coordinates, or internal notes).
- Zod schema validation.

### Run Type Checking
```bash
npx tsc --noEmit
```

### Run Production Build
```bash
npm run build
```

---

## 🌐 Browser Storage Scope & Limitations

1. **Origin-Bound:** Data lives inside the user's browser for the active domain origin (`http://localhost:3000` locally, or `https://<app>.vercel.app` in deployment).
2. **Device Isolation:** Different devices and separate browser profiles maintain independent local stores.
3. **Data Preservation:** Local data persists across page refreshes and browser restarts in the same profile.
4. **Data Reset:** Clicking **"Reset Demo Data"** in the Admin Console restores pristine competition demo records and sample officers.

---

## 📄 License & Attribution

Designed and engineered by **Team Elevate** for the **JalRakshak** Smart Water Conservation and Civic Reporting Initiative.
