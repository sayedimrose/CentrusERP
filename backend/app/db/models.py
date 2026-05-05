from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Float, DateTime, Enum, JSON, Date
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from .database import Base

class AccountType(enum.Enum):
    ASSET = "ASSET"
    LIABILITY = "LIABILITY"
    EQUITY = "EQUITY"
    INCOME = "INCOME"
    EXPENSE = "EXPENSE"

class JournalEntryStatus(enum.Enum):
    DRAFT = "DRAFT"
    POSTED = "POSTED"
    CANCELLED = "CANCELLED"

class PartnerType(enum.Enum):
    CUSTOMER = "CUSTOMER"
    SUPPLIER = "SUPPLIER"
    EMPLOYEE = "EMPLOYEE"

class ChartOfAccount(Base):
    __tablename__ = "centrus_core_chart_of_accounts"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("centrus_core_companies.id"), nullable=False)
    account_code = Column(String, unique=True, index=True, nullable=False)
    account_name_en = Column(String, nullable=False)
    account_name_ar = Column(String)
    account_type = Column(Enum(AccountType), nullable=False)
    parent_account_id = Column(Integer, ForeignKey("centrus_core_chart_of_accounts.id"), nullable=True)
    is_group = Column(Boolean, default=False)
    is_reconcilable = Column(Boolean, default=False)
    currency = Column(String, default="SAR")
    current_balance = Column(Float, default=0.0)
    description = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Self-referential relationship for hierarchical tree
    children = relationship("ChartOfAccount", backref="parent", remote_side=[id])

class JournalEntry(Base):
    __tablename__ = "centrus_core_journal_entries"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("centrus_core_companies.id"), nullable=False)
    branch_id = Column(Integer, ForeignKey("centrus_core_branches.id"), nullable=False)
    entry_number = Column(String, unique=True, index=True, nullable=False)
    reference_number = Column(String, index=True)
    entry_date = Column(Date, nullable=False)
    description = Column(String)
    total_debit = Column(Float, default=0.0)
    total_credit = Column(Float, default=0.0)
    status = Column(Enum(JournalEntryStatus), default=JournalEntryStatus.DRAFT)
    source_module = Column(String)
    created_by = Column(Integer, ForeignKey("centrus_admin_users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    lines = relationship("JournalEntryLine", back_populates="journal_entry")

class JournalEntryLine(Base):
    __tablename__ = "centrus_core_journal_entry_lines"

    id = Column(Integer, primary_key=True, index=True)
    journal_entry_id = Column(Integer, ForeignKey("centrus_core_journal_entries.id"), nullable=False)
    account_id = Column(Integer, ForeignKey("centrus_core_chart_of_accounts.id"), nullable=False)
    description = Column(String, nullable=True)
    debit = Column(Float, default=0.0)
    credit = Column(Float, default=0.0)
    cost_center_id = Column(Integer, nullable=True) # Can link to a cost center table later
    partner_id = Column(Integer, nullable=True) # Polymorphic link
    partner_type = Column(Enum(PartnerType), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    journal_entry = relationship("JournalEntry", back_populates="lines")
    account = relationship("ChartOfAccount")

class ActionType(enum.Enum):
    CREATE = "CREATE"
    UPDATE = "UPDATE"
    DELETE = "DELETE"
    LOGIN = "LOGIN"
    LOGOUT = "LOGOUT"
    FAILED_LOGIN = "FAILED_LOGIN"

class AdminUser(Base):
    __tablename__ = "centrus_admin_users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String)
    employee_id = Column(Integer, nullable=True) # Links to centrus_core_employees
    company_id = Column(Integer, nullable=True) # Links to centrus_core_companies
    branch_id = Column(Integer, nullable=True) # Links to centrus_core_branches
    is_superuser = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    is_locked = Column(Boolean, default=False)
    failed_login_attempts = Column(Integer, default=0)
    last_login_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    sessions = relationship("AdminSession", back_populates="user")
    audit_logs = relationship("AdminAuditLog", back_populates="user")

class AdminSession(Base):
    __tablename__ = "centrus_admin_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("centrus_admin_users.id"), nullable=False)
    refresh_token = Column(String, unique=True, index=True, nullable=False)
    ip_address = Column(String)
    user_agent = Column(String)
    expires_at = Column(DateTime, nullable=False)
    is_revoked = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("AdminUser", back_populates="sessions")

class AdminAuditLog(Base):
    __tablename__ = "centrus_admin_audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("centrus_admin_users.id"), nullable=True)
    action_type = Column(Enum(ActionType), nullable=False)
    table_name = Column(String, nullable=False)
    record_id = Column(String, nullable=True)
    old_values = Column(JSON, nullable=True)
    new_values = Column(JSON, nullable=True)
    ip_address = Column(String, nullable=True)
    endpoint = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("AdminUser", back_populates="audit_logs")

class AdminRole(Base):
    __tablename__ = "centrus_admin_roles"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, nullable=True) # Optional link to centrus_core_companies
    role_name = Column(String, unique=True, index=True, nullable=False)
    description = Column(String)
    is_system_role = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    permissions = relationship("AdminRolePermission", back_populates="role")
    user_roles = relationship("AdminUserRole", back_populates="role")

class AdminPermission(Base):
    __tablename__ = "centrus_admin_permissions"

    id = Column(Integer, primary_key=True, index=True)
    module_name = Column(String, nullable=False)
    permission_code = Column(String, unique=True, index=True, nullable=False)
    description = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    role_permissions = relationship("AdminRolePermission", back_populates="permission")

class AdminRolePermission(Base):
    __tablename__ = "centrus_admin_role_permissions"

    id = Column(Integer, primary_key=True, index=True)
    role_id = Column(Integer, ForeignKey("centrus_admin_roles.id"), nullable=False)
    permission_id = Column(Integer, ForeignKey("centrus_admin_permissions.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    role = relationship("AdminRole", back_populates="permissions")
    permission = relationship("AdminPermission", back_populates="role_permissions")

class AdminUserRole(Base):
    __tablename__ = "centrus_admin_user_roles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("centrus_admin_users.id"), nullable=False)
    role_id = Column(Integer, ForeignKey("centrus_admin_roles.id"), nullable=False)
    assigned_by = Column(Integer, ForeignKey("centrus_admin_users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("AdminUser", foreign_keys=[user_id], backref="roles")
    role = relationship("AdminRole", back_populates="user_roles")
    assigner = relationship("AdminUser", foreign_keys=[assigned_by])

class AdminUserBranchAccess(Base):
    __tablename__ = "centrus_admin_user_branch_access"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("centrus_admin_users.id"), nullable=False)
    branch_id = Column(Integer, nullable=False) # Links to centrus_core_branches
    granted_by = Column(Integer, ForeignKey("centrus_admin_users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("AdminUser", foreign_keys=[user_id], backref="branch_access")
    granter = relationship("AdminUser", foreign_keys=[granted_by])

class DeviceType(enum.Enum):
    PRINTER = "PRINTER"
    SCANNER = "SCANNER"
    PAYMENT_TERMINAL = "PAYMENT_TERMINAL"
    CASH_DRAWER = "CASH_DRAWER"

class PaymentType(enum.Enum):
    CASH = "CASH"
    BANK_TRANSFER = "BANK_TRANSFER"
    CREDIT = "CREDIT"
    WALLET = "WALLET"

class Company(Base):
    __tablename__ = "centrus_core_companies"

    id = Column(Integer, primary_key=True, index=True)
    company_name_en = Column(String, nullable=False)
    company_name_ar = Column(String)
    vat_number = Column(String)
    commercial_registration_number = Column(String)
    base_currency = Column(String, default="SAR")
    timezone = Column(String)
    logo_url = Column(String)
    building_no = Column(String)
    street_name_en = Column(String)
    street_name_ar = Column(String)
    district_en = Column(String)
    district_ar = Column(String)
    city_en = Column(String)
    city_ar = Column(String)
    postal_code = Column(String)
    country = Column(String, default="Saudi Arabia")
    phone_number = Column(String)
    email = Column(String)
    website = Column(String)
    financial_year_start = Column(Date)
    financial_year_end = Column(Date)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    branches = relationship("Branch", back_populates="company")

class Branch(Base):
    __tablename__ = "centrus_core_branches"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("centrus_core_companies.id"), nullable=False)
    branch_code = Column(String, unique=True, index=True, nullable=False)
    branch_name_en = Column(String, nullable=False)
    branch_name_ar = Column(String)
    building_no = Column(String)
    street_name_en = Column(String)
    street_name_ar = Column(String)
    district_en = Column(String)
    district_ar = Column(String)
    city_en = Column(String)
    city_ar = Column(String)
    postal_code = Column(String)
    phone_number = Column(String)
    email = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    company = relationship("Company", back_populates="branches")
    hardware_devices = relationship("HardwareDevice", back_populates="branch")

class HardwareDevice(Base):
    __tablename__ = "centrus_core_hardware_devices"

    id = Column(Integer, primary_key=True, index=True)
    branch_id = Column(Integer, ForeignKey("centrus_core_branches.id"), nullable=False)
    device_type = Column(Enum(DeviceType), nullable=False)
    device_name = Column(String, nullable=False)
    ip_address = Column(String)
    mac_address = Column(String)
    port = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    branch = relationship("Branch", back_populates="hardware_devices")

class PaymentMode(Base):
    __tablename__ = "centrus_core_payment_modes"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True, nullable=False)
    name_en = Column(String, nullable=False)
    name_ar = Column(String)
    type = Column(Enum(PaymentType), nullable=False)
    gl_account_id = Column(Integer, ForeignKey("centrus_core_chart_of_accounts.id"), nullable=True)
    is_system_default = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    gl_account = relationship("ChartOfAccount")

from sqlalchemy import Text

class BranchPaymentMode(Base):
    __tablename__ = "centrus_core_branch_payment_modes"

    id = Column(Integer, primary_key=True, index=True)
    branch_id = Column(Integer, ForeignKey("centrus_core_branches.id"), nullable=False)
    payment_mode_id = Column(Integer, ForeignKey("centrus_core_payment_modes.id"), nullable=False)
    override_gl_account_id = Column(Integer, ForeignKey("centrus_core_chart_of_accounts.id"), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    branch = relationship("Branch", backref="branch_payment_modes")
    payment_mode = relationship("PaymentMode")
    override_gl_account = relationship("ChartOfAccount")

class ZatcaEnvironment(enum.Enum):
    SANDBOX = "SANDBOX"
    SIMULATION = "SIMULATION"
    PRODUCTION = "PRODUCTION"

class ZatcaConfig(Base):
    __tablename__ = "centrus_core_zatca_configs"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("centrus_core_companies.id"), nullable=False)
    environment = Column(Enum(ZatcaEnvironment), nullable=False)
    csid = Column(String)
    compliance_csid = Column(String)
    private_key = Column(Text)
    public_key = Column(Text)
    certificate = Column(Text)
    api_secret = Column(Text)
    last_invoice_hash = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    company = relationship("Company", backref="zatca_configs")

class VoucherType(enum.Enum):
    RECEIPT = "RECEIPT"
    PAYMENT = "PAYMENT"
    CONTRA = "CONTRA"

class VoucherStatus(enum.Enum):
    DRAFT = "DRAFT"
    POSTED = "POSTED"
    CANCELLED = "CANCELLED"

class TaxType(enum.Enum):
    SALES = "SALES"
    PURCHASES = "PURCHASES"
    BOTH = "BOTH"

class BankAccount(Base):
    __tablename__ = "centrus_core_bank_accounts"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("centrus_core_companies.id"), nullable=False)
    gl_account_id = Column(Integer, ForeignKey("centrus_core_chart_of_accounts.id"), nullable=False)
    bank_name_en = Column(String, nullable=False)
    bank_name_ar = Column(String)
    account_name = Column(String, nullable=False)
    account_number = Column(String, nullable=False)
    iban = Column(String)
    swift_code = Column(String)
    currency = Column(String, default="SAR")
    current_balance = Column(Float, default=0.0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    company = relationship("Company", backref="bank_accounts")
    gl_account = relationship("ChartOfAccount")

class BankTransaction(Base):
    __tablename__ = "centrus_core_bank_transactions"

    id = Column(Integer, primary_key=True, index=True)
    bank_account_id = Column(Integer, ForeignKey("centrus_core_bank_accounts.id"), nullable=False)
    transaction_date = Column(Date, nullable=False)
    description = Column(String)
    reference = Column(String)
    amount = Column(Float, nullable=False)
    is_reconciled = Column(Boolean, default=False)
    matched_journal_line_id = Column(Integer, ForeignKey("centrus_core_journal_entry_lines.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    bank_account = relationship("BankAccount", backref="transactions")
    matched_journal_line = relationship("JournalEntryLine")

class Voucher(Base):
    __tablename__ = "centrus_core_vouchers"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("centrus_core_companies.id"), nullable=False)
    branch_id = Column(Integer, ForeignKey("centrus_core_branches.id"), nullable=False)
    voucher_number = Column(String, unique=True, index=True, nullable=False)
    voucher_type = Column(Enum(VoucherType), nullable=False)
    date = Column(Date, nullable=False)
    partner_id = Column(Integer, nullable=True) # Polymorphic
    partner_type = Column(Enum(PartnerType), nullable=True)
    payment_mode_id = Column(Integer, ForeignKey("centrus_core_payment_modes.id"), nullable=False)
    bank_account_id = Column(Integer, ForeignKey("centrus_core_bank_accounts.id"), nullable=True)
    cheque_number = Column(String)
    cheque_date = Column(Date)
    amount = Column(Float, nullable=False)
    amount_in_words_ar = Column(String)
    amount_in_words_en = Column(String)
    narration = Column(String)
    journal_entry_id = Column(Integer, ForeignKey("centrus_core_journal_entries.id"), nullable=True)
    status = Column(Enum(VoucherStatus), default=VoucherStatus.DRAFT)
    created_by = Column(Integer, ForeignKey("centrus_admin_users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    company = relationship("Company")
    branch = relationship("Branch")
    payment_mode = relationship("PaymentMode")
    bank_account = relationship("BankAccount")
    journal_entry = relationship("JournalEntry")

class TaxRate(Base):
    __tablename__ = "centrus_core_tax_rates"

    id = Column(Integer, primary_key=True, index=True)
    tax_name_en = Column(String, nullable=False)
    tax_name_ar = Column(String)
    rate = Column(Float, nullable=False)
    tax_type = Column(Enum(TaxType), nullable=False)
    is_inclusive = Column(Boolean, default=False)
    gl_account_id = Column(Integer, ForeignKey("centrus_core_chart_of_accounts.id"), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    gl_account = relationship("ChartOfAccount")

class ProductType(enum.Enum):
    INVENTORY = "INVENTORY"
    NON_INVENTORY = "NON_INVENTORY"
    SERVICE = "SERVICE"
    CONSUMABLE = "CONSUMABLE"

class ProductCategory(Base):
    __tablename__ = "centrus_core_product_categories"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("centrus_core_companies.id"), nullable=False)
    category_code = Column(String, unique=True, index=True, nullable=False)
    category_name_en = Column(String, nullable=False)
    category_name_ar = Column(String)
    parent_category_id = Column(Integer, ForeignKey("centrus_core_product_categories.id"), nullable=True)
    description = Column(String)
    image_url = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    children = relationship("ProductCategory", backref="parent", remote_side=[id])

class Brand(Base):
    __tablename__ = "centrus_core_brands"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("centrus_core_companies.id"), nullable=False)
    brand_name_en = Column(String, nullable=False)
    brand_name_ar = Column(String)
    description = Column(String)
    logo_url = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Product(Base):
    __tablename__ = "centrus_core_products"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("centrus_core_companies.id"), nullable=False)
    category_id = Column(Integer, ForeignKey("centrus_core_product_categories.id"), nullable=False)
    brand_id = Column(Integer, ForeignKey("centrus_core_brands.id"), nullable=True)
    sku = Column(String, unique=True, index=True, nullable=False)
    barcode = Column(String, index=True)
    product_name_en = Column(String, nullable=False)
    product_name_ar = Column(String)
    description = Column(String)
    product_type = Column(Enum(ProductType), nullable=False)
    base_uom = Column(String, nullable=False)
    has_variants = Column(Boolean, default=False)
    tracks_batches = Column(Boolean, default=False)
    tracks_serials = Column(Boolean, default=False)
    default_sales_price = Column(Float, default=0.0)
    default_cost_price = Column(Float, default=0.0)
    tax_rate_id = Column(Integer, ForeignKey("centrus_core_tax_rates.id"), nullable=True)
    image_url = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    category = relationship("ProductCategory", backref="products")
    brand = relationship("Brand", backref="products")
    tax_rate = relationship("TaxRate")
    variants = relationship("ProductVariant", back_populates="product")

class ProductVariant(Base):
    __tablename__ = "centrus_core_product_variants"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("centrus_core_products.id"), nullable=False)
    variant_sku = Column(String, unique=True, index=True, nullable=False)
    variant_barcode = Column(String, index=True)
    attribute_1_name = Column(String)
    attribute_1_value = Column(String)
    attribute_2_name = Column(String)
    attribute_2_value = Column(String)
    sales_price_override = Column(Float, nullable=True)
    cost_price_override = Column(Float, nullable=True)
    image_url = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    product = relationship("Product", back_populates="variants")

class Warehouse(Base):
    __tablename__ = "centrus_core_warehouses"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("centrus_core_companies.id"), nullable=False)
    branch_id = Column(Integer, ForeignKey("centrus_core_branches.id"), nullable=True)
    warehouse_code = Column(String, unique=True, index=True, nullable=False)
    warehouse_name_en = Column(String, nullable=False)
    warehouse_name_ar = Column(String)
    address = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    company = relationship("Company", backref="warehouses")
    branch = relationship("Branch", backref="warehouses")

class LocationType(enum.Enum):
    INTERNAL = "INTERNAL"
    TRANSIT = "TRANSIT"
    DAMAGE = "DAMAGE"
    VENDOR_RETURN = "VENDOR_RETURN"

class SerialNumberStatus(enum.Enum):
    IN_STOCK = "IN_STOCK"
    SOLD = "SOLD"
    IN_TRANSIT = "IN_TRANSIT"
    RETURNED = "RETURNED"
    DAMAGED = "DAMAGED"

class TransactionType(enum.Enum):
    PURCHASE = "PURCHASE"
    SALE = "SALE"
    TRANSFER_IN = "TRANSFER_IN"
    TRANSFER_OUT = "TRANSFER_OUT"
    ADJUSTMENT = "ADJUSTMENT"
    CONSUMPTION = "CONSUMPTION"
    RETURN = "RETURN"

class TransferStatus(enum.Enum):
    DRAFT = "DRAFT"
    IN_TRANSIT = "IN_TRANSIT"
    RECEIVED = "RECEIVED"
    CANCELLED = "CANCELLED"

class AdjustmentType(enum.Enum):
    PHYSICAL_COUNT = "PHYSICAL_COUNT"
    DAMAGE = "DAMAGE"
    EXPIRY = "EXPIRY"
    FOUND = "FOUND"

class DocumentStatus(enum.Enum):
    DRAFT = "DRAFT"
    POSTED = "POSTED"
    CANCELLED = "CANCELLED"

class SubLocation(Base):
    __tablename__ = "centrus_core_sub_locations"

    id = Column(Integer, primary_key=True, index=True)
    warehouse_id = Column(Integer, ForeignKey("centrus_core_warehouses.id"), nullable=False)
    location_code = Column(String, nullable=False)
    location_name_en = Column(String, nullable=False)
    location_name_ar = Column(String)
    location_type = Column(Enum(LocationType), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    warehouse = relationship("Warehouse", backref="sub_locations")

class StockBatch(Base):
    __tablename__ = "centrus_core_stock_batches"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("centrus_core_products.id"), nullable=False)
    batch_number = Column(String, nullable=False)
    manufacturing_date = Column(Date, nullable=True)
    expiry_date = Column(Date, nullable=True)
    supplier_id = Column(Integer, nullable=True) # Will link to Suppliers later
    created_at = Column(DateTime, default=datetime.utcnow)

    product = relationship("Product", backref="batches")

class StockSerialNumber(Base):
    __tablename__ = "centrus_core_stock_serial_numbers"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("centrus_core_products.id"), nullable=False)
    serial_number = Column(String, unique=True, index=True, nullable=False)
    status = Column(Enum(SerialNumberStatus), default=SerialNumberStatus.IN_STOCK)
    current_sub_location_id = Column(Integer, ForeignKey("centrus_core_sub_locations.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    product = relationship("Product", backref="serial_numbers")
    current_sub_location = relationship("SubLocation")

class StockLedger(Base):
    __tablename__ = "centrus_core_stock_ledger"

    id = Column(Integer, primary_key=True, index=True)
    transaction_date = Column(DateTime, default=datetime.utcnow, nullable=False)
    product_id = Column(Integer, ForeignKey("centrus_core_products.id"), nullable=False)
    variant_id = Column(Integer, ForeignKey("centrus_core_product_variants.id"), nullable=True)
    warehouse_id = Column(Integer, ForeignKey("centrus_core_warehouses.id"), nullable=False)
    sub_location_id = Column(Integer, ForeignKey("centrus_core_sub_locations.id"), nullable=True)
    batch_id = Column(Integer, ForeignKey("centrus_core_stock_batches.id"), nullable=True)
    transaction_type = Column(Enum(TransactionType), nullable=False)
    reference_id = Column(String)
    quantity = Column(Float, nullable=False)
    unit_cost = Column(Float, nullable=False)
    total_cost = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    product = relationship("Product")
    variant = relationship("ProductVariant")
    warehouse = relationship("Warehouse")
    sub_location = relationship("SubLocation")
    batch = relationship("StockBatch")

class StockTransfer(Base):
    __tablename__ = "centrus_core_stock_transfers"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("centrus_core_companies.id"), nullable=False)
    transfer_number = Column(String, unique=True, index=True, nullable=False)
    transfer_date = Column(Date, nullable=False)
    from_warehouse_id = Column(Integer, ForeignKey("centrus_core_warehouses.id"), nullable=False)
    to_warehouse_id = Column(Integer, ForeignKey("centrus_core_warehouses.id"), nullable=False)
    from_sub_location_id = Column(Integer, ForeignKey("centrus_core_sub_locations.id"), nullable=True)
    to_sub_location_id = Column(Integer, ForeignKey("centrus_core_sub_locations.id"), nullable=True)
    status = Column(Enum(TransferStatus), default=TransferStatus.DRAFT)
    created_by = Column(Integer, ForeignKey("centrus_admin_users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    company = relationship("Company")
    from_warehouse = relationship("Warehouse", foreign_keys=[from_warehouse_id])
    to_warehouse = relationship("Warehouse", foreign_keys=[to_warehouse_id])
    from_sub_location = relationship("SubLocation", foreign_keys=[from_sub_location_id])
    to_sub_location = relationship("SubLocation", foreign_keys=[to_sub_location_id])

class StockTransferLine(Base):
    __tablename__ = "centrus_core_stock_transfer_lines"

    id = Column(Integer, primary_key=True, index=True)
    transfer_id = Column(Integer, ForeignKey("centrus_core_stock_transfers.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("centrus_core_products.id"), nullable=False)
    variant_id = Column(Integer, ForeignKey("centrus_core_product_variants.id"), nullable=True)
    batch_id = Column(Integer, ForeignKey("centrus_core_stock_batches.id"), nullable=True)
    quantity_shipped = Column(Float, default=0.0)
    quantity_received = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    transfer = relationship("StockTransfer", backref="lines")
    product = relationship("Product")
    variant = relationship("ProductVariant")
    batch = relationship("StockBatch")

class StockAdjustment(Base):
    __tablename__ = "centrus_core_stock_adjustments"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("centrus_core_companies.id"), nullable=False)
    adjustment_number = Column(String, unique=True, index=True, nullable=False)
    adjustment_date = Column(Date, nullable=False)
    warehouse_id = Column(Integer, ForeignKey("centrus_core_warehouses.id"), nullable=False)
    sub_location_id = Column(Integer, ForeignKey("centrus_core_sub_locations.id"), nullable=True)
    adjustment_type = Column(Enum(AdjustmentType), nullable=False)
    status = Column(Enum(DocumentStatus), default=DocumentStatus.DRAFT)
    journal_entry_id = Column(Integer, ForeignKey("centrus_core_journal_entries.id"), nullable=True)
    created_by = Column(Integer, ForeignKey("centrus_admin_users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    company = relationship("Company")
    warehouse = relationship("Warehouse")
    sub_location = relationship("SubLocation")
    journal_entry = relationship("JournalEntry")

class StockAdjustmentLine(Base):
    __tablename__ = "centrus_core_stock_adjustment_lines"

    id = Column(Integer, primary_key=True, index=True)
    adjustment_id = Column(Integer, ForeignKey("centrus_core_stock_adjustments.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("centrus_core_products.id"), nullable=False)
    variant_id = Column(Integer, ForeignKey("centrus_core_product_variants.id"), nullable=True)
    batch_id = Column(Integer, ForeignKey("centrus_core_stock_batches.id"), nullable=True)
    system_quantity = Column(Float, default=0.0)
    actual_quantity = Column(Float, default=0.0)
    adjusted_quantity = Column(Float, default=0.0)
    unit_cost = Column(Float, default=0.0)
    reason = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    adjustment = relationship("StockAdjustment", backref="lines")
    product = relationship("Product")
    variant = relationship("ProductVariant")
    batch = relationship("StockBatch")

class ConsumablesIssue(Base):
    __tablename__ = "centrus_core_consumables_issue"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("centrus_core_companies.id"), nullable=False)
    issue_number = Column(String, unique=True, index=True, nullable=False)
    issue_date = Column(Date, nullable=False)
    warehouse_id = Column(Integer, ForeignKey("centrus_core_warehouses.id"), nullable=False)
    sub_location_id = Column(Integer, ForeignKey("centrus_core_sub_locations.id"), nullable=True)
    department_id = Column(Integer, nullable=True)
    status = Column(Enum(DocumentStatus), default=DocumentStatus.DRAFT)
    journal_entry_id = Column(Integer, ForeignKey("centrus_core_journal_entries.id"), nullable=True)
    created_by = Column(Integer, ForeignKey("centrus_admin_users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    company = relationship("Company")
    warehouse = relationship("Warehouse")
    sub_location = relationship("SubLocation")
    journal_entry = relationship("JournalEntry")

class ConsumablesIssueLine(Base):
    __tablename__ = "centrus_core_consumables_issue_lines"

    id = Column(Integer, primary_key=True, index=True)
    issue_id = Column(Integer, ForeignKey("centrus_core_consumables_issue.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("centrus_core_products.id"), nullable=False)
    variant_id = Column(Integer, ForeignKey("centrus_core_product_variants.id"), nullable=True)
    quantity = Column(Float, nullable=False)
    unit_cost = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    issue = relationship("ConsumablesIssue", backref="lines")
    product = relationship("Product")
    variant = relationship("ProductVariant")

class PurchaseOrderStatus(enum.Enum):
    DRAFT = "DRAFT"
    PENDING_APPROVAL = "PENDING_APPROVAL"
    APPROVED = "APPROVED"
    PARTIAL_RECEIVED = "PARTIAL_RECEIVED"
    FULLY_RECEIVED = "FULLY_RECEIVED"
    CANCELLED = "CANCELLED"

class Supplier(Base):
    __tablename__ = "centrus_core_suppliers"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("centrus_core_companies.id"), nullable=False)
    supplier_code = Column(String, unique=True, index=True, nullable=False)
    supplier_name_en = Column(String, nullable=False)
    supplier_name_ar = Column(String)
    vat_number = Column(String)
    commercial_registration_number = Column(String)
    contact_person = Column(String)
    phone_number = Column(String)
    email = Column(String)
    building_no = Column(String)
    street_name = Column(String)
    district = Column(String)
    city = Column(String)
    country = Column(String)
    gl_account_id = Column(Integer, ForeignKey("centrus_core_chart_of_accounts.id"), nullable=True)
    payment_terms = Column(String)
    current_balance = Column(Float, default=0.0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    company = relationship("Company")
    gl_account = relationship("ChartOfAccount")

class ItemVendor(Base):
    __tablename__ = "centrus_core_item_vendors"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("centrus_core_products.id"), nullable=False)
    variant_id = Column(Integer, ForeignKey("centrus_core_product_variants.id"), nullable=True)
    supplier_id = Column(Integer, ForeignKey("centrus_core_suppliers.id"), nullable=False)
    vendor_sku = Column(String)
    vendor_price = Column(Float, nullable=False)
    lead_time_days = Column(Integer)
    minimum_order_qty = Column(Float, default=1.0)
    is_preferred_vendor = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    product = relationship("Product", backref="vendor_mappings")
    variant = relationship("ProductVariant")
    supplier = relationship("Supplier", backref="item_mappings")

class PurchaseOrder(Base):
    __tablename__ = "centrus_core_purchase_orders"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("centrus_core_companies.id"), nullable=False)
    branch_id = Column(Integer, ForeignKey("centrus_core_branches.id"), nullable=False)
    supplier_id = Column(Integer, ForeignKey("centrus_core_suppliers.id"), nullable=False)
    po_number = Column(String, unique=True, index=True, nullable=False)
    po_date = Column(Date, nullable=False)
    expected_delivery_date = Column(Date)
    status = Column(Enum(PurchaseOrderStatus), default=PurchaseOrderStatus.DRAFT)
    total_amount_excl_tax = Column(Float, default=0.0)
    total_tax_amount = Column(Float, default=0.0)
    total_amount_incl_tax = Column(Float, default=0.0)
    notes = Column(String)
    created_by = Column(Integer, ForeignKey("centrus_admin_users.id"), nullable=True)
    approved_by = Column(Integer, ForeignKey("centrus_admin_users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    company = relationship("Company")
    branch = relationship("Branch")
    supplier = relationship("Supplier", backref="purchase_orders")
    creator = relationship("AdminUser", foreign_keys=[created_by])
    approver = relationship("AdminUser", foreign_keys=[approved_by])

class PurchaseInvoiceStatus(enum.Enum):
    DRAFT = "DRAFT"
    POSTED = "POSTED"
    PARTIAL_PAID = "PARTIAL_PAID"
    PAID = "PAID"
    CANCELLED = "CANCELLED"

class PurchaseOrderLine(Base):
    __tablename__ = "centrus_core_purchase_order_lines"

    id = Column(Integer, primary_key=True, index=True)
    po_id = Column(Integer, ForeignKey("centrus_core_purchase_orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("centrus_core_products.id"), nullable=False)
    variant_id = Column(Integer, ForeignKey("centrus_core_product_variants.id"), nullable=True)
    ordered_qty = Column(Float, nullable=False)
    received_qty = Column(Float, default=0.0)
    unit_price = Column(Float, nullable=False)
    tax_rate_id = Column(Integer, ForeignKey("centrus_core_tax_rates.id"), nullable=True)
    tax_amount = Column(Float, default=0.0)
    line_total = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    po = relationship("PurchaseOrder", backref="lines")
    product = relationship("Product")
    variant = relationship("ProductVariant")
    tax_rate = relationship("TaxRate")

class GoodsReceipt(Base):
    __tablename__ = "centrus_core_goods_receipts"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("centrus_core_companies.id"), nullable=False)
    branch_id = Column(Integer, ForeignKey("centrus_core_branches.id"), nullable=False)
    supplier_id = Column(Integer, ForeignKey("centrus_core_suppliers.id"), nullable=False)
    po_id = Column(Integer, ForeignKey("centrus_core_purchase_orders.id"), nullable=True)
    grn_number = Column(String, unique=True, index=True, nullable=False)
    grn_date = Column(Date, nullable=False)
    supplier_delivery_note = Column(String)
    warehouse_id = Column(Integer, ForeignKey("centrus_core_warehouses.id"), nullable=False)
    sub_location_id = Column(Integer, ForeignKey("centrus_core_sub_locations.id"), nullable=True)
    status = Column(Enum(DocumentStatus), default=DocumentStatus.DRAFT)
    created_by = Column(Integer, ForeignKey("centrus_admin_users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    company = relationship("Company")
    branch = relationship("Branch")
    supplier = relationship("Supplier")
    po = relationship("PurchaseOrder")
    warehouse = relationship("Warehouse")
    sub_location = relationship("SubLocation")

class GoodsReceiptLine(Base):
    __tablename__ = "centrus_core_goods_receipt_lines"

    id = Column(Integer, primary_key=True, index=True)
    grn_id = Column(Integer, ForeignKey("centrus_core_goods_receipts.id"), nullable=False)
    po_line_id = Column(Integer, ForeignKey("centrus_core_purchase_order_lines.id"), nullable=True)
    product_id = Column(Integer, ForeignKey("centrus_core_products.id"), nullable=False)
    variant_id = Column(Integer, ForeignKey("centrus_core_product_variants.id"), nullable=True)
    batch_id = Column(Integer, ForeignKey("centrus_core_stock_batches.id"), nullable=True)
    received_qty = Column(Float, nullable=False)
    rejected_qty = Column(Float, default=0.0)
    unit_cost = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    grn = relationship("GoodsReceipt", backref="lines")
    po_line = relationship("PurchaseOrderLine")
    product = relationship("Product")
    variant = relationship("ProductVariant")
    batch = relationship("StockBatch")

class PurchaseInvoice(Base):
    __tablename__ = "centrus_core_purchase_invoices"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("centrus_core_companies.id"), nullable=False)
    branch_id = Column(Integer, ForeignKey("centrus_core_branches.id"), nullable=False)
    supplier_id = Column(Integer, ForeignKey("centrus_core_suppliers.id"), nullable=False)
    po_id = Column(Integer, ForeignKey("centrus_core_purchase_orders.id"), nullable=True)
    grn_id = Column(Integer, ForeignKey("centrus_core_goods_receipts.id"), nullable=True)
    invoice_number = Column(String, unique=True, index=True, nullable=False)
    supplier_invoice_number = Column(String)
    invoice_date = Column(Date, nullable=False)
    due_date = Column(Date)
    status = Column(Enum(PurchaseInvoiceStatus), default=PurchaseInvoiceStatus.DRAFT)
    total_amount_excl_tax = Column(Float, default=0.0)
    total_tax_amount = Column(Float, default=0.0)
    total_amount_incl_tax = Column(Float, default=0.0)
    amount_paid = Column(Float, default=0.0)
    journal_entry_id = Column(Integer, ForeignKey("centrus_core_journal_entries.id"), nullable=True)
    created_by = Column(Integer, ForeignKey("centrus_admin_users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    company = relationship("Company")
    branch = relationship("Branch")
    supplier = relationship("Supplier")
    po = relationship("PurchaseOrder")
    grn = relationship("GoodsReceipt")
    journal_entry = relationship("JournalEntry")

class PurchaseInvoiceLine(Base):
    __tablename__ = "centrus_core_purchase_invoice_lines"

    id = Column(Integer, primary_key=True, index=True)
    purchase_invoice_id = Column(Integer, ForeignKey("centrus_core_purchase_invoices.id"), nullable=False)
    grn_line_id = Column(Integer, ForeignKey("centrus_core_goods_receipt_lines.id"), nullable=True)
    product_id = Column(Integer, ForeignKey("centrus_core_products.id"), nullable=False)
    variant_id = Column(Integer, ForeignKey("centrus_core_product_variants.id"), nullable=True)
    billed_qty = Column(Float, nullable=False)
    unit_price = Column(Float, nullable=False)
    tax_rate_id = Column(Integer, ForeignKey("centrus_core_tax_rates.id"), nullable=True)
    tax_amount = Column(Float, default=0.0)
    line_total = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    purchase_invoice = relationship("PurchaseInvoice", backref="lines")
    grn_line = relationship("GoodsReceiptLine")
    product = relationship("Product")
    variant = relationship("ProductVariant")
    tax_rate = relationship("TaxRate")

class PurchaseReturn(Base):
    __tablename__ = "centrus_core_purchase_returns"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("centrus_core_companies.id"), nullable=False)
    branch_id = Column(Integer, ForeignKey("centrus_core_branches.id"), nullable=False)
    supplier_id = Column(Integer, ForeignKey("centrus_core_suppliers.id"), nullable=False)
    purchase_invoice_id = Column(Integer, ForeignKey("centrus_core_purchase_invoices.id"), nullable=True)
    return_number = Column(String, unique=True, index=True, nullable=False)
    return_date = Column(Date, nullable=False)
    status = Column(Enum(DocumentStatus), default=DocumentStatus.DRAFT)
    total_amount = Column(Float, default=0.0)
    journal_entry_id = Column(Integer, ForeignKey("centrus_core_journal_entries.id"), nullable=True)
    created_by = Column(Integer, ForeignKey("centrus_admin_users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    company = relationship("Company")
    branch = relationship("Branch")
    supplier = relationship("Supplier")
    purchase_invoice = relationship("PurchaseInvoice")
    journal_entry = relationship("JournalEntry")

class PurchaseReturnLine(Base):
    __tablename__ = "centrus_core_purchase_return_lines"

    id = Column(Integer, primary_key=True, index=True)
    return_id = Column(Integer, ForeignKey("centrus_core_purchase_returns.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("centrus_core_products.id"), nullable=False)
    variant_id = Column(Integer, ForeignKey("centrus_core_product_variants.id"), nullable=True)
    batch_id = Column(Integer, ForeignKey("centrus_core_stock_batches.id"), nullable=True)
    returned_qty = Column(Float, nullable=False)
    unit_price = Column(Float, nullable=False)
    tax_amount = Column(Float, default=0.0)
    line_total = Column(Float, nullable=False)
    reason = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    purchase_return = relationship("PurchaseReturn", backref="lines")
    product = relationship("Product")
    variant = relationship("ProductVariant")
    batch = relationship("StockBatch")

class VendorPayment(Base):
    __tablename__ = "centrus_core_vendor_payments"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("centrus_core_companies.id"), nullable=False)
    supplier_id = Column(Integer, ForeignKey("centrus_core_suppliers.id"), nullable=False)
    payment_number = Column(String, unique=True, index=True, nullable=False)
    payment_date = Column(Date, nullable=False)
    payment_mode_id = Column(Integer, ForeignKey("centrus_core_payment_modes.id"), nullable=False)
    amount = Column(Float, nullable=False)
    purchase_invoice_id = Column(Integer, ForeignKey("centrus_core_purchase_invoices.id"), nullable=True)
    voucher_id = Column(Integer, ForeignKey("centrus_core_vouchers.id"), nullable=True)
    status = Column(Enum(DocumentStatus), default=DocumentStatus.DRAFT)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    company = relationship("Company")
    supplier = relationship("Supplier")
    payment_mode = relationship("PaymentMode")
    purchase_invoice = relationship("PurchaseInvoice")
    voucher = relationship("Voucher")

class CustomerType(enum.Enum):
    INDIVIDUAL = "INDIVIDUAL"
    COMPANY = "COMPANY"

class SessionStatus(enum.Enum):
    OPEN = "OPEN"
    CLOSED = "CLOSED"

class SalesOrderStatus(enum.Enum):
    DRAFT = "DRAFT"
    CONFIRMED = "CONFIRMED"
    PARTIAL_INVOICED = "PARTIAL_INVOICED"
    FULLY_INVOICED = "FULLY_INVOICED"
    CANCELLED = "CANCELLED"

class Customer(Base):
    __tablename__ = "centrus_core_customers"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("centrus_core_companies.id"), nullable=False)
    customer_code = Column(String, unique=True, index=True, nullable=False)
    customer_name_en = Column(String, nullable=False)
    customer_name_ar = Column(String)
    customer_type = Column(Enum(CustomerType), nullable=False)
    vat_number = Column(String)
    commercial_registration_number = Column(String)
    phone_number = Column(String)
    email = Column(String)
    building_no = Column(String)
    street_name = Column(String)
    district = Column(String)
    city = Column(String)
    country = Column(String)
    postal_code = Column(String)
    gl_account_id = Column(Integer, ForeignKey("centrus_core_chart_of_accounts.id"), nullable=True)
    credit_limit = Column(Float, default=0.0)
    current_balance = Column(Float, default=0.0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    company = relationship("Company")
    gl_account = relationship("ChartOfAccount")

class POSSession(Base):
    __tablename__ = "centrus_core_pos_sessions"

    id = Column(Integer, primary_key=True, index=True)
    branch_id = Column(Integer, ForeignKey("centrus_core_branches.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("centrus_admin_users.id"), nullable=False)
    hardware_device_id = Column(Integer, ForeignKey("centrus_core_hardware_devices.id"), nullable=False)
    session_status = Column(Enum(SessionStatus), default=SessionStatus.OPEN)
    opened_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    closed_at = Column(DateTime, nullable=True)
    opening_cash = Column(Float, default=0.0)
    expected_cash_closing = Column(Float, default=0.0)
    actual_cash_closing = Column(Float, default=0.0)
    cash_difference = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    branch = relationship("Branch")
    user = relationship("AdminUser")
    hardware_device = relationship("HardwareDevice")

class SalesOrder(Base):
    __tablename__ = "centrus_core_sales_orders"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("centrus_core_companies.id"), nullable=False)
    branch_id = Column(Integer, ForeignKey("centrus_core_branches.id"), nullable=False)
    customer_id = Column(Integer, ForeignKey("centrus_core_customers.id"), nullable=False)
    so_number = Column(String, unique=True, index=True, nullable=False)
    so_date = Column(Date, nullable=False)
    expected_dispatch_date = Column(Date)
    status = Column(Enum(SalesOrderStatus), default=SalesOrderStatus.DRAFT)
    total_amount_excl_tax = Column(Float, default=0.0)
    total_tax_amount = Column(Float, default=0.0)
    total_amount_incl_tax = Column(Float, default=0.0)
    notes = Column(String)
    created_by = Column(Integer, ForeignKey("centrus_admin_users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    company = relationship("Company")
    branch = relationship("Branch")
    customer = relationship("Customer")
    creator = relationship("AdminUser")

class SalesInvoiceType(enum.Enum):
    B2B_TAX_INVOICE = "B2B_TAX_INVOICE"
    B2C_SIMPLIFIED = "B2C_SIMPLIFIED"

class SalesInvoiceStatus(enum.Enum):
    DRAFT = "DRAFT"
    POSTED = "POSTED"
    PAID = "PAID"
    PARTIAL_PAID = "PARTIAL_PAID"
    CANCELLED = "CANCELLED"

class SalesOrderLine(Base):
    __tablename__ = "centrus_core_sales_order_lines"

    id = Column(Integer, primary_key=True, index=True)
    so_id = Column(Integer, ForeignKey("centrus_core_sales_orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("centrus_core_products.id"), nullable=False)
    variant_id = Column(Integer, ForeignKey("centrus_core_product_variants.id"), nullable=True)
    ordered_qty = Column(Float, nullable=False)
    invoiced_qty = Column(Float, default=0.0)
    unit_price = Column(Float, nullable=False)
    discount_amount = Column(Float, default=0.0)
    tax_rate_id = Column(Integer, ForeignKey("centrus_core_tax_rates.id"), nullable=True)
    tax_amount = Column(Float, default=0.0)
    line_total = Column(Float, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    so = relationship("SalesOrder", backref="lines")
    product = relationship("Product")
    variant = relationship("ProductVariant")
    tax_rate = relationship("TaxRate")

class SalesInvoice(Base):
    __tablename__ = "centrus_core_sales_invoices"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("centrus_core_companies.id"), nullable=False)
    branch_id = Column(Integer, ForeignKey("centrus_core_branches.id"), nullable=False)
    customer_id = Column(Integer, ForeignKey("centrus_core_customers.id"), nullable=True)
    pos_session_id = Column(Integer, ForeignKey("centrus_core_pos_sessions.id"), nullable=True)
    so_id = Column(Integer, ForeignKey("centrus_core_sales_orders.id"), nullable=True)
    invoice_number = Column(String, unique=True, index=True, nullable=False)
    invoice_type = Column(Enum(SalesInvoiceType), nullable=False)
    invoice_date = Column(DateTime, nullable=False)
    status = Column(Enum(SalesInvoiceStatus), default=SalesInvoiceStatus.DRAFT)
    total_amount_excl_tax = Column(Float, default=0.0)
    total_discount_amount = Column(Float, default=0.0)
    total_tax_amount = Column(Float, default=0.0)
    total_amount_incl_tax = Column(Float, default=0.0)
    zatca_invoice_hash = Column(String)
    zatca_previous_invoice_hash = Column(String)
    zatca_qr_code_tlv = Column(Text)
    zatca_uuid = Column(String)
    journal_entry_id = Column(Integer, ForeignKey("centrus_core_journal_entries.id"), nullable=True)
    created_by = Column(Integer, ForeignKey("centrus_admin_users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    company = relationship("Company")
    branch = relationship("Branch")
    customer = relationship("Customer")
    pos_session = relationship("POSSession")
    so = relationship("SalesOrder")
    journal_entry = relationship("JournalEntry")
    creator = relationship("AdminUser")

class SalesInvoiceLine(Base):
    __tablename__ = "centrus_core_sales_invoice_lines"

    id = Column(Integer, primary_key=True, index=True)
    sales_invoice_id = Column(Integer, ForeignKey("centrus_core_sales_invoices.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("centrus_core_products.id"), nullable=False)
    variant_id = Column(Integer, ForeignKey("centrus_core_product_variants.id"), nullable=True)
    batch_id = Column(Integer, ForeignKey("centrus_core_stock_batches.id"), nullable=True)
    warehouse_id = Column(Integer, ForeignKey("centrus_core_warehouses.id"), nullable=True)
    sub_location_id = Column(Integer, ForeignKey("centrus_core_sub_locations.id"), nullable=True)
    quantity = Column(Float, nullable=False)
    unit_price = Column(Float, nullable=False)
    discount_amount = Column(Float, default=0.0)
    tax_rate_id = Column(Integer, ForeignKey("centrus_core_tax_rates.id"), nullable=True)
    tax_amount = Column(Float, default=0.0)
    line_total = Column(Float, nullable=False)
    cost_of_goods_sold = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    sales_invoice = relationship("SalesInvoice", backref="lines")
    product = relationship("Product")
    variant = relationship("ProductVariant")
    batch = relationship("StockBatch")
    warehouse = relationship("Warehouse")
    sub_location = relationship("SubLocation")
    tax_rate = relationship("TaxRate")

class SalesPayment(Base):
    __tablename__ = "centrus_core_sales_payments"

    id = Column(Integer, primary_key=True, index=True)
    sales_invoice_id = Column(Integer, ForeignKey("centrus_core_sales_invoices.id"), nullable=False)
    payment_mode_id = Column(Integer, ForeignKey("centrus_core_payment_modes.id"), nullable=False)
    amount = Column(Float, nullable=False)
    reference_number = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    sales_invoice = relationship("SalesInvoice", backref="payments")
    payment_mode = relationship("PaymentMode")

class SalesReturn(Base):
    __tablename__ = "centrus_core_sales_returns"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("centrus_core_companies.id"), nullable=False)
    branch_id = Column(Integer, ForeignKey("centrus_core_branches.id"), nullable=False)
    customer_id = Column(Integer, ForeignKey("centrus_core_customers.id"), nullable=False)
    sales_invoice_id = Column(Integer, ForeignKey("centrus_core_sales_invoices.id"), nullable=False)
    return_number = Column(String, unique=True, index=True, nullable=False)
    return_date = Column(DateTime, nullable=False)
    total_amount_incl_tax = Column(Float, nullable=False)
    zatca_invoice_hash = Column(String)
    zatca_qr_code_tlv = Column(Text)
    journal_entry_id = Column(Integer, ForeignKey("centrus_core_journal_entries.id"), nullable=True)
    created_by = Column(Integer, ForeignKey("centrus_admin_users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    company = relationship("Company")
    branch = relationship("Branch")
    customer = relationship("Customer")
    sales_invoice = relationship("SalesInvoice")
    journal_entry = relationship("JournalEntry")
    creator = relationship("AdminUser")

class SalesReturnLine(Base):
    __tablename__ = "centrus_core_sales_return_lines"

    id = Column(Integer, primary_key=True, index=True)
    sales_return_id = Column(Integer, ForeignKey("centrus_core_sales_returns.id"), nullable=False)
    invoice_line_id = Column(Integer, ForeignKey("centrus_core_sales_invoice_lines.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("centrus_core_products.id"), nullable=False)
    returned_qty = Column(Float, nullable=False)
    unit_price = Column(Float, nullable=False)
    tax_amount = Column(Float, default=0.0)
    line_total = Column(Float, nullable=False)
    return_sub_location_id = Column(Integer, ForeignKey("centrus_core_sub_locations.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    sales_return = relationship("SalesReturn", backref="lines")
    invoice_line = relationship("SalesInvoiceLine")
    product = relationship("Product")
    return_sub_location = relationship("SubLocation")

class ProductionOrderStatus(enum.Enum):
    DRAFT = "DRAFT"
    SCHEDULED = "SCHEDULED"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    CANCELLED = "CANCELLED"

class WorkCenter(Base):
    __tablename__ = "centrus_core_work_centers"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("centrus_core_companies.id"), nullable=False)
    branch_id = Column(Integer, ForeignKey("centrus_core_branches.id"), nullable=False)
    center_code = Column(String, unique=True, index=True, nullable=False)
    center_name_en = Column(String, nullable=False)
    center_name_ar = Column(String)
    cost_per_hour = Column(Float, default=0.0)
    capacity_per_day = Column(Float, default=0.0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    company = relationship("Company")
    branch = relationship("Branch")

class BillOfMaterial(Base):
    __tablename__ = "centrus_core_bill_of_materials"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("centrus_core_companies.id"), nullable=False)
    finished_product_id = Column(Integer, ForeignKey("centrus_core_products.id"), nullable=False)
    variant_id = Column(Integer, ForeignKey("centrus_core_product_variants.id"), nullable=True)
    bom_number = Column(String, unique=True, index=True, nullable=False)
    routing_instructions = Column(Text)
    production_qty = Column(Float, nullable=False)
    total_material_cost_estimate = Column(Float, default=0.0)
    total_operation_cost_estimate = Column(Float, default=0.0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    company = relationship("Company")
    finished_product = relationship("Product")
    variant = relationship("ProductVariant")

class BOMLine(Base):
    __tablename__ = "centrus_core_bom_lines"

    id = Column(Integer, primary_key=True, index=True)
    bom_id = Column(Integer, ForeignKey("centrus_core_bill_of_materials.id"), nullable=False)
    raw_material_product_id = Column(Integer, ForeignKey("centrus_core_products.id"), nullable=False)
    variant_id = Column(Integer, ForeignKey("centrus_core_product_variants.id"), nullable=True)
    quantity_required = Column(Float, nullable=False)
    scrap_percentage = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    bom = relationship("BillOfMaterial", backref="lines")
    raw_material_product = relationship("Product")
    variant = relationship("ProductVariant")

class ProductionOrder(Base):
    __tablename__ = "centrus_core_production_orders"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("centrus_core_companies.id"), nullable=False)
    branch_id = Column(Integer, ForeignKey("centrus_core_branches.id"), nullable=False)
    bom_id = Column(Integer, ForeignKey("centrus_core_bill_of_materials.id"), nullable=False)
    work_center_id = Column(Integer, ForeignKey("centrus_core_work_centers.id"), nullable=False)
    order_number = Column(String, unique=True, index=True, nullable=False)
    planned_start_date = Column(Date)
    planned_end_date = Column(Date)
    actual_start_date = Column(DateTime)
    actual_end_date = Column(DateTime)
    target_qty = Column(Float, nullable=False)
    actual_qty_produced = Column(Float, default=0.0)
    status = Column(Enum(ProductionOrderStatus), default=ProductionOrderStatus.DRAFT)
    total_actual_cost = Column(Float, default=0.0)
    journal_entry_id = Column(Integer, ForeignKey("centrus_core_journal_entries.id"), nullable=True)
    created_by = Column(Integer, ForeignKey("centrus_admin_users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    company = relationship("Company")
    branch = relationship("Branch")
    bom = relationship("BillOfMaterial")
    work_center = relationship("WorkCenter")
    journal_entry = relationship("JournalEntry")
    creator = relationship("AdminUser")

class ProductionOrderMaterial(Base):
    __tablename__ = "centrus_core_production_order_materials"

    id = Column(Integer, primary_key=True, index=True)
    production_order_id = Column(Integer, ForeignKey("centrus_core_production_orders.id"), nullable=False)
    raw_material_product_id = Column(Integer, ForeignKey("centrus_core_products.id"), nullable=False)
    variant_id = Column(Integer, ForeignKey("centrus_core_product_variants.id"), nullable=True)
    batch_id = Column(Integer, ForeignKey("centrus_core_stock_batches.id"), nullable=True)
    planned_qty = Column(Float, nullable=False)
    actual_qty_consumed = Column(Float, default=0.0)
    unit_cost = Column(Float, default=0.0)
    line_total_cost = Column(Float, default=0.0)
    warehouse_id = Column(Integer, ForeignKey("centrus_core_warehouses.id"), nullable=True)
    sub_location_id = Column(Integer, ForeignKey("centrus_core_sub_locations.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    production_order = relationship("ProductionOrder", backref="materials")
    raw_material_product = relationship("Product")
    variant = relationship("ProductVariant")
    batch = relationship("StockBatch")
    warehouse = relationship("Warehouse")
    sub_location = relationship("SubLocation")

class ProductionOrderOutput(Base):
    __tablename__ = "centrus_core_production_order_output"

    id = Column(Integer, primary_key=True, index=True)
    production_order_id = Column(Integer, ForeignKey("centrus_core_production_orders.id"), nullable=False)
    finished_product_id = Column(Integer, ForeignKey("centrus_core_products.id"), nullable=False)
    variant_id = Column(Integer, ForeignKey("centrus_core_product_variants.id"), nullable=True)
    generated_batch_id = Column(Integer, ForeignKey("centrus_core_stock_batches.id"), nullable=True)
    qty_produced = Column(Float, nullable=False)
    qty_scrapped = Column(Float, default=0.0)
    unit_cost = Column(Float, nullable=False)
    warehouse_id = Column(Integer, ForeignKey("centrus_core_warehouses.id"), nullable=False)
    sub_location_id = Column(Integer, ForeignKey("centrus_core_sub_locations.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    production_order = relationship("ProductionOrder", backref="outputs")
    finished_product = relationship("Product")
    variant = relationship("ProductVariant")
    generated_batch = relationship("StockBatch")
    warehouse = relationship("Warehouse")
    sub_location = relationship("SubLocation")

class Gender(enum.Enum):
    MALE = "MALE"
    FEMALE = "FEMALE"

class DocumentType(enum.Enum):
    IQAMA = "IQAMA"
    PASSPORT = "PASSPORT"
    HEALTH_CERTIFICATE = "HEALTH_CERTIFICATE"
    DRIVING_LICENSE = "DRIVING_LICENSE"
    CONTRACT = "CONTRACT"

class AttendanceStatus(enum.Enum):
    PRESENT = "PRESENT"
    ABSENT = "ABSENT"
    HALF_DAY = "HALF_DAY"
    LATE = "LATE"

class Employee(Base):
    __tablename__ = "centrus_core_employees"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("centrus_core_companies.id"), nullable=False)
    branch_id = Column(Integer, ForeignKey("centrus_core_branches.id"), nullable=True)
    employee_code = Column(String, unique=True, index=True, nullable=False)
    first_name_en = Column(String, nullable=False)
    last_name_en = Column(String, nullable=False)
    first_name_ar = Column(String)
    last_name_ar = Column(String)
    gender = Column(Enum(Gender), nullable=False)
    date_of_birth = Column(Date)
    nationality = Column(String)
    national_id_or_iqama_number = Column(String)
    department = Column(String)
    designation = Column(String)
    joining_date = Column(Date)
    basic_salary = Column(Float, default=0.0)
    housing_allowance = Column(Float, default=0.0)
    transport_allowance = Column(Float, default=0.0)
    other_allowances = Column(Float, default=0.0)
    gosi_registered = Column(Boolean, default=False)
    gosi_number = Column(String)
    iban_number = Column(String)
    bank_code = Column(String)
    is_active = Column(Boolean, default=True)
    admin_user_id = Column(Integer, ForeignKey("centrus_admin_users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    company = relationship("Company")
    branch = relationship("Branch")
    admin_user = relationship("AdminUser", foreign_keys=[admin_user_id])

class EmployeeDocument(Base):
    __tablename__ = "centrus_core_employee_documents"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("centrus_core_employees.id"), nullable=False)
    document_type = Column(Enum(DocumentType), nullable=False)
    document_number = Column(String)
    issue_date = Column(Date)
    expiry_date = Column(Date)
    attachment_url = Column(String)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    employee = relationship("Employee", backref="documents")

class Attendance(Base):
    __tablename__ = "centrus_core_attendance"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("centrus_core_employees.id"), nullable=False)
    date = Column(Date, nullable=False)
    clock_in_time = Column(DateTime)
    clock_out_time = Column(DateTime)
    status = Column(Enum(AttendanceStatus), nullable=False)
    total_hours_worked = Column(Float, default=0.0)
    overtime_hours = Column(Float, default=0.0)
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    employee = relationship("Employee", backref="attendance_records")

class LeaveType(enum.Enum):
    ANNUAL = "ANNUAL"
    SICK = "SICK"
    UNPAID = "UNPAID"
    MATERNITY = "MATERNITY"
    EMERGENCY = "EMERGENCY"

class LeaveStatus(enum.Enum):
    PENDING = "PENDING"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"

class PayrollRunStatus(enum.Enum):
    DRAFT = "DRAFT"
    POSTED = "POSTED"
    PAID = "PAID"
    CANCELLED = "CANCELLED"

class PaymentStatus(enum.Enum):
    UNPAID = "UNPAID"
    PAID = "PAID"

class LeaveRequest(Base):
    __tablename__ = "centrus_core_leave_requests"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("centrus_core_employees.id"), nullable=False)
    leave_type = Column(Enum(LeaveType), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    total_days = Column(Float, nullable=False)
    reason = Column(Text)
    status = Column(Enum(LeaveStatus), default=LeaveStatus.PENDING)
    approved_by = Column(Integer, ForeignKey("centrus_admin_users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    employee = relationship("Employee", backref="leave_requests")
    approver = relationship("AdminUser")

class PayrollRun(Base):
    __tablename__ = "centrus_core_payroll_runs"

    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("centrus_core_companies.id"), nullable=False)
    month = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)
    run_date = Column(Date, nullable=False)
    status = Column(Enum(PayrollRunStatus), default=PayrollRunStatus.DRAFT)
    total_gross_pay = Column(Float, default=0.0)
    total_deductions = Column(Float, default=0.0)
    total_net_pay = Column(Float, default=0.0)
    journal_entry_id = Column(Integer, ForeignKey("centrus_core_journal_entries.id"), nullable=True)
    created_by = Column(Integer, ForeignKey("centrus_admin_users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    company = relationship("Company")
    journal_entry = relationship("JournalEntry")
    creator = relationship("AdminUser")

class PayrollSlip(Base):
    __tablename__ = "centrus_core_payroll_slips"

    id = Column(Integer, primary_key=True, index=True)
    payroll_run_id = Column(Integer, ForeignKey("centrus_core_payroll_runs.id"), nullable=False)
    employee_id = Column(Integer, ForeignKey("centrus_core_employees.id"), nullable=False)
    basic_pay_amount = Column(Float, default=0.0)
    allowances_amount = Column(Float, default=0.0)
    overtime_amount = Column(Float, default=0.0)
    gross_pay = Column(Float, default=0.0)
    gosi_deduction_employee = Column(Float, default=0.0)
    gosi_deduction_employer = Column(Float, default=0.0)
    absent_deductions = Column(Float, default=0.0)
    loan_deductions = Column(Float, default=0.0)
    net_pay = Column(Float, default=0.0)
    payment_status = Column(Enum(PaymentStatus), default=PaymentStatus.UNPAID)
    created_at = Column(DateTime, default=datetime.utcnow)

    payroll_run = relationship("PayrollRun", backref="slips")
    employee = relationship("Employee")
