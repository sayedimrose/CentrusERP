# Centrus ERP: Project Structure

## Technology Stack
- **Backend**: FastAPI (Python)
- **Frontend**: Next.js (React)
- **Database**: PostgreSQL (Recommended for production)
- **ORM**: SQLAlchemy
- **Caching/Queue**: Redis & Celery (for ZATCA background sync, heavy reports)

## Backend Structure (FastAPI)
```text
backend/
├── app/
│   ├── main.py                  # FastAPI application instance & lifespan events
│   ├── core/                    # Security, configurations, ZATCA core logic
│   ├── db/                      # Database sessions, migrations (Alembic)
│   ├── modules/                 # Modular business logic (each contains its own reports router)
│   │   ├── finance/             # Accounting, Ledgers, COA, Bank Statements, Financial Reports
│   │   ├── inventory/           # Stock, Sub-locations, Item/Vendor Stock Reports
│   │   ├── sales/               # POS, Sales Orders, Invoices, Sales Reports
│   │   ├── purchases/           # Purchase Orders, Multi-Vendor pricing, Cost Comparison Reports
│   │   ├── manufacturing/       # BOM, Work Orders, Yield Reports
│   │   ├── hr/                  # Employees, Payroll, HR Reports
│   │   └── settings/            # Payment Modes Config, Printer/Device Config
│   ├── hardware/                # POS device integration (Printers, Scanners)
│   ├── localization/            # Arabic translations & RTL support
│   └── tests/
├── requirements.txt
└── alembic.ini
```

## Frontend Structure (Next.js)
```text
frontend/
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── (auth)/              # Login, Password Reset
│   │   ├── (dashboard)/         # Main layout, Sidebar, Topbar
│   │   │   ├── finance/
│   │   │   ├── inventory/
│   │   │   ├── sales/
│   │   │   ├── purchases/
│   │   │   ├── manufacturing/
│   │   │   ├── hr/
│   │   │   ├── pos/             # Dedicated POS interface (optimized for touch)
│   │   │   └── settings/
│   ├── components/              # Reusable UI components
│   │   ├── ui/                  # Buttons, Inputs, Tables
│   │   ├── pos/                 # POS specific components
│   │   └── forms/               # Reusable forms
│   ├── lib/                     # API client, utility functions
│   ├── store/                   # State management (Zustand/Redux)
│   ├── locales/                 # i18n translation files (en, ar)
│   └── styles/                  # Global styles, Tailwind config (RTL setup)
├── package.json
└── next.config.js
```
