import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { MainLayout } from "@/components/MainLayout";
import { useTransactions } from "@/hooks/useTransactions";
import { getUserWallets } from "@/lib/api/wallet";
import type { Wallet } from "@/types/wallet";
import type {
	TransactionWithDetails,
	TransactionsFilters,
} from "@/types/transaction";
import {
	TransactionSearch,
	TransactionFilters,
	ActiveFilters,
	TransactionTable,
	TransactionPagination,
	ReceiptModal,
} from "@/components/transactions";
import { Badge } from "@/components/ui/badge";

export default function TransactionsPage() {
	const [wallets, setWallets] = useState<Wallet[]>([]);
	const [selectedTransaction, setSelectedTransaction] =
		useState<TransactionWithDetails | null>(null);
	const [showReceiptModal, setShowReceiptModal] = useState(false);

	const {
		transactions,
		pagination,
		isLoading,
		error,
		filters,
		setFilters,
		setPage,
		setLimit,
	} = useTransactions({ initialPage: 1, initialLimit: 20 });

	// Load wallets on mount and set primary wallet as default filter
	useEffect(() => {
		const loadWallets = async () => {
			try {
				const response = await getUserWallets();
				const userWallets = response.wallets || [];
				setWallets(userWallets);

				// Auto-select primary wallet for initial filter
				const primaryWallet = userWallets.find((w: Wallet) => w.primary);
				if (primaryWallet) {
					setFilters({ walletId: primaryWallet.id });
				}
			} catch (err) {
				console.error("Failed to load wallets:", err);
			}
		};
		loadWallets();
	}, [setFilters]);

	// Handle search
	const handleSearch = (search: string) => {
		setFilters({ search: search || undefined });
	};

	// Handle filter changes from TransactionFilters component
	// This is called directly when user changes any filter
	const handleFilterChange = (newFilters: TransactionsFilters) => {
		setFilters(newFilters);
	};

	// Handle clear all filters - reset to default state with primary wallet
	const handleResetFilters = () => {
		const primaryWallet = wallets.find((w) => w.primary);

		// Clear all filters and set wallet to primary (or undefined if no primary)
		// We must explicitly set all filter keys to undefined since setFilters merges
		setFilters({
			walletId: primaryWallet?.id,
			type: undefined,
			status: undefined,
			fromDate: undefined,
			toDate: undefined,
			search: undefined,
			page: 1,
		});
	};

	// Handle clear all filters - reset to default state with primary wallet
	const handleClearFilters = () => {
		const primaryWallet = wallets.find((w) => w.primary);

		// Clear all filters and set wallet to primary (or undefined if no primary)
		// We must explicitly set all filter keys to undefined since setFilters merges
		setFilters({
			walletId: undefined, // primaryWallet?.id,
			type: undefined,
			status: undefined,
			fromDate: undefined,
			toDate: undefined,
			search: undefined,
			page: 1,
		});
	};

	// Handle remove individual filter
	const handleRemoveFilter = (key: keyof TransactionsFilters) => {
		const currentFilters = { ...filters };

		// Remove the specific filter by setting it to undefined
		// Keep page/limit as they are
		delete currentFilters[key];

		// If removing walletId, we might want to show all wallets (undefined)
		// If removing type/status, they become undefined (show all)
		// If removing dates/search, they become undefined

		setFilters({
			...currentFilters,
			[key]: undefined,
		});
	};

	// Handle view receipt
	const handleViewReceipt = (transaction: TransactionWithDetails) => {
		setSelectedTransaction(transaction);
		setShowReceiptModal(true);
	};

	// Handle close receipt modal
	const handleCloseReceipt = () => {
		setShowReceiptModal(false);
		setSelectedTransaction(null);
	};

	// Get the current wallet being displayed - handle undefined case
	const getCurrentWallet = () => {
		if (filters.walletId === undefined || filters.walletId === "all") {
			return null; // Showing all wallets
		}
		if (filters.walletId) {
			return wallets.find((w) => w.id === filters.walletId);
		}
		return null;
	};

	const currentWallet = getCurrentWallet();

	// Current wallet ID for passing to components
	const currentWalletId = filters.walletId
		? Number(filters.walletId)
		: undefined;

	return (
		<>
			<Head>
				<title>تاریخچه تراکنش‌ها | مدر</title>
			</Head>

			<MainLayout>
				<div className="space-y-6">
					{/* Page Header */}
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<div>
							<h1 className="text-2xl font-bold">تاریخچه تراکنش‌ها</h1>
							<p className="text-muted-foreground text-sm mt-1">
								Transaction History
							</p>
						</div>
					</div>

					{/* Search Bar */}
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="flex-1">
							<TransactionSearch
								value={filters.search || ""}
								onChange={handleSearch}
							/>
						</div>
					</div>

					{/* Transaction Filters - Controlled component */}
					<TransactionFilters
						filters={filters}
						wallets={wallets}
						onFilterChange={handleFilterChange}
						onClear={handleResetFilters}
					/>

					{/* Active Filters - Shows what filters are currently applied */}
					<ActiveFilters
						filters={filters}
						wallets={wallets}
						onRemove={handleRemoveFilter}
						onClearAll={handleClearFilters}
					/>

					{/* Error Message */}
					{error && (
						<div className="bg-destructive/10 text-destructive p-4 rounded-lg">
							{error}
						</div>
					)}

					{/* Transactions Table */}
					<TransactionTable
						transactions={transactions}
						isLoading={isLoading}
						onViewReceipt={handleViewReceipt}
						currentWalletId={currentWalletId}
					/>

					{/* Pagination */}
					{pagination && pagination.totalPages > 0 && (
						<TransactionPagination
							page={pagination.page}
							limit={pagination.limit}
							total={pagination.total}
							totalPages={pagination.totalPages}
							onPageChange={setPage}
							onLimitChange={setLimit}
						/>
					)}

					{/* Receipt Modal */}
					<ReceiptModal
						transaction={selectedTransaction}
						isOpen={showReceiptModal}
						onClose={handleCloseReceipt}
						currentWalletId={currentWalletId}
					/>
				</div>
			</MainLayout>
		</>
	);
}
