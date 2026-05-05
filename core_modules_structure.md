# Centrus ERP: Core Modules Structure

This document details the functional architecture of the Centrus ERP, ensuring it meets the comprehensive needs of Retail, Groceries, Manufacturing, and FMCG businesses in Saudi Arabia.

## 1. Finance & Accounts Module
- **Chart of Accounts (COA)**: Multi-level tree structure (Assets, Liabilities, Equity, Income, Expenses) mirroring standard practices (SAP, Odoo, NetSuite).
- **Journal Entries**: Manual and automated double-entry bookkeeping.
- **Ledger Entries**: General Ledger, Accounts Receivable (AR), Accounts Payable (AP).
- **Voucher Management**: Payment Vouchers, Receipt Vouchers, Contra Vouchers, Journal Vouchers.
- **Taxes & ZATCA (KSA)**: Phase 1 & Phase 2 integration, VAT calculation, E-Invoicing (B2B, B2C), TLV encoded QR Codes, Cryptographic Stamp Identifiers.
- **Banks & Cash**: Bank Reconciliation, Petty Cash, Multiple Bank Accounts.
- **Reports & Analytics**: 
  - Profit & Loss (P&L), Balance Sheet, Trial Balance, Cash Flow, Tax Reports.
  - Bank Statements & Reconciliation Reports.
  - Active Vendor Payments & Overdue Payable Reports.
  - Payment Reports (by mode, date, branch).

## 2. Sales & POS (Retail) Module
- **Point of Sale (POS)**: Touch-friendly interface, offline capability, session management (Open/Close shift), Cashier tracking.
- **Invoicing**: B2B Tax Invoices, B2C Simplified Invoices (ZATCA compliant).
- **Payment Modes**: Highly configurable (Cash, Credit Card, MADA, STC Pay, Tabby, Tamara, Bank Transfer). Similar configuration to NetSuite/Business Central allowing dynamic toggle.
- **Hardware Integration**: Receipt Printers (Epson, Bixolon), Barcode Scanners, Cash Drawers, Payment Terminal integrations.
- **Sales Orders & Quotations**: For wholesale / B2B customers.
- **Customer Management**: Credit limits, loyalty programs, customer statements.
- **Reports & Analytics**:
  - Item-wise Sales Price & Margin Reports.
  - Sales by Cashier / Branch / Region.
  - Z-Reports and Daily Sales Summaries.

## 3. Inventory & Warehousing Module
- **Product Management**: Variants (Color/Size), Serial Numbers, Batch/Lot tracking (crucial for FMCG/Groceries).
- **Multi-Warehouse & Sub-Locations**: Manage multiple warehouses and define custom sub-locations manually (e.g., Primary, Damage, Quarantine, Returns, Display).
- **Stock Movement**: Internal transfers between branches, warehouses, and specific sub-locations.
- **Damage, Expiry & Wastage**: Dedicated workflows to log expired goods (FMCG), damaged items, and track financial write-offs directly to specific sub-locations.
- **Consumables**: Tracking items used internally (e.g., store supplies, baking ingredients) that don't generate direct revenue but impact P&L.
- **Stock Reconciliation**: Physical inventory counts and adjustments.
- **Reports & Analytics**:
  - Item-wise Stock Report (with sub-location breakdown).
  - Vendor-wise Stock Report (tracking inventory levels by their original supplier).
  - Expiry & Wastage Reports.

## 4. Purchases & Procurement Module
- **Supplier Management**: Vendor details, payment terms, vendor ledgers.
- **Multi-Vendor Items**: One item can be procured from multiple associated vendors, tracking vendor-specific cost prices and lead times.
- **Purchase Orders (PO)**: PO creation, approval workflows. Restricted ordering only to associated vendors for a given item.
- **Goods Receipt Notes (GRN)**: Receiving items into inventory (to specific sub-locations).
- **Purchase Invoices**: Linking GRN to vendor bills.
- **Reports & Analytics**:
  - Item Vendor Report (lists all vendors associated with an item and their specific cost prices).
  - Vendor Cost vs Sales Comparison (with dynamic grouping, advanced filtering, and margin analysis).
  - Item Cost vs Sales Comparison.

## 5. Manufacturing & Production Module
- **Bill of Materials (BOM)**: Defining raw materials, labor, and overheads for finished goods (e.g., Bakery recipes, FMCG production).
- **Work Orders / Production Orders**: Scheduling and tracking production.
- **Work Centers & Routing**: Defining steps in the manufacturing process.
- **Costing**: Standard, Average, and FIFO costing methods integrating back to Finance.
- **Reports & Analytics**:
  - BOM Cost Analysis.
  - Production Yield & Variance Reports.

## 6. Human Resources & Payroll Module
- **Employee Directory**: Iqama tracking, visa details, document expiry alerts (KSA specific).
- **Attendance & Leave**: Shifts scheduling, biometric integration, leave requests.
- **Payroll**: Salary slips, deductions, GOSI (General Organization for Social Insurance) calculations, WPS (Wage Protection System) compliance.
- **Reports & Analytics**:
  - Payroll Summary, Iqama Expiry Reports, Leave Balances.

## 7. System & Configuration Module
- **Store / Branch Management**: Multi-branch support.
- **User Roles & Permissions**: Granular access control.
- **ZATCA Configuration**: Cryptographic Stamp Identifiers (CSID), API endpoints, certificates.
- **Localization**: Full RTL Arabic layout and English toggle.
