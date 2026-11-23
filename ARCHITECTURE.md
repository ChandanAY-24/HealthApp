# Halsa — System Design & Architecture Document

This document provides a comprehensive technical architecture and system design specification for **Halsa**, a high-fidelity Personal Health Record (PHR) application engineered with an "Ink & Lime" design system, optimistic state persistence with reversible undo queues, and a decoupled FastAPI backend.

---

## 1. High-Level Design (HLD)

### 1.1 System Context (C4 Model Level 1)
The primary actors and external boundaries interacting with Halsa:

```mermaid
graph TD
    User["👤 Patient / Primary User"]
    Wearables["⌚ Wearable Devices (Apple Watch / Withings)"]
    ClinicSystem["🏥 Clinic / Provider Portals"]
    
    subgraph HalsaPHR ["Halsa Personal Health Record System"]
        FrontendSPA["🖥️ React 18 SPA (Offline-First Store + GSAP)"]
        BackendAPI["⚡ FastAPI REST Service (.venv)"]
        LocalStorage["💾 Browser LocalStorage (Encrypted Cache)"]
        SQLiteDB["🗄️ SQLite Clinical Datastore"]
    end

    User -->|"Interacts, views telemetry, logs vitals, ticks meds"| FrontendSPA
    Wearables -.->|"Syncs heart rate, steps, SpO2"| FrontendSPA
    FrontendSPA <-->|"Optimistic mutations & Undo stack"| LocalStorage
    FrontendSPA <-->|"RESTful sync & export triggers"| BackendAPI
    BackendAPI <-->|"SQLAlchemy ORM Sessions"| SQLiteDB
    ClinicSystem -.->|"Clinical reports & summaries"| BackendAPI
```

### 1.2 Container Architecture (C4 Model Level 2)
```mermaid
graph LR
    subgraph Client ["Client Browser Runtime (Vite + React)"]
        UI["UI Layer: Pages & Components"]
        Store["State Engine & Undo Queue (src/store.ts)"]
        ChartsEngine["SVG High/Low Range Charts Engine"]
        Finder["Spotlight Quick Finder (Cmd+K)"]
        Router["Client-Side Route Engine (Hash/PushState)"]
    end

    subgraph Server ["Backend Host (.venv)"]
        APIGateway["FastAPI Gateway (main.py)"]
        VitalsRouter["/api/vitals Router"]
        MedsRouter["/api/medications Router"]
        CareRouter["/api/care Router"]
        ReportsRouter["/api/reports Router"]
        DatabaseEngine["SQLAlchemy Engine + SQLite"]
    end

    UI --> Router
    UI --> Store
    UI --> ChartsEngine
    UI --> Finder
    Store <-->|"JSON Serialized Cache"| BrowserCache[("LocalStorage")]
    Store -.->|"HTTP Async Sync"| APIGateway
    APIGateway --> VitalsRouter
    APIGateway --> MedsRouter
    APIGateway --> CareRouter
    APIGateway --> ReportsRouter
    VitalsRouter --> DatabaseEngine
    MedsRouter --> DatabaseEngine
    CareRouter --> DatabaseEngine
    ReportsRouter --> DatabaseEngine
```

---

## 2. Low-Level Design (LLD)

### 2.1 Component Composition Hierarchy
```
App Shell (src/App.tsx)
├── Aside Sidebar (Desktop Nav: Brand, 11 Nav Links, Badges, Profile Tag)
├── Header TopBar (Quick Finder Trigger, Theme Toggle Sun/Moon)
├── Main Content Body
│   ├── HomePage (4 Metric Tiles, LivePulseLine, 14d Chart, Meds Checklist, BoxBreathing, WaterMeter, NextApt)
│   ├── VitalsPage (Subnav Tabs, RangeSelector, HighLowBarChart, VitalsLogTable, LogVitalModal)
│   ├── ActivityPage (Concentric ActivityRings, Daily Metrics, WorkoutList)
│   ├── SleepPage (SleepScoreHero, HypnogramMultiTrack, SleepStagesLegend)
│   ├── FoodPage (MacroGrid, WaterTracker, MealTimeline, LogMealModal)
│   ├── MedsPage (MedTimeline, StockTracker, RefillButton, 4-Week AdherenceGrid)
│   ├── RecordsPage (SubTabs, LabRangeSlider, ScanCards, VaccineList)
│   ├── CarePage (UpcomingConsultations, ProviderGrid, SlotPicker, BookingModal)
│   ├── ReportsPage (MultiMetric30/90dTrends, CSVExport, PrintStylesheet)
│   ├── SettingsPage (ProfileInputs, UnitToggle, DeviceList, ResetDataButton)
│   └── HelpPage (EmergencyAlertBanner, ClinicalFAQ, MetricExplanations)
├── Mobile BottomTabBar (Small screens only: Home, Vitals, Meds, Care, Settings)
├── ToastUndoQueue (Reversible state action notification & Undo trigger)
└── QuickFinder (Cmd+K spotlight search modal with fuzzy index)
```

---

## 3. Data Flow Diagrams (DFD)

### 3.1 DFD Level 0 — Context Diagram
```mermaid
flowchart TD
    User([User / Patient])
    HalsaApp[[Halsa PHR Application]]
    ReportsEngine[[Reports & Export Engine]]
    ExternalStore[(Local / Remote Storage)]

    User -->|Logs vitals, marks doses, books slots| HalsaApp
    HalsaApp -->|Renders dynamic charts, alerts, undo toasts| User
    HalsaApp -->|Persists domain state| ExternalStore
    ExternalStore -->|Hydrates state on load| HalsaApp
    HalsaApp -->|Requests aggregated analytics| ReportsEngine
    ReportsEngine -->|Produces CSV & Print reports| User
```

### 3.2 DFD Level 1 — Feature Decomposition
```mermaid
flowchart TD
    subgraph Ingestion ["Telemetry & Action Ingestion"]
        A1["Vital Measurement Input"]
        A2["Medication Dose Toggle"]
        A3["Appointment Slot Selection"]
        A4["Hydration Glass Increment"]
    end

    subgraph Processing ["Store & Undo Pipeline"]
        B1["Store Mutation Dispatcher"]
        B2["Undo Stack Capture (Revert Closure)"]
        B3["Toast Notification Engine"]
    end

    subgraph StateAndOutput ["State Storage & Visual Projection"]
        C1[("LocalStorage Cache")]
        C2["Chart Reshaping Engine"]
        C3["UI Component Re-render"]
    end

    A1 & A2 & A3 & A4 --> B1
    B1 --> B2
    B2 --> B3
    B1 --> C1
    B1 --> C2
    C2 --> C3
    B3 -.->|"User triggers Undo"| B2
```

### 3.3 DFD Level 2 — High/Low Chart Normalization Pipeline
```mermaid
flowchart LR
    RawReadings["Raw Time-Series Readings (low, high, avg, date)"]
    FilterRange["Filter by Range (7d / 30d / 90d)"]
    FindExtremes["Compute Global Min & Max with 15% Padding"]
    NormalizeY["Map Values to Normalized SVG Y-Coordinates"]
    RenderSVG["Render Capsule Rectangles + Mean Dots + Day Labels"]
    InteractiveTap["User Tap Event -> Compute Reading -> Show Banner"]

    RawReadings --> FilterRange
    FilterRange --> FindExtremes
    FindExtremes --> NormalizeY
    NormalizeY --> RenderSVG
    RenderSVG --> InteractiveTap
```

---

## 4. Use Case Diagram

```mermaid
graph TD
    User((Patient User))

    subgraph UseCases ["Halsa PHR Use Cases"]
        UC1["UC-1: View Daily Health Overview"]
        UC2["UC-2: Inspect High/Low Vital Trends"]
        UC3["UC-3: Log New Vital Telemetry Reading"]
        UC4["UC-4: Toggle Scheduled Medication Dose"]
        UC5["UC-5: Revert Action via Undo Toast"]
        UC6["UC-6: Execute Box-Breathing Exercise"]
        UC7["UC-7: Book Care Provider Consultation"]
        UC8["UC-8: Review Clinical Lab Reference Ranges"]
        UC9["UC-9: Search Everything via Cmd+K Finder"]
        UC10["UC-10: Export CSV & Print Physician Report"]
    end

    User --> UC1
    User --> UC2
    User --> UC3
    User --> UC4
    User --> UC5
    User --> UC6
    User --> UC7
    User --> UC8
    User --> UC9
    User --> UC10
```

---

## 5. Workflow Diagrams

### 5.1 Medication Adherence & Undo Workflow
```mermaid
stateDiagram-v2
    [*] --> Scheduled: Dose Pending for Day
    Scheduled --> ToggledTaken: User clicks Dose Checkbox
    ToggledTaken --> ToastActive: Stock decremented by 1 & Undo Toast surfaced
    
    state ToastActive {
        [*] --> WaitingTimeout
        WaitingTimeout --> Expired: 6 seconds elapsed
        WaitingTimeout --> ClickedUndo: User clicks Undo button
    }
    
    ClickedUndo --> Scheduled: Revert state & restore inventory
    Expired --> Finalized: State persisted permanently
    Finalized --> [*]
```

### 5.2 Care Appointment Booking Workflow
```mermaid
flowchart TD
    Start([Browse Care Directory]) --> SelectDoc[Select Specialist / Provider]
    SelectDoc --> OpenModal[View Open Calendar Slots]
    OpenModal --> ChooseDate[Pick Target Date]
    ChooseDate --> ChooseSlot[Select Open Time Slot e.g. 10:00 AM]
    ChooseSlot --> ChooseMode[Select In-Person vs Video Call]
    ChooseMode --> Submit[Confirm Booking]
    Submit --> StoreUpdate[Store Appends Appointment]
    StoreUpdate --> NotifyToast[Surface Confirmation Toast]
    NotifyToast --> ReflectHome[Appointment Appears on Home & Care Schedules]
    ReflectHome --> End([Complete])
```

---

## 6. UML Diagrams

### 6.1 Class Diagram (Data Entities & Store)
```mermaid
classDiagram
    class VitalReading {
        +string id
        +string type
        +string timestamp
        +string date
        +float low
        +float high
        +float avg
        +string unit
        +float systolic
        +float diastolic
        +string note
    }

    class Medication {
        +string id
        +string name
        +string dosage
        +string frequency
        +string timeSlot
        +int stock
        +int refillThreshold
        +bool refillRequested
        +Map~string, bool~ history
    }

    class Appointment {
        +string id
        +string providerId
        +string providerName
        +string specialty
        +string date
        +string time
        +string type
        +string status
        +string notes
    }

    class LabResult {
        +string id
        +string testName
        +string category
        +float value
        +string unit
        +float refMin
        +float refMax
        +string status
        +string date
        +string doctorNotes
    }

    class Store {
        -AppState state
        -Set listeners
        -Array undoStack
        +getState() AppState
        +subscribe(listener) Unsubscribe
        +toggleMedicationDose(medId, date, notify)
        +logVital(reading, notify)
        +bookAppointment(apt, notify)
        +cancelAppointment(id, notify)
        +undoLatest() bool
        +resetAllData()
    }

    Store "1" *-- "*" VitalReading : manages
    Store "1" *-- "*" Medication : manages
    Store "1" *-- "*" Appointment : manages
    Store "1" *-- "*" LabResult : manages
```

### 6.2 Sequence Diagram: Logging Vital with Undo
```mermaid
sequenceDiagram
    autonumber
    actor User as Patient
    participant UI as VitalsPage (UI)
    participant Store as Store (Singleton)
    participant Stack as UndoStack
    participant Toast as ToastUndoQueue (Overlay)
    participant LocalDB as LocalStorage

    User->>UI: Inputs 72 bpm avg (65 low, 110 high) & clicks Save
    UI->>Store: logVital(reading, notify)
    Store->>Store: Prepend reading to state.vitals
    Store->>Stack: push({ label, revert: () => filterOut(id) })
    Store->>LocalDB: setItem(STORAGE_KEY, json)
    Store->>UI: notifyListeners()
    Store-->>Toast: notify("Logged 72 bpm", undoable: true)
    Toast-->>User: Displays Toast Banner with "Undo" Button
    
    alt User clicks Undo
        User->>Toast: Clicks "Undo"
        Toast->>Store: undoLatest()
        Store->>Stack: pop().revert()
        Store->>LocalDB: setItem(STORAGE_KEY, revertedJson)
        Store->>UI: notifyListeners()
        UI-->>User: Chart & Table reflect restored state
    else Timeout elapsed (6s)
        Toast-->>Toast: Auto dismiss
    end
```

---

## 7. Control Flow Diagram (CFD)

```mermaid
flowchart TD
    AppLaunch([Application Launched]) --> InitStore[Initialize Store & Check LocalStorage]
    InitStore --> HashCheck{Hash Route in URL?}
    HashCheck -- Yes --> ParseRoute[Set active route from Hash]
    HashCheck -- No --> DefaultHome[Default to #/home]
    ParseRoute & DefaultHome --> MountUI[Mount App Shell & Theme]
    MountUI --> Listeners[Register Cmd+K & Hash Change Listeners]
    Listeners --> UserInteraction{User Interaction Event}

    UserInteraction -- Route Change --> NavHandler[Change URL Hash & Re-render View]
    UserInteraction -- Cmd+K Pressed --> OpenFinder[Display Quick Spotlight Modal]
    UserInteraction -- State Mutation --> MutateHandler[Execute Action, Push Undo, Trigger Toast]
    UserInteraction -- Theme Switch --> ToggleTheme[Update data-theme on html element]
```

---

## 8. Coupling and Cohesion Analysis

### 8.1 Cohesion Analysis
- **`store.ts` (Functional & Sequential Cohesion)**: High cohesion. Contains solely domain entity schemas, unified state accessors, persistence bridges, and atomic rollback reversers.
- **`charts.tsx` (Functional Cohesion)**: High cohesion. Responsible strictly for SVG coordinate transformations, dynamic bar capsules, mean dot geometry, and interactive hover calculations.
- **`actions.tsx` (Communicational Cohesion)**: Encapsulates user notification toasts and reversible undo callbacks.
- **Page Modules (`pages/*.tsx`) (Logical Cohesion)**: Each page module encapsulates UI representation, specific modals, and presentation models for that single health domain (e.g. `vitals.tsx` handles only vital metric telemetry).

### 8.2 Coupling Analysis
- **Decoupled Architecture**: UI components do not interact directly with raw `localStorage` or SQL drivers. They interact through declarative Store methods (`store.logVital`, `store.toggleMedicationDose`).
- **Loose Coupling via Subscriptions**: The observer pattern (`store.subscribe(fn)`) cleanly decouples state mutations from React lifecycle rerenders.
- **Client-Backend Loose Coupling**: The client functions completely standalone (offline-first). When connected, the backend serves as an optional persistence sync and clinical reports generation service.

---

## 9. Security, Privacy & Health Data Compliance (HIPAA / PHR)

1. **Client-Side Data Isolation**: All health records remain on the user's personal device inside browser sandboxed storage by default, minimizing attack surfaces.
2. **Sanitization & No External Leakage**: Telemetry readings and medication histories are never transmitted to third-party ad networks or analytics services.
3. **CORS Hardening**: FastAPI backend enforces strict origin whitelisting (`localhost:3000`, `localhost:5173`).
4. **Auditability**: State modifications produce timestamped history entries in the local state store.
