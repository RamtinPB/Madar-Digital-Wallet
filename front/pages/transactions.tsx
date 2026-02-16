import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { ArrowRight, SlidersHorizontal } from "lucide-react";
import { MainLayout } from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
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

export default function TransactionsPage() {
	const [showFilters, setShowFilters] = useState(false);
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

	// Load wallets on mount
	useEffect(() => {
		const loadWallets = async () => {
			try {
				const response = await getUserWallets();
				setWallets(response.wallets || []);
			} catch (err) {
				console.error("Failed to load wallets:", err);
			}
		};
		loadWallets();
	}, []);

	// Handle search
	const handleSearch = (search: string) => {
		setFilters({ search: search || undefined });
	};

	// Handle apply filters
	const handleApplyFilters = (newFilters: TransactionsFilters) => {
		setFilters(newFilters);
		setShowFilters(false);
	};

	// Handle clear filters
	const handleClearFilters = () => {
		setFilters({});
	};

	// Handle remove single filter
	const handleRemoveFilter = (key: keyof TransactionsFilters) => {
		const newFilters = { ...filters };
		delete newFilters[key];
		setFilters(newFilters);
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

	// Check if any filters are active
	const hasActiveFilters = !!(
		filters.type ||
		filters.status ||
		filters.walletId ||
		filters.fromDate ||
		filters.toDate ||
		filters.search
	);

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
							<Link
								href="/"
								className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
							>
								<ArrowRight className="ml-1 h-4 w-4" />
								بازگشت به داشبورد
							</Link>
							<h1 className="text-2xl font-bold">تاریخچه تراکنش‌ها</h1>
							<p className="text-muted-foreground text-sm mt-1">
								Transaction History
							</p>
						</div>
					</div>

					{/* Search and Filter Bar */}
					<div className="flex flex-col sm:flex-row gap-4">
						<div className="flex-1">
							<TransactionSearch
								value={filters.search || ""}
								onChange={handleSearch}
							/>
						</div>
						<Button
							variant="outline"
							onClick={() => setShowFilters(!showFilters)}
							className="gap-2"
						>
							<SlidersHorizontal className="h-4 w-4" />
							فیلترها
							{hasActiveFilters && (
								<span className="bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
									!
								</span>
							)}
						</Button>
					</div>

					{/* Filters Panel */}
					{showFilters && (
						<TransactionFilters
							filters={filters}
							onApply={handleApplyFilters}
							onClear={handleClearFilters}
						/>
					)}

					{/* Active Filters Tags */}
					{hasActiveFilters && !showFilters && (
						<ActiveFilters
							filters={filters}
							wallets={wallets}
							onRemove={handleRemoveFilter}
							onClearAll={handleClearFilters}
						/>
					)}

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
					/>
				</div>
			</MainLayout>
		</>
	);
}
