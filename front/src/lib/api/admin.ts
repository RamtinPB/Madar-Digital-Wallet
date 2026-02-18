// Admin API Services for Madar Digital Wallet
import { getAccessToken, authenticatedFetch } from "./auth";
import type {
	Admin,
	AdminAuditLog,
	AdminTransaction,
	AdminUser,
	AdminWallet,
	DashboardStats,
	AdminType,
	AdminStatus,
	TransactionStatus,
	WalletStatus,
} from "@/types/admin";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

// =============================================================================
// Dashboard API
// =============================================================================

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
	const response = await authenticatedFetch(
		`${API_BASE}/admin/dashboard/stats`,
		{
			method: "GET",
		},
	);

	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(error.message || "Failed to fetch dashboard stats");
	}

	return response.json();
}

// =============================================================================
// Users API
// =============================================================================

/**
 * User search/filter params
 */
export interface AdminUsersParams {
	page?: number;
	limit?: number;
	search?: string;
	userType?: "CUSTOMER" | "BUSINESS";
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

/**
 * Paginated users response
 */
export interface AdminUsersResponse {
	users: AdminUser[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

/**
 * Get paginated list of users
 */
export async function getAdminUsers(
	params: AdminUsersParams = {},
): Promise<AdminUsersResponse> {
	const searchParams = new URLSearchParams();
	if (params.page) searchParams.set("page", params.page.toString());
	if (params.limit) searchParams.set("limit", params.limit.toString());
	if (params.search) searchParams.set("search", params.search);
	if (params.userType) searchParams.set("userType", params.userType);
	if (params.sortBy) searchParams.set("sortBy", params.sortBy);
	if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

	const response = await authenticatedFetch(
		`${API_BASE}/admin/users?${searchParams.toString()}`,
		{ method: "GET" },
	);

	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(error.message || "Failed to fetch users");
	}

	return response.json();
}

/**
 * Get single user by ID
 */
export async function getAdminUser(userId: number): Promise<AdminUser> {
	const response = await authenticatedFetch(
		`${API_BASE}/admin/users/${userId}`,
		{
			method: "GET",
		},
	);

	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(error.message || "Failed to fetch user");
	}

	return response.json();
}

/**
 * Update user status
 */
export async function updateUserStatus(
	userId: number,
	status: "ACTIVE" | "SUSPENDED",
): Promise<AdminUser> {
	const response = await authenticatedFetch(
		`${API_BASE}/admin/users/${userId}/status`,
		{
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ status }),
		},
	);

	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(error.message || "Failed to update user status");
	}

	return response.json();
}

// =============================================================================
// Transactions API
// =============================================================================

/**
 * Transaction search/filter params
 */
export interface AdminTransactionsParams {
	page?: number;
	limit?: number;
	search?: string;
	status?: TransactionStatus;
	transactionType?: string;
	minAmount?: number;
	maxAmount?: number;
	dateFrom?: string;
	dateTo?: string;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

/**
 * Paginated transactions response
 */
export interface AdminTransactionsResponse {
	transactions: AdminTransaction[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

/**
 * Get paginated list of transactions
 */
export async function getAdminTransactions(
	params: AdminTransactionsParams = {},
): Promise<AdminTransactionsResponse> {
	const searchParams = new URLSearchParams();
	if (params.page) searchParams.set("page", params.page.toString());
	if (params.limit) searchParams.set("limit", params.limit.toString());
	if (params.search) searchParams.set("search", params.search);
	if (params.status) searchParams.set("status", params.status);
	if (params.transactionType)
		searchParams.set("transactionType", params.transactionType);
	if (params.minAmount)
		searchParams.set("minAmount", params.minAmount.toString());
	if (params.maxAmount)
		searchParams.set("maxAmount", params.maxAmount.toString());
	if (params.dateFrom) searchParams.set("dateFrom", params.dateFrom);
	if (params.dateTo) searchParams.set("dateTo", params.dateTo);
	if (params.sortBy) searchParams.set("sortBy", params.sortBy);
	if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

	const response = await authenticatedFetch(
		`${API_BASE}/admin/transactions?${searchParams.toString()}`,
		{ method: "GET" },
	);

	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(error.message || "Failed to fetch transactions");
	}

	return response.json();
}

/**
 * Get single transaction by ID
 */
export async function getAdminTransaction(
	transactionId: number,
): Promise<AdminTransaction> {
	const response = await authenticatedFetch(
		`${API_BASE}/admin/transactions/${transactionId}`,
		{ method: "GET" },
	);

	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(error.message || "Failed to fetch transaction");
	}

	return response.json();
}

/**
 * Refund a transaction
 */
export async function refundTransaction(
	transactionId: number,
	reason: string,
	amount?: number,
): Promise<AdminTransaction> {
	const response = await authenticatedFetch(
		`${API_BASE}/admin/transactions/${transactionId}/refund`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ reason, amount }),
		},
	);

	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(error.message || "Failed to refund transaction");
	}

	return response.json();
}

/**
 * Cancel a pending transaction
 */
export async function cancelTransaction(
	transactionId: number,
	reason: string,
): Promise<AdminTransaction> {
	const response = await authenticatedFetch(
		`${API_BASE}/admin/transactions/${transactionId}/cancel`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ reason }),
		},
	);

	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(error.message || "Failed to cancel transaction");
	}

	return response.json();
}

// =============================================================================
// Wallets API
// =============================================================================

/**
 * Wallet search/filter params
 */
export interface AdminWalletsParams {
	page?: number;
	limit?: number;
	search?: string;
	status?: WalletStatus;
	userType?: "CUSTOMER" | "BUSINESS";
	minBalance?: number;
	maxBalance?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

/**
 * Paginated wallets response
 */
export interface AdminWalletsResponse {
	wallets: AdminWallet[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

/**
 * Get paginated list of wallets
 */
export async function getAdminWallets(
	params: AdminWalletsParams = {},
): Promise<AdminWalletsResponse> {
	const searchParams = new URLSearchParams();
	if (params.page) searchParams.set("page", params.page.toString());
	if (params.limit) searchParams.set("limit", params.limit.toString());
	if (params.search) searchParams.set("search", params.search);
	if (params.status) searchParams.set("status", params.status);
	if (params.userType) searchParams.set("userType", params.userType);
	if (params.minBalance)
		searchParams.set("minBalance", params.minBalance.toString());
	if (params.maxBalance)
		searchParams.set("maxBalance", params.maxBalance.toString());
	if (params.sortBy) searchParams.set("sortBy", params.sortBy);
	if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

	const response = await authenticatedFetch(
		`${API_BASE}/admin/wallets?${searchParams.toString()}`,
		{ method: "GET" },
	);

	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(error.message || "Failed to fetch wallets");
	}

	return response.json();
}

/**
 * Get single wallet by ID
 */
export async function getAdminWallet(walletId: number): Promise<AdminWallet> {
	const response = await authenticatedFetch(
		`${API_BASE}/admin/wallets/${walletId}`,
		{
			method: "GET",
		},
	);

	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(error.message || "Failed to fetch wallet");
	}

	return response.json();
}

/**
 * Adjust wallet balance
 */
export async function adjustWalletBalance(
	walletId: number,
	amount: number,
	reason: string,
	type: "INCREASE" | "DECREASE",
): Promise<AdminWallet> {
	const response = await authenticatedFetch(
		`${API_BASE}/admin/wallets/${walletId}/adjust`,
		{
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ amount, reason, type }),
		},
	);

	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(error.message || "Failed to adjust wallet balance");
	}

	return response.json();
}

/**
 * Update wallet status
 */
export async function updateWalletStatus(
	walletId: number,
	status: WalletStatus,
): Promise<AdminWallet> {
	const response = await authenticatedFetch(
		`${API_BASE}/admin/wallets/${walletId}/status`,
		{
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ status }),
		},
	);

	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(error.message || "Failed to update wallet status");
	}

	return response.json();
}

// =============================================================================
// Audit Logs API
// =============================================================================

/**
 * Audit log search/filter params
 */
export interface AdminAuditLogsParams {
	page?: number;
	limit?: number;
	adminId?: number;
	action?: string;
	entityType?: string;
	entityId?: number;
	dateFrom?: string;
	dateTo?: string;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

/**
 * Paginated audit logs response
 */
export interface AdminAuditLogsResponse {
	logs: AdminAuditLog[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

/**
 * Get paginated list of audit logs
 */
export async function getAdminAuditLogs(
	params: AdminAuditLogsParams = {},
): Promise<AdminAuditLogsResponse> {
	const searchParams = new URLSearchParams();
	if (params.page) searchParams.set("page", params.page.toString());
	if (params.limit) searchParams.set("limit", params.limit.toString());
	if (params.adminId) searchParams.set("adminId", params.adminId.toString());
	if (params.action) searchParams.set("action", params.action);
	if (params.entityType) searchParams.set("entityType", params.entityType);
	if (params.entityId) searchParams.set("entityId", params.entityId.toString());
	if (params.dateFrom) searchParams.set("dateFrom", params.dateFrom);
	if (params.dateTo) searchParams.set("dateTo", params.dateTo);
	if (params.sortBy) searchParams.set("sortBy", params.sortBy);
	if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

	const response = await authenticatedFetch(
		`${API_BASE}/admin/audit?${searchParams.toString()}`,
		{ method: "GET" },
	);

	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(error.message || "Failed to fetch audit logs");
	}

	return response.json();
}

/**
 * Get audit log actions for filter
 */
export async function getAuditActions(): Promise<string[]> {
	const response = await authenticatedFetch(`${API_BASE}/admin/audit/actions`, {
		method: "GET",
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(error.message || "Failed to fetch audit actions");
	}

	return response.json();
}

// =============================================================================
// Admins Management API
// =============================================================================

/**
 * Admin search/filter params
 */
export interface AdminAdminsParams {
	page?: number;
	limit?: number;
	search?: string;
	adminType?: AdminType;
	status?: AdminStatus;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

/**
 * Paginated admins response
 */
export interface AdminAdminsResponse {
	admins: Admin[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
}

/**
 * Get paginated list of admins
 */
export async function getAdminAdmins(
	params: AdminAdminsParams = {},
): Promise<AdminAdminsResponse> {
	const searchParams = new URLSearchParams();
	if (params.page) searchParams.set("page", params.page.toString());
	if (params.limit) searchParams.set("limit", params.limit.toString());
	if (params.search) searchParams.set("search", params.search);
	if (params.adminType) searchParams.set("adminType", params.adminType);
	if (params.status) searchParams.set("status", params.status);
	if (params.sortBy) searchParams.set("sortBy", params.sortBy);
	if (params.sortOrder) searchParams.set("sortOrder", params.sortOrder);

	const response = await authenticatedFetch(
		`${API_BASE}/admin/admins?${searchParams.toString()}`,
		{ method: "GET" },
	);

	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(error.message || "Failed to fetch admins");
	}

	return response.json();
}

/**
 * Create a new admin
 */
export interface CreateAdminParams {
	phoneNumber: string;
	password: string;
	adminType: AdminType;
	department?: string;
	permissions?: string[];
}

export async function createAdmin(params: CreateAdminParams): Promise<Admin> {
	const response = await authenticatedFetch(`${API_BASE}/admin/admins`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(params),
	});

	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(error.message || "Failed to create admin");
	}

	return response.json();
}

/**
 * Update an admin
 */
export interface UpdateAdminParams {
	adminType?: AdminType;
	department?: string;
	permissions?: string[];
}

export async function updateAdmin(
	adminId: number,
	params: UpdateAdminParams,
): Promise<Admin> {
	const response = await authenticatedFetch(
		`${API_BASE}/admin/admins/${adminId}`,
		{
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(params),
		},
	);

	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(error.message || "Failed to update admin");
	}

	return response.json();
}

/**
 * Update admin status
 */
export async function updateAdminStatus(
	adminId: number,
	status: AdminStatus,
): Promise<Admin> {
	const response = await authenticatedFetch(
		`${API_BASE}/admin/admins/${adminId}/status`,
		{
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ status }),
		},
	);

	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(error.message || "Failed to update admin status");
	}

	return response.json();
}

/**
 * Delete an admin
 */
export async function deleteAdmin(adminId: number): Promise<void> {
	const response = await authenticatedFetch(
		`${API_BASE}/admin/admins/${adminId}`,
		{ method: "DELETE" },
	);

	if (!response.ok) {
		const error = await response.json().catch(() => ({}));
		throw new Error(error.message || "Failed to delete admin");
	}
}

// =============================================================================
// Business Users API
// =============================================================================

/**
 * Get business users
 */
export async function getBusinessUsers(
	params: AdminUsersParams = {},
): Promise<AdminUsersResponse> {
	return getAdminUsers({ ...params, userType: "BUSINESS" });
}

/**
 * Get business user transactions
 */
export async function getBusinessUserTransactions(
	userId: number,
	params: AdminTransactionsParams = {},
): Promise<AdminTransactionsResponse> {
	return getAdminTransactions(params);
}
