// Admin Types for Madar Digital Wallet

// =============================================================================
// Enums
// =============================================================================

/**
 * Admin type - determines permissions and authority level
 */
export type AdminType =
	| "SUPER_ADMIN"
	| "SUPPORT_ADMIN"
	| "FINANCE_ADMIN"
	| "RISK_ADMIN"
	| "BUSINESS_ADMIN";

/**
 * Admin account status
 */
export type AdminStatus = "ACTIVE" | "SUSPENDED" | "DEACTIVATED";

/**
 * Transaction status for admin management
 */
export type TransactionStatus =
	| "PENDING"
	| "PROCESSING"
	| "COMPLETED"
	| "FAILED"
	| "REFUNDED";

/**
 * Transaction type for admin management
 */
export type TransactionType =
	| "DEPOSIT"
	| "WITHDRAW"
	| "TRANSFER"
	| "PURCHASE"
	| "REFUND";

/**
 * Wallet status for admin management
 */
export type WalletStatus = "ACTIVE" | "SUSPENDED" | "CLOSED";

// =============================================================================
// Interfaces
// =============================================================================

/**
 * Admin entity - linked to User
 */
export interface Admin {
	id: number;
	publicId: string;
	adminType: AdminType;
	status: AdminStatus;
	department?: string;
	permissions: string[];
	createdAt: string;
	updatedAt: string;
	lastLoginAt?: string;
	userId: number;
}

/**
 * Audit log entry for admin actions
 */
export interface AdminAuditLog {
	id: number;
	action: string;
	entityType: string;
	entityId: number;
	description?: string;
	metadata?: Record<string, unknown>;
	ipAddress?: string;
	createdAt: string;
	adminId: number;
	admin?: {
		id: number;
		publicId: string;
		adminType: AdminType;
		user: {
			phoneNumber: string;
		};
	};
}

/**
 * Dashboard statistics
 */
export interface DashboardStats {
	totalUsers: number;
	activeUsers: number;
	totalTransactions: number;
	totalVolume: number;
	todayTransactions: number;
	todayVolume: number;
	pendingTransactions: number;
	failedTransactions: number;
	totalWallets: number;
	activeWallets: number;
	totalAdmins: number;
	activeAdmins: number;
}

/**
 * User for admin management
 */
export interface AdminUser {
	id: number;
	publicId: string;
	phoneNumber: string;
	userType: "CUSTOMER" | "BUSINESS";
	createdAt: string;
	updatedAt: string;
	wallets?: AdminWallet[];
	admin?: Admin;
}

/**
 * Wallet for admin management
 */
export interface AdminWallet {
	id: number;
	publicId: string;
	balance: number;
	currency: string;
	status: WalletStatus;
	isPrimary: boolean;
	createdAt: string;
	updatedAt: string;
	userId: number;
	user?: {
		id: number;
		phoneNumber: string;
		userType: string;
	};
}

/**
 * Transaction for admin management
 */
export interface AdminTransaction {
	id: number;
	publicId: string;
	status: TransactionStatus;
	transactionType: TransactionType;
	amount: number;
	description?: string;
	metadata?: Record<string, unknown>;
	createdAt: string;
	updatedAt: string;
	payerWalletId: number;
	receiverWalletId?: number;
	payerWallet?: {
		id: number;
		publicId: string;
		user: {
			phoneNumber: string;
		};
	};
	receiverWallet?: {
		id: number;
		publicId: string;
		user: {
			phoneNumber: string;
		};
	};
}

/**
 * Admin profile info returned from /auth/me
 */
export interface AdminUserInfo {
	adminId: number;
	adminPublicId: string;
	adminType: AdminType;
	permissions: string[];
	department?: string;
}

// =============================================================================
// Permission Constants
// =============================================================================

/**
 * Default permissions by admin type
 */
export const DEFAULT_ADMIN_PERMISSIONS: Record<AdminType, string[]> = {
	SUPER_ADMIN: [
		"*", // Full access
	],
	SUPPORT_ADMIN: [
		"users:read",
		"users:update",
		"transactions:read",
		"transactions:refund",
		"wallets:read",
		"wallets:adjust",
		"audit:read",
	],
	FINANCE_ADMIN: [
		"transactions:read",
		"transactions:refund",
		"transactions:reverse",
		"wallets:read",
		"wallets:adjust",
		"users:read",
		"audit:read",
	],
	RISK_ADMIN: [
		"transactions:read",
		"transactions:flag",
		"transactions:block",
		"wallets:read",
		"wallets:suspend",
		"users:read",
		"users:suspend",
		"audit:read",
	],
	BUSINESS_ADMIN: [
		"users:read",
		"users:read:business",
		"transactions:read",
		"transactions:read:business",
		"wallets:read",
		"wallets:read:business",
		"audit:read",
	],
};

/**
 * Permission labels for UI
 */
export const PERMISSION_LABELS: Record<string, string> = {
	"*": "دسترسی کامل",
	"users:read": "مشاهده کاربران",
	"users:create": "ایجاد کاربر",
	"users:update": "ویرایش کاربر",
	"users:delete": "حذف کاربر",
	"users:suspend": "تعلیق کاربر",
	"users:read:business": "مشاهده کسب‌وکارها",
	"transactions:read": "مشاهده تراکنش‌ها",
	"transactions:create": "ایجاد تراکنش",
	"transactions:refund": "استرداد تراکنش",
	"transactions:reverse": "برگشت تراکنش",
	"transactions:flag": "علامت‌گذاری تراکنش",
	"transactions:block": "مسدودسازی تراکنش",
	"transactions:read:business": "مشاهده تراکنش‌های کسب‌وکار",
	"wallets:read": "مشاهده کیف پول‌ها",
	"wallets:create": "ایجاد کیف پول",
	"wallets:update": "ویرایش کیف پول",
	"wallets:adjust": "تعدیل موجودی",
	"wallets:suspend": "تعلیق کیف پول",
	"wallets:read:business": "مشاهده کیف پول‌های کسب‌وکار",
	"admins:read": "مشاهده مدیران",
	"admins:create": "ایجاد مدیر",
	"admins:update": "ویرایش مدیر",
	"admins:delete": "حذف مدیر",
	"audit:read": "مشاهده گزارشات",
};

/**
 * Admin type labels for UI
 */
export const ADMIN_TYPE_LABELS: Record<AdminType, string> = {
	SUPER_ADMIN: "مدیر ارشد",
	SUPPORT_ADMIN: "پشتیبانی",
	FINANCE_ADMIN: "مالی",
	RISK_ADMIN: "ریسک",
	BUSINESS_ADMIN: "کسب‌وکار",
};

/**
 * Admin status labels for UI
 */
export const ADMIN_STATUS_LABELS: Record<AdminStatus, string> = {
	ACTIVE: "فعال",
	SUSPENDED: "تعلیق شده",
	DEACTIVATED: "غیرفعال",
};

/**
 * User type labels for UI
 */
export const USER_TYPE_LABELS: Record<string, string> = {
	CUSTOMER: "شخصی",
	BUSINESS: "کسب‌وکار",
};

/**
 * Transaction status labels for UI
 */
export const TRANSACTION_STATUS_LABELS: Record<TransactionStatus, string> = {
	PENDING: "در انتظار",
	PROCESSING: "در حال پردازش",
	COMPLETED: "تکمیل شده",
	FAILED: "ناموفق",
	REFUNDED: "استرداد شده",
};

/**
 * Transaction type labels for UI
 */
export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
	DEPOSIT: "واریز",
	WITHDRAW: "برداشت",
	TRANSFER: "انتقال",
	PURCHASE: "خرید",
	REFUND: "استرداد",
};
