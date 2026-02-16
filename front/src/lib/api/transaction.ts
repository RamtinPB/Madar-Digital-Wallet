import { authenticatedFetch } from "./auth";
import type {
	TransactionsResponse,
	TransactionsFilters,
	TransactionWithDetails,
} from "@/types/transaction";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE;

// Get all user transactions with filters and pagination
export async function getUserTransactions(
	filters: TransactionsFilters = {},
): Promise<TransactionsResponse> {
	const params = new URLSearchParams();

	if (filters.page) params.append("page", filters.page.toString());
	if (filters.limit) params.append("limit", filters.limit.toString());
	if (filters.type) params.append("type", filters.type);
	if (filters.status) params.append("status", filters.status);
	if (filters.walletId) params.append("walletId", filters.walletId.toString());
	if (filters.fromDate) params.append("fromDate", filters.fromDate);
	if (filters.toDate) params.append("toDate", filters.toDate);
	if (filters.search) params.append("search", filters.search);

	const url = `${API_BASE}/transactions?${params.toString()}`;

	const response = await authenticatedFetch(url, {
		method: "GET",
	});

	if (!response.ok) {
		let errMsg = "Failed to fetch transactions";
		try {
			const body = await response.json();
			errMsg = body?.error || errMsg;
		} catch (e) {}
		throw new Error(errMsg);
	}

	return response.json();
}

// Get transaction by ID
export async function getTransactionById(
	transactionId: number,
): Promise<{ transaction: TransactionWithDetails }> {
	const response = await authenticatedFetch(
		`${API_BASE}/transaction/${transactionId}`,
		{
			method: "GET",
		},
	);

	if (!response.ok) {
		let errMsg = "Failed to fetch transaction";
		try {
			const body = await response.json();
			errMsg = body?.error || errMsg;
		} catch (e) {}
		throw new Error(errMsg);
	}

	return response.json();
}

// Get transaction by public ID
export async function getTransactionByPublicId(
	publicId: string,
): Promise<{ transaction: TransactionWithDetails }> {
	const response = await authenticatedFetch(
		`${API_BASE}/transaction/public/${publicId}`,
		{
			method: "GET",
		},
	);

	if (!response.ok) {
		let errMsg = "Transaction not found";
		try {
			const body = await response.json();
			errMsg = body?.error || errMsg;
		} catch (e) {}
		throw new Error(errMsg);
	}

	return response.json();
}
