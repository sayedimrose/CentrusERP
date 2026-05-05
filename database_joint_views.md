# Centrus ERP: Database Joint Views

Comprehensive SQL views for screens, reports, analytics, and data grids across all modules. Views are categorized by module and purpose (List, Detail, Report, Analytics).

---

## 1. System & Configuration Views

### `vw_branch_full_details`
**Purpose:** Branch list screen, settings, dropdowns
**Joins:** Branches → Companies
| Column | Source |
|--------|--------|
| branch_id | Branches.id |
| branch_code | Branches.branch_code |
| branch_name_en | Branches.branch_name_en |
| branch_name_ar | Branches.branch_name_ar |
| company_name_en | Companies.company_name_en |
| company_vat | Companies.vat_number |
| full_address_en | CONCAT(building_no, street, district, city, postal_code) |
| full_address_ar | CONCAT(building_no, street_ar, district_ar, city_ar) |
| phone_number | Branches.phone_number |
| email | Branches.email |
| is_active | Branches.is_active |

### `vw_branch_payment_modes_active`
**Purpose:** POS config screen — which payment modes are enabled per branch
**Joins:** Branch_Payment_Modes → Payment_Modes → Branches → Chart_Of_Accounts
| Column | Source |
|--------|--------|
| branch_id | Branches.id |
| branch_name_en | Branches.branch_name_en |
| payment_mode_code | Payment_Modes.code |
| payment_mode_name_en | Payment_Modes.name_en |
| payment_mode_name_ar | Payment_Modes.name_ar |
| payment_type | Payment_Modes.type |
| gl_account_code | COALESCE(override_gl.account_code, default_gl.account_code) |
| gl_account_name_en | COALESCE(override_gl.account_name_en, default_gl.account_name_en) |
| is_active | Branch_Payment_Modes.is_active |

### `vw_hardware_devices_by_branch`
**Purpose:** Settings → Hardware devices screen
**Joins:** Hardware_Devices → Branches
| Column | Source |
|--------|--------|
| device_id | Hardware_Devices.id |
| branch_name_en | Branches.branch_name_en |
| device_type | Hardware_Devices.device_type |
| device_name | Hardware_Devices.device_name |
| ip_address | Hardware_Devices.ip_address |
| is_active | Hardware_Devices.is_active |

### `vw_users_full_profile`
**Purpose:** User management screen, audit trails
**Joins:** Admin_Users → Admin_User_Roles → Admin_Roles → Employees → Branches → Companies
| Column | Source |
|--------|--------|
| user_id | Users.id |
| username | Users.username |
| email | Users.email |
| full_name | Users.full_name |
| role_names | GROUP_CONCAT(Roles.role_name) |
| employee_code | Employees.employee_code |
| branch_name_en | Branches.branch_name_en |
| company_name_en | Companies.company_name_en |
| is_active | Users.is_active |
| is_locked | Users.is_locked |
| last_login_at | Users.last_login_at |

### `vw_user_permissions_flat`
**Purpose:** RBAC permission check, access control middleware
**Joins:** Users → User_Roles → Roles → Role_Permissions → Permissions
| Column | Source |
|--------|--------|
| user_id | Users.id |
| username | Users.username |
| role_name | Roles.role_name |
| module_name | Permissions.module_name |
| permission_code | Permissions.permission_code |
| is_superuser | Users.is_superuser |

---

## 2. Finance & Accounts Views

### `vw_chart_of_accounts_tree`
**Purpose:** COA list screen, account picker dropdowns, trial balance
**Joins:** Chart_Of_Accounts (self-join parent)
| Column | Source |
|--------|--------|
| account_id | COA.id |
| account_code | COA.account_code |
| account_name_en | COA.account_name_en |
| account_name_ar | COA.account_name_ar |
| account_type | COA.account_type |
| parent_account_code | Parent_COA.account_code |
| parent_account_name_en | Parent_COA.account_name_en |
| is_group | COA.is_group |
| is_reconcilable | COA.is_reconcilable |
| current_balance | COA.current_balance |
| currency | COA.currency |
| full_path | Recursive CTE path (e.g., Assets > Current > Cash) |

### `vw_journal_entries_list`
**Purpose:** Journal Entries list screen with summary
**Joins:** Journal_Entries → Branches → Users
| Column | Source |
|--------|--------|
| entry_id | JE.id |
| entry_number | JE.entry_number |
| reference_number | JE.reference_number |
| entry_date | JE.entry_date |
| description | JE.description |
| total_debit | JE.total_debit |
| total_credit | JE.total_credit |
| status | JE.status |
| source_module | JE.source_module |
| branch_name_en | Branches.branch_name_en |
| created_by_name | Users.full_name |

### `vw_journal_entry_detail`
**Purpose:** Journal Entry detail screen — header + all lines
**Joins:** Journal_Entry_Lines → Journal_Entries → Chart_Of_Accounts → Branches → Users
| Column | Source |
|--------|--------|
| entry_number | JE.entry_number |
| entry_date | JE.entry_date |
| status | JE.status |
| line_id | JEL.id |
| account_code | COA.account_code |
| account_name_en | COA.account_name_en |
| account_type | COA.account_type |
| line_description | JEL.description |
| debit | JEL.debit |
| credit | JEL.credit |
| partner_type | JEL.partner_type |
| branch_name_en | Branches.branch_name_en |
| created_by_name | Users.full_name |

### `vw_general_ledger`
**Purpose:** General Ledger report — all postings per account with running balance
**Joins:** Journal_Entry_Lines → Journal_Entries → Chart_Of_Accounts
| Column | Source |
|--------|--------|
| account_code | COA.account_code |
| account_name_en | COA.account_name_en |
| account_type | COA.account_type |
| entry_number | JE.entry_number |
| entry_date | JE.entry_date |
| description | JEL.description |
| debit | JEL.debit |
| credit | JEL.credit |
| running_balance | Window SUM(debit - credit) OVER (PARTITION BY account_id ORDER BY entry_date) |

### `vw_trial_balance`
**Purpose:** Trial Balance report
**Joins:** Journal_Entry_Lines → Chart_Of_Accounts (aggregated)
| Column | Source |
|--------|--------|
| account_code | COA.account_code |
| account_name_en | COA.account_name_en |
| account_type | COA.account_type |
| total_debit | SUM(JEL.debit) |
| total_credit | SUM(JEL.credit) |
| net_balance | SUM(debit) - SUM(credit) |

### `vw_vouchers_list`
**Purpose:** Voucher list screen (Payments, Receipts, Contra)
**Joins:** Vouchers → Payment_Modes → Bank_Accounts → Branches → Users
| Column | Source |
|--------|--------|
| voucher_id | V.id |
| voucher_number | V.voucher_number |
| voucher_type | V.voucher_type |
| date | V.date |
| partner_type | V.partner_type |
| partner_name | Dynamic: Customer/Supplier/Employee name based on partner_type |
| payment_mode_name | Payment_Modes.name_en |
| bank_name | Bank_Accounts.bank_name_en |
| cheque_number | V.cheque_number |
| amount | V.amount |
| status | V.status |
| branch_name_en | Branches.branch_name_en |
| created_by_name | Users.full_name |

### `vw_bank_reconciliation`
**Purpose:** Bank Reconciliation screen
**Joins:** Bank_Transactions → Bank_Accounts → Journal_Entry_Lines
| Column | Source |
|--------|--------|
| bank_name | Bank_Accounts.bank_name_en |
| account_number | Bank_Accounts.account_number |
| iban | Bank_Accounts.iban |
| txn_date | Bank_Transactions.transaction_date |
| txn_description | Bank_Transactions.description |
| txn_reference | Bank_Transactions.reference |
| txn_amount | Bank_Transactions.amount |
| is_reconciled | Bank_Transactions.is_reconciled |
| matched_entry_number | JE.entry_number |
| matched_account_code | COA.account_code |
| bank_balance | Bank_Accounts.current_balance |

### `vw_tax_summary_report`
**Purpose:** VAT/Tax Return report, ZATCA filing
**Joins:** Sales_Invoice_Lines + Purchase_Invoice_Lines → Tax_Rates (UNION aggregated)
| Column | Source |
|--------|--------|
| tax_name | Tax_Rates.tax_name_en |
| tax_rate | Tax_Rates.rate |
| output_tax (Sales) | SUM(Sales_Invoice_Lines.tax_amount) |
| input_tax (Purchases) | SUM(Purchase_Invoice_Lines.tax_amount) |
| net_tax_payable | output_tax - input_tax |
| period | Grouped by month/quarter |

---

## 3. Inventory & Warehousing Views

### `vw_product_master_full`
**Purpose:** Product list screen, search, data grid — the comprehensive item view
**Joins:** Products → Categories → Brands → Tax_Rates → Item_Vendors → Suppliers
| Column | Source |
|--------|--------|
| product_id | Products.id |
| sku | Products.sku |
| barcode | Products.barcode |
| product_name_en | Products.product_name_en |
| product_name_ar | Products.product_name_ar |
| description | Products.description |
| product_type | Products.product_type |
| base_uom | Products.base_uom |
| category_name_en | Categories.category_name_en |
| category_name_ar | Categories.category_name_ar |
| brand_name_en | Brands.brand_name_en |
| brand_name_ar | Brands.brand_name_ar |
| default_sales_price | Products.default_sales_price |
| default_cost_price | Products.default_cost_price |
| tax_name | Tax_Rates.tax_name_en |
| tax_rate | Tax_Rates.rate |
| preferred_vendor_name | Suppliers.supplier_name_en (WHERE is_preferred_vendor = true) |
| vendor_count | COUNT(Item_Vendors) |
| has_variants | Products.has_variants |
| tracks_batches | Products.tracks_batches |
| tracks_serials | Products.tracks_serials |
| image_url | Products.image_url |
| is_active | Products.is_active |

### `vw_product_vendor_pricing`
**Purpose:** Vendor pricing comparison screen, purchase order creation
**Joins:** Item_Vendors → Products → Suppliers
| Column | Source |
|--------|--------|
| product_sku | Products.sku |
| product_name_en | Products.product_name_en |
| supplier_code | Suppliers.supplier_code |
| supplier_name_en | Suppliers.supplier_name_en |
| vendor_sku | Item_Vendors.vendor_sku |
| vendor_price | Item_Vendors.vendor_price |
| lead_time_days | Item_Vendors.lead_time_days |
| minimum_order_qty | Item_Vendors.minimum_order_qty |
| is_preferred_vendor | Item_Vendors.is_preferred_vendor |
| default_cost_price | Products.default_cost_price |
| price_difference | vendor_price - default_cost_price |

### `vw_stock_on_hand`
**Purpose:** Current stock levels — inventory list, reorder alerts, POS stock check
**Joins:** Stock_Ledger (aggregated) → Products → Variants → Warehouses → Sub_Locations
| Column | Source |
|--------|--------|
| product_sku | Products.sku |
| product_name_en | Products.product_name_en |
| variant_sku | Variants.variant_sku |
| warehouse_name_en | Warehouses.warehouse_name_en |
| sub_location_name | Sub_Locations.location_name_en |
| current_qty | SUM(Stock_Ledger.quantity) |
| avg_unit_cost | AVG(Stock_Ledger.unit_cost) |
| total_stock_value | current_qty × avg_unit_cost |

### `vw_stock_movement_history`
**Purpose:** Stock ledger detail screen, audit trail
**Joins:** Stock_Ledger → Products → Variants → Warehouses → Sub_Locations → Batches
| Column | Source |
|--------|--------|
| transaction_date | Stock_Ledger.transaction_date |
| product_sku | Products.sku |
| product_name_en | Products.product_name_en |
| variant_sku | Variants.variant_sku |
| warehouse_name | Warehouses.warehouse_name_en |
| sub_location | Sub_Locations.location_name_en |
| batch_number | Batches.batch_number |
| transaction_type | Stock_Ledger.transaction_type |
| reference_id | Stock_Ledger.reference_id |
| quantity | Stock_Ledger.quantity |
| unit_cost | Stock_Ledger.unit_cost |
| total_cost | Stock_Ledger.total_cost |
| running_qty | Window SUM(quantity) OVER (PARTITION BY product_id, warehouse_id ORDER BY transaction_date) |

### `vw_stock_batch_expiry_tracker`
**Purpose:** FMCG expiry alerts, batch list screen, damage/quarantine tracking
**Joins:** Stock_Batches → Products → Suppliers + Stock_Ledger (aggregated qty)
| Column | Source |
|--------|--------|
| batch_number | Batches.batch_number |
| product_sku | Products.sku |
| product_name_en | Products.product_name_en |
| manufacturing_date | Batches.manufacturing_date |
| expiry_date | Batches.expiry_date |
| days_to_expiry | expiry_date - CURRENT_DATE |
| expiry_status | CASE: EXPIRED / EXPIRING_SOON (≤30d) / OK |
| supplier_name | Suppliers.supplier_name_en |
| remaining_qty | SUM(Stock_Ledger.quantity) WHERE batch_id = this |

### `vw_stock_serial_tracker`
**Purpose:** Serial number lookup, warranty tracking
**Joins:** Stock_Serial_Numbers → Products → Sub_Locations → Warehouses
| Column | Source |
|--------|--------|
| serial_number | Serials.serial_number |
| product_sku | Products.sku |
| product_name_en | Products.product_name_en |
| status | Serials.status |
| warehouse_name | Warehouses.warehouse_name_en |
| sub_location | Sub_Locations.location_name_en |

### `vw_stock_transfer_list`
**Purpose:** Stock transfer list screen
**Joins:** Stock_Transfers → Warehouses (from/to) → Users
| Column | Source |
|--------|--------|
| transfer_number | Transfers.transfer_number |
| transfer_date | Transfers.transfer_date |
| from_warehouse | From_WH.warehouse_name_en |
| to_warehouse | To_WH.warehouse_name_en |
| status | Transfers.status |
| total_items | COUNT(Transfer_Lines) |
| total_qty | SUM(Transfer_Lines.quantity_shipped) |
| created_by | Users.full_name |

### `vw_stock_adjustment_list`
**Purpose:** Adjustment list screen (physical counts, damage, expiry)
**Joins:** Stock_Adjustments → Warehouses → Users → Adjustment_Lines (aggregated)
| Column | Source |
|--------|--------|
| adjustment_number | Adj.adjustment_number |
| adjustment_date | Adj.adjustment_date |
| adjustment_type | Adj.adjustment_type |
| warehouse_name | Warehouses.warehouse_name_en |
| status | Adj.status |
| total_items | COUNT(Adj_Lines) |
| total_variance_qty | SUM(actual_quantity - system_quantity) |
| total_variance_cost | SUM(adjusted_quantity × unit_cost) |
| created_by | Users.full_name |

### `vw_warehouse_stock_summary`
**Purpose:** Dashboard widget, warehouse overview analytics
**Joins:** Stock_Ledger (aggregated) → Products → Warehouses
| Column | Source |
|--------|--------|
| warehouse_name | Warehouses.warehouse_name_en |
| total_products | COUNT(DISTINCT product_id) |
| total_qty | SUM(quantity) |
| total_stock_value | SUM(quantity × unit_cost) |
| zero_stock_items | COUNT WHERE SUM(qty) = 0 |
| negative_stock_items | COUNT WHERE SUM(qty) < 0 |

### `vw_vendor_cost_sales_comparison`
**Purpose:** Report: Compare purchase cost from different vendors with current sales price
**Joins:** Item_Vendors → Products → Suppliers
| Column | Source |
|--------|--------|
| product_sku | Products.sku |
| product_name_en | Products.product_name_en |
| supplier_name | Suppliers.supplier_name_en |
| vendor_cost_price | Item_Vendors.vendor_price |
| current_sales_price | Products.default_sales_price |
| potential_margin | sales_price - vendor_cost |
| margin_pct | (potential_margin / sales_price) × 100 |

### `vw_vendor_wise_stock`
**Purpose:** Report: Track inventory levels based on original supplier
**Joins:** Stock_Ledger → Stock_Batches → Suppliers → Products
| Column | Source |
|--------|--------|
| supplier_name | Suppliers.supplier_name_en |
| product_sku | Products.sku |
| product_name_en | Products.product_name_en |
| total_qty_from_vendor | SUM(Stock_Ledger.quantity) WHERE stock came from this supplier |
| stock_value | SUM(quantity × unit_cost) |

---

## 4. Purchases & Procurement Views

### `vw_supplier_master`
**Purpose:** Supplier list screen, dropdowns, vendor management
**Joins:** Suppliers → Chart_Of_Accounts
| Column | Source |
|--------|--------|
| supplier_id | Suppliers.id |
| supplier_code | Suppliers.supplier_code |
| supplier_name_en | Suppliers.supplier_name_en |
| supplier_name_ar | Suppliers.supplier_name_ar |
| vat_number | Suppliers.vat_number |
| cr_number | Suppliers.commercial_registration_number |
| contact_person | Suppliers.contact_person |
| phone_number | Suppliers.phone_number |
| email | Suppliers.email |
| full_address | CONCAT(building_no, street, district, city, country) |
| payment_terms | Suppliers.payment_terms |
| ap_account_code | COA.account_code |
| ap_account_name | COA.account_name_en |
| current_balance | Suppliers.current_balance |
| is_active | Suppliers.is_active |

### `vw_supplier_ledger`
**Purpose:** Supplier statement, AP aging report
**Joins:** Purchase_Invoices + Vendor_Payments + Purchase_Returns → Suppliers (UNION)
| Column | Source |
|--------|--------|
| supplier_code | Suppliers.supplier_code |
| supplier_name_en | Suppliers.supplier_name_en |
| date | Invoice/Payment/Return date |
| document_type | 'INVOICE' / 'PAYMENT' / 'DEBIT_NOTE' |
| document_number | invoice_number / payment_number / return_number |
| debit_amount | Invoice amounts (what we owe) |
| credit_amount | Payment/Return amounts (what we paid) |
| running_balance | Window SUM OVER (ORDER BY date) |

### `vw_purchase_order_list`
**Purpose:** PO list screen with summary
**Joins:** Purchase_Orders → Suppliers → Branches → Users (created/approved)
| Column | Source |
|--------|--------|
| po_id | PO.id |
| po_number | PO.po_number |
| po_date | PO.po_date |
| expected_delivery | PO.expected_delivery_date |
| supplier_code | Suppliers.supplier_code |
| supplier_name_en | Suppliers.supplier_name_en |
| branch_name_en | Branches.branch_name_en |
| status | PO.status |
| total_excl_tax | PO.total_amount_excl_tax |
| total_tax | PO.total_tax_amount |
| total_incl_tax | PO.total_amount_incl_tax |
| total_items | COUNT(PO_Lines) |
| received_pct | SUM(received_qty) / SUM(ordered_qty) × 100 |
| created_by | Creator.full_name |
| approved_by | Approver.full_name |

### `vw_purchase_order_detail`
**Purpose:** PO detail screen — header + lines with product info
**Joins:** PO_Lines → Purchase_Orders → Products → Variants → Tax_Rates → Suppliers
| Column | Source |
|--------|--------|
| po_number | PO.po_number |
| po_date | PO.po_date |
| supplier_name_en | Suppliers.supplier_name_en |
| status | PO.status |
| line_id | POL.id |
| product_sku | Products.sku |
| product_name_en | Products.product_name_en |
| variant_sku | Variants.variant_sku |
| ordered_qty | POL.ordered_qty |
| received_qty | POL.received_qty |
| pending_qty | ordered_qty - received_qty |
| unit_price | POL.unit_price |
| tax_rate | Tax_Rates.rate |
| tax_amount | POL.tax_amount |
| line_total | POL.line_total |

### `vw_goods_receipt_list`
**Purpose:** GRN list screen
**Joins:** Goods_Receipts → Purchase_Orders → Suppliers → Warehouses → Branches → Users
| Column | Source |
|--------|--------|
| grn_id | GRN.id |
| grn_number | GRN.grn_number |
| grn_date | GRN.grn_date |
| po_number | PO.po_number |
| supplier_name_en | Suppliers.supplier_name_en |
| supplier_delivery_note | GRN.supplier_delivery_note |
| warehouse_name | Warehouses.warehouse_name_en |
| branch_name_en | Branches.branch_name_en |
| status | GRN.status |
| total_items | COUNT(GRN_Lines) |
| total_received_qty | SUM(GRN_Lines.received_qty) |
| total_rejected_qty | SUM(GRN_Lines.rejected_qty) |
| created_by | Users.full_name |

### `vw_purchase_invoice_list`
**Purpose:** Purchase invoice list, AP tracking
**Joins:** Purchase_Invoices → Suppliers → Purchase_Orders → Goods_Receipts → Branches → Users
| Column | Source |
|--------|--------|
| invoice_id | PI.id |
| invoice_number | PI.invoice_number |
| supplier_invoice_number | PI.supplier_invoice_number |
| invoice_date | PI.invoice_date |
| due_date | PI.due_date |
| supplier_name_en | Suppliers.supplier_name_en |
| po_number | PO.po_number |
| grn_number | GRN.grn_number |
| status | PI.status |
| total_excl_tax | PI.total_amount_excl_tax |
| total_tax | PI.total_tax_amount |
| total_incl_tax | PI.total_amount_incl_tax |
| amount_paid | PI.amount_paid |
| balance_due | total_incl_tax - amount_paid |
| days_overdue | CASE WHEN due_date < NOW AND status != PAID THEN NOW - due_date ELSE 0 |
| branch_name_en | Branches.branch_name_en |

### `vw_ap_aging_report`
**Purpose:** Accounts Payable aging report (Current, 30, 60, 90+ days)
**Joins:** Purchase_Invoices → Suppliers (WHERE status NOT IN PAID, CANCELLED)
| Column | Source |
|--------|--------|
| supplier_code | Suppliers.supplier_code |
| supplier_name_en | Suppliers.supplier_name_en |
| current_0_30 | SUM WHERE days_overdue BETWEEN 0 AND 30 |
| overdue_31_60 | SUM WHERE days_overdue BETWEEN 31 AND 60 |
| overdue_61_90 | SUM WHERE days_overdue BETWEEN 61 AND 90 |
| overdue_90_plus | SUM WHERE days_overdue > 90 |
| total_outstanding | SUM(total_incl_tax - amount_paid) |

### `vw_vendor_payment_list`
**Purpose:** Vendor payment list screen
**Joins:** Vendor_Payments → Suppliers → Payment_Modes → Purchase_Invoices → Vouchers
| Column | Source |
|--------|--------|
| payment_number | VP.payment_number |
| payment_date | VP.payment_date |
| supplier_name_en | Suppliers.supplier_name_en |
| payment_mode_name | Payment_Modes.name_en |
| amount | VP.amount |
| against_invoice | PI.invoice_number |
| voucher_number | Vouchers.voucher_number |
| status | VP.status |

### `vw_purchase_return_list`
**Purpose:** Debit note / return list screen
**Joins:** Purchase_Returns → Suppliers → Purchase_Invoices → Branches → Users
| Column | Source |
|--------|--------|
| return_number | PR.return_number |
| return_date | PR.return_date |
| supplier_name_en | Suppliers.supplier_name_en |
| against_invoice | PI.invoice_number |
| total_amount | PR.total_amount |
| total_items | COUNT(PR_Lines) |
| total_returned_qty | SUM(PR_Lines.returned_qty) |
| status | PR.status |
| created_by | Users.full_name |

---

## 5. Sales & POS Views

### `vw_customer_master`
**Purpose:** Customer list screen, dropdowns, CRM
**Joins:** Customers → Chart_Of_Accounts
| Column | Source |
|--------|--------|
| customer_id | Customers.id |
| customer_code | Customers.customer_code |
| customer_name_en | Customers.customer_name_en |
| customer_name_ar | Customers.customer_name_ar |
| customer_type | Customers.customer_type |
| vat_number | Customers.vat_number |
| phone_number | Customers.phone_number |
| email | Customers.email |
| full_address | CONCAT(building_no, street, district, city) |
| ar_account_code | COA.account_code |
| credit_limit | Customers.credit_limit |
| current_balance | Customers.current_balance |
| available_credit | credit_limit - current_balance |
| is_active | Customers.is_active |

### `vw_customer_ledger`
**Purpose:** Customer statement, AR aging
**Joins:** Sales_Invoices + Sales_Returns + Sales_Payments → Customers (UNION)
| Column | Source |
|--------|--------|
| customer_code | Customers.customer_code |
| customer_name_en | Customers.customer_name_en |
| date | Invoice/Return/Payment date |
| document_type | 'INVOICE' / 'CREDIT_NOTE' / 'PAYMENT' |
| document_number | invoice_number / return_number / ref |
| debit_amount | Invoice amounts (what customer owes) |
| credit_amount | Return/Payment amounts |
| running_balance | Window SUM OVER (ORDER BY date) |

### `vw_sales_quotation_list`
**Purpose:** Sales quotation list screen
**Joins:** Sales_Quotations → Customers → Branches → Users
| Column | Source |
|--------|--------|
| quotation_number | SQ.quotation_number |
| quotation_date | SQ.quotation_date |
| expiry_date | SQ.expiry_date |
| customer_name_en | Customers.customer_name_en |
| branch_name_en | Branches.branch_name_en |
| status | SQ.status |
| total_amount_incl_tax | SQ.total_amount_incl_tax |
| created_by | Users.full_name |

### `vw_sales_quotation_detail`
**Purpose:** Quotation detail / print view
**Joins:** SQ_Lines → Sales_Quotations → Products → Variants → Tax_Rates → Customers → Branches
| Column | Source |
|--------|--------|
| quotation_number | SQ.quotation_number |
| quotation_date | SQ.quotation_date |
| expiry_date | SQ.expiry_date |
| customer_name_en | Customers.customer_name_en |
| line_id | SQL.id |
| product_sku | Products.sku |
| product_name_en | Products.product_name_en |
| quantity | SQL.quantity |
| unit_price | SQL.unit_price |
| discount_amount | SQL.discount_amount |
| tax_amount | SQL.tax_amount |
| line_total | SQL.line_total |

### `vw_sales_order_list`
**Purpose:** Sales order list screen
**Joins:** Sales_Orders → Customers → Branches → Users
| Column | Source |
|--------|--------|
| so_number | SO.so_number |
| so_date | SO.so_date |
| expected_dispatch | SO.expected_dispatch_date |
| customer_name_en | Customers.customer_name_en |
| customer_type | Customers.customer_type |
| branch_name_en | Branches.branch_name_en |
| status | SO.status |
| total_excl_tax | SO.total_amount_excl_tax |
| total_tax | SO.total_tax_amount |
| total_incl_tax | SO.total_amount_incl_tax |
| total_items | COUNT(SO_Lines) |
| invoiced_pct | SUM(invoiced_qty) / SUM(ordered_qty) × 100 |
| created_by | Users.full_name |

### `vw_sales_invoice_list`
**Purpose:** Sales invoice list, revenue tracking, ZATCA compliance
**Joins:** Sales_Invoices → Customers → Branches → POS_Sessions → Users
| Column | Source |
|--------|--------|
| invoice_id | SI.id |
| invoice_number | SI.invoice_number |
| invoice_type | SI.invoice_type |
| invoice_date | SI.invoice_date |
| customer_name_en | COALESCE(Customers.customer_name_en, 'Walk-in') |
| customer_vat | Customers.vat_number |
| branch_name_en | Branches.branch_name_en |
| pos_session_id | SI.pos_session_id |
| cashier_name | Users.full_name (via POS_Session) |
| status | SI.status |
| total_excl_tax | SI.total_amount_excl_tax |
| total_discount | SI.total_discount_amount |
| total_tax | SI.total_tax_amount |
| total_incl_tax | SI.total_amount_incl_tax |
| zatca_uuid | SI.zatca_uuid |
| has_zatca_qr | SI.zatca_qr_code_tlv IS NOT NULL |

### `vw_sales_invoice_detail`
**Purpose:** Invoice detail/print screen — header + lines + payments
**Joins:** SI_Lines → Sales_Invoices → Products → Variants → Tax_Rates → Customers → Branches → Company
| Column | Source |
|--------|--------|
| invoice_number | SI.invoice_number |
| invoice_type | SI.invoice_type |
| invoice_date | SI.invoice_date |
| customer_name_en | Customers.customer_name_en |
| customer_name_ar | Customers.customer_name_ar |
| customer_vat | Customers.vat_number |
| company_name_en | Companies.company_name_en |
| company_name_ar | Companies.company_name_ar |
| company_vat | Companies.vat_number |
| branch_name_en | Branches.branch_name_en |
| product_sku | Products.sku |
| product_name_en | Products.product_name_en |
| product_name_ar | Products.product_name_ar |
| quantity | SIL.quantity |
| unit_price | SIL.unit_price |
| discount_amount | SIL.discount_amount |
| tax_rate | Tax_Rates.rate |
| tax_amount | SIL.tax_amount |
| line_total | SIL.line_total |
| zatca_qr_code_tlv | SI.zatca_qr_code_tlv |

### `vw_sales_payment_split`
**Purpose:** Invoice payment breakdown (split payments)
**Joins:** Sales_Payments → Sales_Invoices → Payment_Modes
| Column | Source |
|--------|--------|
| invoice_number | SI.invoice_number |
| invoice_total | SI.total_amount_incl_tax |
| payment_mode_name | Payment_Modes.name_en |
| payment_mode_type | Payment_Modes.type |
| amount | SP.amount |
| reference_number | SP.reference_number |

### `vw_ar_aging_report`
**Purpose:** Accounts Receivable aging report
**Joins:** Sales_Invoices → Customers (WHERE status NOT IN PAID, CANCELLED)
| Column | Source |
|--------|--------|
| customer_code | Customers.customer_code |
| customer_name_en | Customers.customer_name_en |
| current_0_30 | SUM WHERE days_outstanding BETWEEN 0 AND 30 |
| overdue_31_60 | SUM WHERE days_outstanding BETWEEN 31 AND 60 |
| overdue_61_90 | SUM WHERE days_outstanding BETWEEN 61 AND 90 |
| overdue_90_plus | SUM WHERE days_outstanding > 90 |
| total_outstanding | SUM(total_incl_tax - amount_paid) |

### `vw_sales_return_list`
**Purpose:** Credit note list screen
**Joins:** Sales_Returns → Customers → Sales_Invoices → Branches → Users
| Column | Source |
|--------|--------|
| return_number | SR.return_number |
| return_date | SR.return_date |
| customer_name_en | Customers.customer_name_en |
| original_invoice | SI.invoice_number |
| total_amount | SR.total_amount_incl_tax |
| total_items | COUNT(SR_Lines) |
| status | Derived from journal_entry |
| created_by | Users.full_name |

### `vw_pos_session_summary`
**Purpose:** POS session list, Z-Report, cashier reconciliation
**Joins:** POS_Sessions → Users → Branches → Hardware_Devices + Sales_Invoices + Sales_Payments (aggregated)
| Column | Source |
|--------|--------|
| session_id | PS.id |
| branch_name_en | Branches.branch_name_en |
| cashier_name | Users.full_name |
| device_name | Hardware_Devices.device_name |
| session_status | PS.session_status |
| opened_at | PS.opened_at |
| closed_at | PS.closed_at |
| duration_hours | (closed_at - opened_at) in hours |
| opening_cash | PS.opening_cash |
| total_sales | SUM(SI.total_amount_incl_tax) WHERE pos_session_id = this |
| total_returns | SUM(SR.total_amount_incl_tax) |
| net_sales | total_sales - total_returns |
| cash_sales | SUM(SP.amount) WHERE payment_mode = CASH |
| card_sales | SUM(SP.amount) WHERE payment_mode IN (MADA, CREDIT) |
| wallet_sales | SUM(SP.amount) WHERE payment_mode IN (STC, TABBY, TAMARA) |
| expected_cash | opening_cash + cash_sales |
| actual_cash | PS.actual_cash_closing |
| cash_difference | PS.cash_difference |
| total_invoices | COUNT(SI) |

### `vw_daily_sales_report`
**Purpose:** Dashboard analytics, daily sales summary
**Joins:** Sales_Invoices → Branches (aggregated by date)
| Column | Source |
|--------|--------|
| sale_date | DATE(SI.invoice_date) |
| branch_name_en | Branches.branch_name_en |
| total_invoices | COUNT(SI) |
| total_excl_tax | SUM(SI.total_amount_excl_tax) |
| total_discount | SUM(SI.total_discount_amount) |
| total_tax | SUM(SI.total_tax_amount) |
| total_incl_tax | SUM(SI.total_amount_incl_tax) |
| b2b_count | COUNT WHERE invoice_type = B2B |
| b2c_count | COUNT WHERE invoice_type = B2C |

---

## 6. Manufacturing Views

### `vw_work_center_list`
**Purpose:** Work center management screen
**Joins:** Work_Centers → Branches
| Column | Source |
|--------|--------|
| center_id | WC.id |
| center_code | WC.center_code |
| center_name_en | WC.center_name_en |
| center_name_ar | WC.center_name_ar |
| branch_name_en | Branches.branch_name_en |
| cost_per_hour | WC.cost_per_hour |
| capacity_per_day | WC.capacity_per_day |
| active_orders | COUNT(Production_Orders WHERE status = IN_PROGRESS) |
| is_active | WC.is_active |

### `vw_bom_list`
**Purpose:** BOM list screen, recipe management
**Joins:** Bill_Of_Materials → Products (finished) → Variants → BOM_Lines (aggregated)
| Column | Source |
|--------|--------|
| bom_id | BOM.id |
| bom_number | BOM.bom_number |
| finished_product_sku | Products.sku |
| finished_product_name_en | Products.product_name_en |
| variant_sku | Variants.variant_sku |
| production_qty | BOM.production_qty |
| total_material_cost | BOM.total_material_cost_estimate |
| total_operation_cost | BOM.total_operation_cost_estimate |
| total_bom_cost | material + operation cost |
| cost_per_unit | total_bom_cost / production_qty |
| raw_material_count | COUNT(BOM_Lines) |
| is_active | BOM.is_active |

### `vw_bom_detail`
**Purpose:** BOM detail screen — recipe breakdown with raw material info
**Joins:** BOM_Lines → Bill_Of_Materials → Products (raw + finished) → Variants
| Column | Source |
|--------|--------|
| bom_number | BOM.bom_number |
| finished_product_name | Finished_Product.product_name_en |
| production_qty | BOM.production_qty |
| line_id | BOML.id |
| raw_material_sku | Raw_Product.sku |
| raw_material_name_en | Raw_Product.product_name_en |
| raw_material_uom | Raw_Product.base_uom |
| quantity_required | BOML.quantity_required |
| scrap_percentage | BOML.scrap_percentage |
| effective_qty | quantity_required × (1 + scrap_percentage/100) |
| current_cost | Raw_Product.default_cost_price |
| line_cost | effective_qty × current_cost |
| current_stock | SUM(Stock_Ledger.quantity) for this raw material |

### `vw_production_order_list`
**Purpose:** Production order list screen, manufacturing dashboard
**Joins:** Production_Orders → Bill_Of_Materials → Products → Work_Centers → Branches → Users
| Column | Source |
|--------|--------|
| order_id | PO.id |
| order_number | PO.order_number |
| bom_number | BOM.bom_number |
| finished_product_sku | Products.sku |
| finished_product_name | Products.product_name_en |
| work_center_name | WC.center_name_en |
| branch_name_en | Branches.branch_name_en |
| planned_start | PO.planned_start_date |
| planned_end | PO.planned_end_date |
| actual_start | PO.actual_start_date |
| actual_end | PO.actual_end_date |
| target_qty | PO.target_qty |
| actual_qty_produced | PO.actual_qty_produced |
| completion_pct | (actual_qty / target_qty) × 100 |
| status | PO.status |
| total_actual_cost | PO.total_actual_cost |
| cost_per_unit | total_actual_cost / actual_qty_produced |
| created_by | Users.full_name |

### `vw_production_order_detail`
**Purpose:** Production order detail — materials consumed + output
**Joins:** PO_Materials + PO_Output → Production_Orders → Products → Batches → Warehouses
| Column | Source |
|--------|--------|
| order_number | PO.order_number |
| status | PO.status |
| **--- Materials Consumed ---** | |
| raw_material_sku | Raw_Product.sku |
| raw_material_name | Raw_Product.product_name_en |
| planned_qty | POM.planned_qty |
| actual_consumed | POM.actual_qty_consumed |
| variance_qty | actual - planned |
| unit_cost | POM.unit_cost |
| line_total_cost | POM.line_total_cost |
| source_warehouse | Warehouses.warehouse_name_en |
| batch_number | Batches.batch_number |
| **--- Output Produced ---** | |
| finished_sku | Finished_Product.sku |
| finished_name | Finished_Product.product_name_en |
| qty_produced | POO.qty_produced |
| qty_scrapped | POO.qty_scrapped |
| yield_pct | qty_produced / (qty_produced + qty_scrapped) × 100 |
| output_unit_cost | POO.unit_cost |
| output_batch | Output_Batch.batch_number |
| output_warehouse | Warehouses.warehouse_name_en |

### `vw_production_cost_analysis`
**Purpose:** Manufacturing cost report, margin analysis
**Joins:** Production_Orders → BOM → Products → PO_Materials + PO_Output (aggregated)
| Column | Source |
|--------|--------|
| order_number | PO.order_number |
| finished_product_name | Products.product_name_en |
| target_qty | PO.target_qty |
| actual_qty | PO.actual_qty_produced |
| estimated_material_cost | BOM.total_material_cost_estimate × (target/production_qty) |
| actual_material_cost | SUM(POM.line_total_cost) |
| material_variance | actual - estimated |
| estimated_operation_cost | BOM.total_operation_cost_estimate × (target/production_qty) |
| total_actual_cost | PO.total_actual_cost |
| cost_per_unit_produced | total_actual_cost / actual_qty |
| selling_price | Products.default_sales_price |
| estimated_margin | selling_price - cost_per_unit |
| scrap_qty | SUM(POO.qty_scrapped) |
| scrap_rate_pct | scrap / (produced + scrap) × 100 |

---

## 7. Human Resources Views

### `vw_employee_directory`
**Purpose:** Employee list screen, HR dashboard
**Joins:** Employees → Branches → Companies → Admin_Users
| Column | Source |
|--------|--------|
| employee_id | Emp.id |
| employee_code | Emp.employee_code |
| full_name_en | CONCAT(first_name_en, last_name_en) |
| full_name_ar | CONCAT(first_name_ar, last_name_ar) |
| gender | Emp.gender |
| nationality | Emp.nationality |
| national_id_iqama | Emp.national_id_or_iqama_number |
| department | Emp.department |
| designation | Emp.designation |
| branch_name_en | Branches.branch_name_en |
| joining_date | Emp.joining_date |
| years_of_service | (NOW - joining_date) in years |
| basic_salary | Emp.basic_salary |
| total_package | basic + housing + transport + other |
| gosi_registered | Emp.gosi_registered |
| gosi_number | Emp.gosi_number |
| iban_number | Emp.iban_number |
| has_erp_login | Emp.admin_user_id IS NOT NULL |
| is_active | Emp.is_active |

### `vw_employee_documents_expiry`
**Purpose:** HR alerts, document expiry dashboard, compliance tracking
**Joins:** Employee_Documents → Employees → Branches
| Column | Source |
|--------|--------|
| employee_code | Emp.employee_code |
| full_name_en | CONCAT(first_name_en, last_name_en) |
| department | Emp.department |
| branch_name_en | Branches.branch_name_en |
| document_type | Docs.document_type |
| document_number | Docs.document_number |
| issue_date | Docs.issue_date |
| expiry_date | Docs.expiry_date |
| days_to_expiry | expiry_date - CURRENT_DATE |
| expiry_status | CASE: EXPIRED / EXPIRING_30D / EXPIRING_60D / OK |
| is_verified | Docs.is_verified |
| attachment_url | Docs.attachment_url |

### `vw_attendance_monthly`
**Purpose:** Attendance report, monthly summary per employee
**Joins:** Attendance → Employees → Branches (aggregated by month)
| Column | Source |
|--------|--------|
| employee_code | Emp.employee_code |
| full_name_en | CONCAT(first_name_en, last_name_en) |
| department | Emp.department |
| branch_name_en | Branches.branch_name_en |
| month | MONTH(Att.date) |
| year | YEAR(Att.date) |
| total_present | COUNT WHERE status = PRESENT |
| total_absent | COUNT WHERE status = ABSENT |
| total_half_day | COUNT WHERE status = HALF_DAY |
| total_late | COUNT WHERE status = LATE |
| total_hours_worked | SUM(Att.total_hours_worked) |
| total_overtime | SUM(Att.overtime_hours) |
| working_days | COUNT(DISTINCT date) |

### `vw_leave_request_list`
**Purpose:** Leave management screen, approval queue
**Joins:** Leave_Requests → Employees → Users (approver)
| Column | Source |
|--------|--------|
| leave_id | LR.id |
| employee_code | Emp.employee_code |
| full_name_en | CONCAT(first_name_en, last_name_en) |
| department | Emp.department |
| leave_type | LR.leave_type |
| start_date | LR.start_date |
| end_date | LR.end_date |
| total_days | LR.total_days |
| reason | LR.reason |
| status | LR.status |
| approved_by_name | Approver.full_name |

### `vw_employee_leave_balance`
**Purpose:** Leave balance dashboard, entitlement tracking
**Joins:** Leave_Requests (aggregated) → Employees
| Column | Source |
|--------|--------|
| employee_code | Emp.employee_code |
| full_name_en | CONCAT(first_name_en, last_name_en) |
| years_of_service | (NOW - joining_date) |
| annual_entitlement | CASE: ≤5 yrs = 21 days, >5 yrs = 30 days (KSA labor law) |
| annual_used | SUM(total_days) WHERE leave_type = ANNUAL AND status = APPROVED AND year = current |
| annual_remaining | entitlement - used |
| sick_used | SUM WHERE leave_type = SICK |
| unpaid_used | SUM WHERE leave_type = UNPAID |
| total_absent_days | SUM all approved leaves this year |

### `vw_payroll_run_list`
**Purpose:** Payroll run list screen
**Joins:** Payroll_Runs → Companies → Users → Payroll_Slips (aggregated)
| Column | Source |
|--------|--------|
| payroll_id | PR.id |
| month | PR.month |
| year | PR.year |
| run_date | PR.run_date |
| status | PR.status |
| total_employees | COUNT(Payroll_Slips) |
| total_gross_pay | PR.total_gross_pay |
| total_deductions | PR.total_deductions |
| total_net_pay | PR.total_net_pay |
| total_gosi_employee | SUM(PS.gosi_deduction_employee) |
| total_gosi_employer | SUM(PS.gosi_deduction_employer) |
| unpaid_slips | COUNT WHERE payment_status = UNPAID |
| created_by | Users.full_name |

### `vw_payroll_slip_detail`
**Purpose:** Individual salary slip, print screen, WPS export
**Joins:** Payroll_Slips → Payroll_Runs → Employees → Branches
| Column | Source |
|--------|--------|
| slip_id | PS.id |
| month | PR.month |
| year | PR.year |
| employee_code | Emp.employee_code |
| full_name_en | CONCAT(first_name_en, last_name_en) |
| full_name_ar | CONCAT(first_name_ar, last_name_ar) |
| department | Emp.department |
| designation | Emp.designation |
| branch_name_en | Branches.branch_name_en |
| national_id_iqama | Emp.national_id_or_iqama_number |
| iban_number | Emp.iban_number |
| bank_code | Emp.bank_code |
| basic_pay | PS.basic_pay_amount |
| allowances | PS.allowances_amount |
| overtime | PS.overtime_amount |
| gross_pay | PS.gross_pay |
| gosi_employee | PS.gosi_deduction_employee |
| gosi_employer | PS.gosi_deduction_employer |
| absent_deductions | PS.absent_deductions |
| loan_deductions | PS.loan_deductions |
| total_deductions | gosi_employee + absent + loan |
| net_pay | PS.net_pay |
| payment_status | PS.payment_status |

### `vw_hr_cost_by_department`
**Purpose:** HR analytics, department-wise salary cost report
**Joins:** Payroll_Slips → Employees (aggregated by department, month)
| Column | Source |
|--------|--------|
| department | Emp.department |
| month | PR.month |
| year | PR.year |
| headcount | COUNT(DISTINCT employee_id) |
| total_gross_pay | SUM(PS.gross_pay) |
| total_gosi_employer | SUM(PS.gosi_deduction_employer) |
| total_cost_to_company | gross + gosi_employer |
| avg_salary | AVG(PS.net_pay) |
| total_overtime | SUM(PS.overtime_amount) |

---

## 8. Cross-Module Analytics & Dashboard Views

### `vw_dashboard_kpi_summary`
**Purpose:** Main dashboard KPI tiles — single-row snapshot of business health
**Joins:** Sales_Invoices + Purchase_Invoices + Stock_Ledger + Employees + Production_Orders (all aggregated)
| Column | Source |
|--------|--------|
| total_revenue_today | SUM(SI.total_incl_tax) WHERE DATE = TODAY |
| total_revenue_month | SUM(SI.total_incl_tax) WHERE MONTH = CURRENT |
| total_expenses_month | SUM(PI.total_incl_tax) WHERE MONTH = CURRENT |
| gross_profit_month | revenue - expenses |
| total_open_invoices_ar | COUNT(SI WHERE status IN POSTED, PARTIAL_PAID) |
| total_ar_outstanding | SUM(SI.total_incl_tax - amount_paid) |
| total_open_invoices_ap | COUNT(PI WHERE status IN POSTED, PARTIAL_PAID) |
| total_ap_outstanding | SUM(PI.total_incl_tax - amount_paid) |
| total_products | COUNT(Products WHERE is_active) |
| low_stock_alerts | COUNT WHERE stock_on_hand < reorder_level |
| expiring_batches_30d | COUNT(Batches WHERE expiry ≤ NOW + 30d) |
| active_employees | COUNT(Employees WHERE is_active) |
| pending_leave_requests | COUNT(Leave WHERE status = PENDING) |
| active_production_orders | COUNT(Prod_Orders WHERE status = IN_PROGRESS) |
| pos_sessions_open | COUNT(POS_Sessions WHERE status = OPEN) |

### `vw_profit_loss_report`
**Purpose:** P&L statement — Income vs Expenses by account
**Joins:** Journal_Entry_Lines → Chart_Of_Accounts → Journal_Entries (WHERE status = POSTED)
| Column | Source |
|--------|--------|
| account_type | COA.account_type (INCOME / EXPENSE only) |
| account_code | COA.account_code |
| account_name_en | COA.account_name_en |
| parent_account_name | Parent_COA.account_name_en |
| total_amount | SUM(credit - debit) for INCOME, SUM(debit - credit) for EXPENSE |
| period_month | Grouped by month |
| period_year | Grouped by year |
| **--- Totals ---** | |
| total_income | SUM all INCOME accounts |
| total_expenses | SUM all EXPENSE accounts |
| net_profit | total_income - total_expenses |

### `vw_balance_sheet`
**Purpose:** Balance Sheet report — Assets, Liabilities, Equity
**Joins:** Journal_Entry_Lines → Chart_Of_Accounts (WHERE type IN ASSET, LIABILITY, EQUITY)
| Column | Source |
|--------|--------|
| account_type | COA.account_type |
| account_code | COA.account_code |
| account_name_en | COA.account_name_en |
| parent_account_name | Parent_COA.account_name_en |
| balance | SUM(debit - credit) for ASSET, SUM(credit - debit) for LIABILITY/EQUITY |
| as_of_date | Parameter: report date |
| **--- Totals ---** | |
| total_assets | SUM all ASSET |
| total_liabilities | SUM all LIABILITY |
| total_equity | SUM all EQUITY |
| balance_check | assets - (liabilities + equity) = 0 |

### `vw_cash_flow_summary`
**Purpose:** Cash flow report — receipts vs payments by mode
**Joins:** Vouchers → Payment_Modes → Bank_Accounts (aggregated by period)
| Column | Source |
|--------|--------|
| period_month | MONTH(V.date) |
| period_year | YEAR(V.date) |
| total_receipts | SUM(amount) WHERE voucher_type = RECEIPT |
| total_payments | SUM(amount) WHERE voucher_type = PAYMENT |
| net_cash_flow | receipts - payments |
| cash_receipts | SUM WHERE payment_mode = CASH |
| bank_receipts | SUM WHERE payment_mode = BANK_TRANSFER |
| cash_payments | SUM WHERE payment_mode = CASH |
| bank_payments | SUM WHERE payment_mode = BANK_TRANSFER |

### `vw_revenue_by_branch`
**Purpose:** Branch performance analytics, management dashboard
**Joins:** Sales_Invoices → Branches (aggregated)
| Column | Source |
|--------|--------|
| branch_name_en | Branches.branch_name_en |
| period_month | MONTH(SI.invoice_date) |
| period_year | YEAR(SI.invoice_date) |
| total_invoices | COUNT(SI) |
| total_revenue | SUM(SI.total_amount_incl_tax) |
| total_returns | SUM(SR.total_amount_incl_tax) |
| net_revenue | revenue - returns |
| total_discount | SUM(SI.total_discount_amount) |
| total_tax_collected | SUM(SI.total_tax_amount) |
| avg_invoice_value | AVG(SI.total_amount_incl_tax) |

### `vw_top_selling_products`
**Purpose:** Product performance analytics, sales ranking
**Joins:** Sales_Invoice_Lines → Products → Categories → Brands (aggregated)
| Column | Source |
|--------|--------|
| product_sku | Products.sku |
| product_name_en | Products.product_name_en |
| category_name | Categories.category_name_en |
| brand_name | Brands.brand_name_en |
| total_qty_sold | SUM(SIL.quantity) |
| total_revenue | SUM(SIL.line_total) |
| total_cost | SUM(SIL.cost_of_goods_sold) |
| gross_margin | revenue - cost |
| margin_pct | (margin / revenue) × 100 |
| avg_selling_price | AVG(SIL.unit_price) |
| times_sold | COUNT(DISTINCT sales_invoice_id) |

### `vw_top_customers`
**Purpose:** Customer ranking, CRM analytics
**Joins:** Sales_Invoices → Customers (aggregated)
| Column | Source |
|--------|--------|
| customer_code | Customers.customer_code |
| customer_name_en | Customers.customer_name_en |
| customer_type | Customers.customer_type |
| total_invoices | COUNT(SI) |
| total_revenue | SUM(SI.total_amount_incl_tax) |
| total_returns | SUM(SR.total_amount_incl_tax) |
| net_revenue | revenue - returns |
| current_balance | Customers.current_balance |
| credit_limit | Customers.credit_limit |
| last_purchase_date | MAX(SI.invoice_date) |

### `vw_top_suppliers`
**Purpose:** Vendor ranking, procurement analytics
**Joins:** Purchase_Invoices → Suppliers (aggregated)
| Column | Source |
|--------|--------|
| supplier_code | Suppliers.supplier_code |
| supplier_name_en | Suppliers.supplier_name_en |
| total_invoices | COUNT(PI) |
| total_purchases | SUM(PI.total_amount_incl_tax) |
| total_returns | SUM(PR.total_amount) |
| net_purchases | purchases - returns |
| current_balance | Suppliers.current_balance |
| avg_lead_time | AVG(GRN.grn_date - PO.po_date) |

### `vw_product_profitability`
**Purpose:** Product margin analysis, pricing decisions
**Joins:** Sales_Invoice_Lines → Products → Categories (aggregated)
| Column | Source |
|--------|--------|
| product_sku | Products.sku |
| product_name_en | Products.product_name_en |
| category_name | Categories.category_name_en |
| total_qty_sold | SUM(SIL.quantity) |
| total_revenue | SUM(SIL.line_total) |
| total_cogs | SUM(SIL.cost_of_goods_sold) |
| gross_profit | revenue - cogs |
| margin_pct | (gross_profit / revenue) × 100 |
| avg_selling_price | AVG(unit_price) |
| avg_cost_price | AVG(cost_of_goods_sold / quantity) |
| current_stock | SUM(Stock_Ledger.quantity) |
| stock_value | current_stock × avg_cost |

### `vw_payment_mode_analytics`
**Purpose:** Payment mode usage report, POS config optimization
**Joins:** Sales_Payments → Payment_Modes → Sales_Invoices → Branches (aggregated)
| Column | Source |
|--------|--------|
| payment_mode_name | Payment_Modes.name_en |
| payment_type | Payment_Modes.type |
| branch_name_en | Branches.branch_name_en |
| transaction_count | COUNT(SP) |
| total_amount | SUM(SP.amount) |
| pct_of_total | (amount / total_all_modes) × 100 |
| avg_transaction | AVG(SP.amount) |
| period_month | Grouped by month |

---

## 9. Audit & Compliance Views

### `vw_audit_log_detail`
**Purpose:** Audit trail screen, compliance review
**Joins:** Audit_Logs → Admin_Users
| Column | Source |
|--------|--------|
| log_id | AL.id |
| timestamp | AL.timestamp |
| user_name | Users.full_name |
| username | Users.username |
| action_type | AL.action_type |
| table_name | AL.table_name |
| record_id | AL.record_id |
| old_values | AL.old_values (JSON) |
| new_values | AL.new_values (JSON) |
| ip_address | AL.ip_address |
| endpoint | AL.endpoint |

### `vw_user_activity_summary`
**Purpose:** Security dashboard, user activity analytics
**Joins:** Audit_Logs → Admin_Users (aggregated)
| Column | Source |
|--------|--------|
| user_name | Users.full_name |
| username | Users.username |
| total_actions | COUNT(AL) |
| creates | COUNT WHERE action_type = CREATE |
| updates | COUNT WHERE action_type = UPDATE |
| deletes | COUNT WHERE action_type = DELETE |
| logins | COUNT WHERE action_type = LOGIN |
| failed_logins | COUNT WHERE action_type = FAILED_LOGIN |
| last_activity | MAX(AL.timestamp) |
| period | Grouped by day/week/month |

### `vw_zatca_compliance_check`
**Purpose:** ZATCA compliance dashboard — ensures all invoices have required fields
**Joins:** Sales_Invoices → Customers → Companies → Zatca_Configs
| Column | Source |
|--------|--------|
| invoice_number | SI.invoice_number |
| invoice_type | SI.invoice_type |
| invoice_date | SI.invoice_date |
| has_seller_vat | Companies.vat_number IS NOT NULL |
| has_buyer_vat | Customers.vat_number IS NOT NULL (required for B2B) |
| has_qr_code | SI.zatca_qr_code_tlv IS NOT NULL |
| has_invoice_hash | SI.zatca_invoice_hash IS NOT NULL |
| has_prev_hash | SI.zatca_previous_invoice_hash IS NOT NULL |
| has_uuid | SI.zatca_uuid IS NOT NULL |
| is_compliant | All required fields present based on invoice_type |
| missing_fields | List of NULL required fields |

---

## View Summary

| Module | Views | Purpose |
|--------|-------|---------|
| System & Config | 5 | Branch, users, permissions, hardware, payment modes |
| Finance & Accounts | 8 | COA, journals, ledger, trial balance, vouchers, bank, tax |
| Inventory | 10 | Products, stock, batches, serials, transfers, adjustments |
| Purchases | 9 | Suppliers, POs, GRNs, invoices, AP aging, payments, returns |
| Sales & POS | 11 | Customers, orders, invoices, payments, AR aging, POS sessions |
| Manufacturing | 6 | Work centers, BOMs, production orders, cost analysis |
| Human Resources | 8 | Employees, documents, attendance, leaves, payroll |
| Analytics | 10 | Dashboard KPIs, P&L, balance sheet, cash flow, rankings |
| Audit & Compliance | 3 | Audit logs, user activity, ZATCA compliance |
| **Total** | **70** | |

