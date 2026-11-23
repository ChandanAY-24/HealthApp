# GEMINI.md — HealthApp-Halsa Agent Operations & Project Memory

This manual serves as persistent project memory and operational guidelines for AI agents working in the **HealthApp-Halsa** repository.

---

## 1. Project Overview & Architecture
Halsa is a privacy-first, offline-capable Personal Health Record (PHR) application with an Ink & Lime aesthetic and telemetry tracking.

### Core Stack
- **Frontend**: React 18, TypeScript, Vite SPA (`frontend/`).
- **Styling**: Native CSS tokens in `frontend/css/` implementing the Ink & Lime design system.
- **State Management**: Reactive in-memory store (`frontend/src/store.ts`) with optimistic mutations and a 6-second reversible action undo stack.
- **Routing**: Lightweight hash/history router (`frontend/src/router.ts`) serving 11 clinical domains.
- **Backend**: FastAPI REST service (`backend/app/main.py`) running on Python 3.10+, backed by SQLAlchemy SQLite datastore.

---

## 2. Directory Layout & Conventions

```
HealthApp-Halsa/
├── frontend/
│   ├── css/                  # Per-feature stylesheets (vitals.css, meds.css, etc.)
│   ├── src/
│   │   ├── pages/            # 11 clinical domain views
│   │   ├── ui/               # SVG telemetry charts, kit widgets
│   │   ├── store.ts          # State store & undo event stack
│   │   ├── router.ts         # Path matching and view dispatch
│   │   └── finder.ts         # Command+K spotlight search index
│   └── tests/                # Vitest unit test suites
├── backend/
│   ├── app/
│   │   ├── routers/          # Endpoints (/vitals, /medications, /care, /reports)
│   │   ├── models/           # SQLAlchemy database entities
│   │   ├── schemas/          # Pydantic input/output schemas
│   │   └── services/         # Seed data & business logic
│   └── tests/                # Pytest integration tests
├── ARCHITECTURE.md           # Formal system specifications & UML
├── CHECKLIST.md              # Feature audit and parity verification checklist
├── GEMINI.md                 # Agent memory & operations manual (this file)
├── README.md                 # Project documentation & developer onboarding
└── LICENSE                   # Project license notice
```

---

## 3. Agent Development Rules

### Rule 1: Ink & Lime Design Consistency
- Do NOT install or inject heavy external UI frameworks (e.g. Tailwind, MUI, Bootstrap).
- Use existing CSS variables defined in `frontend/app.css` and `frontend/css/`:
  - Accent / Highlights: `var(--lime)` (`#d6ff65`), `var(--on-lime)` (`#2d2e33`)
  - Backgrounds: `var(--ground)` (`#dfe3e6` / `#0f1012`), `var(--frame)` (`#ffffff` / `#17181b`)
  - Typography: `var(--ink)` (`#2d2e33` / `#f1f2f4`), `var(--muted)` (`#67686e` / `#a3a4aa`)

### Rule 2: Reversible State & Optimistic Updates
- When modifying health records, dose completions, or vitals in `frontend/src/store.ts`, maintain the optimistic update pattern with reversible action undo callbacks.

### Rule 3: Content Safety & Originality
- Synthesize project-specific code and documentation tailored strictly to Halsa.
- Avoid outputting monolithic generic boilerplates or verbatim legal texts that can trigger recitation safety filters.

---

## 4. Verification & Testing Commands

- **Frontend Tests**:
  ```bash
  cd frontend && npm test
  ```
- **Frontend Build**:
  ```bash
  cd frontend && npm run build
  ```
- **Backend Tests**:
  ```bash
  cd backend && pytest
  ```
