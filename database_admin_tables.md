# Centrus ERP: Admin Database Tables

This database is dedicated to Role-Based Access Control (RBAC), user management, authentication, and system-level auditing. Keeping this separate ensures that core business data is isolated from security and access management concerns.

## User & Authentication Tables
- **Centrus_Admin_Users**
  (Stores core user information such as username, password hash, email, status, and linked employee ID if applicable)
  - Columns:
    -- id (UUID/Integer - Primary Key)
    -- username (String - Unique, used for login)
    -- email (String - Unique)
    -- hashed_password (String)
    -- full_name (String)
    -- employee_id (UUID/Integer - Optional, links to Centrus_Core_Employees in the Core DB)
    -- company_id (UUID/Integer - Optional, restricts user to a specific Company)
    -- branch_id (UUID/Integer - Optional, restricts user to a specific Branch)
    -- is_superuser (Boolean - Bypasses all RBAC checks)
    -- is_active (Boolean - Controls login ability)
    -- is_locked (Boolean - Locked after excessive failed logins)
    -- failed_login_attempts (Integer)
    -- last_login_at (Timestamp)
    -- created_at (Timestamp)
    -- updated_at (Timestamp)

- **Centrus_Admin_Sessions**
  (Tracks active user login sessions, JWT refresh tokens, IP addresses, and login/logout timestamps)
  - Columns:
    -- id (UUID/Integer - Primary Key)
    -- user_id (Foreign Key -> Centrus_Admin_Users)
    -- refresh_token (String - Used for issuing new JWT access tokens)
    -- ip_address (String)
    -- user_agent (String - Browser/Device info)
    -- expires_at (Timestamp)
    -- is_revoked (Boolean - Set to true to force a user logout)
    -- created_at (Timestamp)

- **Centrus_Admin_Audit_Logs**
  (System-wide tracking of user activities: who did what, when, and from where. Captures IP, Action, Table Affected, and Timestamp)
  - Columns:
    -- id (UUID/Integer - Primary Key)
    -- user_id (Foreign Key -> Centrus_Admin_Users - Nullable for automated system tasks)
    -- action_type (Enum - CREATE, UPDATE, DELETE, LOGIN, LOGOUT, FAILED_LOGIN)
    -- table_name (String - The specific table affected, e.g., 'Centrus_Core_Journal_Entries')
    -- record_id (String - The ID of the affected row)
    -- old_values (JSON - Snapshot of data before the change)
    -- new_values (JSON - Snapshot of data after the change)
    -- ip_address (String)
    -- endpoint (String - The API route that was called)
    -- timestamp (Timestamp)

## Role-Based Access Control (RBAC) Tables
- **Centrus_Admin_Roles**
  (Defines User Roles such as Super Admin, Branch Manager, Cashier, Inventory Clerk, HR Manager)
  - Columns:
    -- id (UUID/Integer - Primary Key)
    -- company_id (Foreign Key -> Centrus_Core_Companies - Nullable if global, or specific if roles differ per company)
    -- role_name (String - Unique, e.g., 'Branch Manager', 'Cashier', 'Accountant')
    -- description (Text)
    -- is_system_role (Boolean - True for hardcoded roles that cannot be deleted, like 'Super Admin')
    -- is_active (Boolean)
    -- created_at (Timestamp)
    -- updated_at (Timestamp)

- **Centrus_Admin_Permissions**
  (A master list of granular permissions across all modules, e.g., 'view_sales_invoice', 'create_purchase_order', 'delete_journal_entry', 'approve_leave')
  - Columns:
    -- id (UUID/Integer - Primary Key)
    -- module_name (String - e.g., 'Sales', 'Finance', 'Inventory', 'HR')
    -- permission_code (String - Unique, standard format e.g., 'sales:invoice:create', 'finance:journal:approve')
    -- description (String)
    -- created_at (Timestamp)

- **Centrus_Admin_Role_Permissions**
  (Mapping table linking a specific Role to multiple Permissions. Defines what each role is allowed to do)
  - Columns:
    -- id (UUID/Integer - Primary Key)
    -- role_id (Foreign Key -> Centrus_Admin_Roles)
    -- permission_id (Foreign Key -> Centrus_Admin_Permissions)
    -- created_at (Timestamp)

- **Centrus_Admin_User_Roles**
  (Mapping table linking a specific User to one or more Roles)
  - Columns:
    -- id (UUID/Integer - Primary Key)
    -- user_id (Foreign Key -> Centrus_Admin_Users)
    -- role_id (Foreign Key -> Centrus_Admin_Roles)
    -- assigned_by (Foreign Key -> Centrus_Admin_Users)
    -- created_at (Timestamp)

- **Centrus_Admin_User_Branch_Access**
  (Mapping table controlling which Users have access to which physical Branches or Stores. Crucial for multi-branch setups so a cashier only sees their own branch data)
  - Columns:
    -- id (UUID/Integer - Primary Key)
    -- user_id (Foreign Key -> Centrus_Admin_Users)
    -- branch_id (Foreign Key -> Centrus_Core_Branches - Link to Core DB)
    -- granted_by (Foreign Key -> Centrus_Admin_Users)
    -- created_at (Timestamp)
