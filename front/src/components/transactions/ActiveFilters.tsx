"use client";

import { X, FilterX } from "lucide-react";
import { Button } from "@/components/ui/button";
import type {
	TransactionsFilters,
	TransactionType,
	TransactionStatus,
} from "@/types/transaction";
import {
	transactionTypeLabels,
	transactionStatusLabels,
} from "@/types/transaction";
import type { Wallet } from "@/types/wallet";

interface ActiveFiltersProps {
	filters: TransactionsFilters;
	wallets: Wallet[];
	onRemove: (key: keyof TransactionsFilters) => void;
	onClearAll: () => void;
}

export function ActiveFilters({
	filters,
	wallets,
	onRemove,
	onClearAll,
}: ActiveFiltersProps) {
	// Get active filters as an array
	const activeFilters: { key: keyof TransactionsFilters; label: string }[] = [];

	if (filters.type) {
		activeFilters.push({
			key: "type",
			label: `نوع: ${transactionTypeLabels[filters.type as TransactionType] || filters.type}`,
		});
	}

	if (filters.status) {
		activeFilters.push({
			key: "status",
			label: `وضعیت: ${transactionStatusLabels[filters.status as TransactionStatus] || filters.status}`,
		});
	}

	if (filters.walletId) {
		const wallet = wallets.find((w) => w.id === filters.walletId);
		activeFilters.push({
			key: "walletId",
			label: `کیف پول: ${wallet?.name || `**** ${wallet?.publicId.slice(-4) || filters.walletId}`}`,
		});
	}

	if (filters.fromDate) {
		activeFilters.push({
			key: "fromDate",
			label: `از: ${filters.fromDate}`,
		});
	}

	if (filters.toDate) {
		activeFilters.push({
			key: "toDate",
			label: `تا: ${filters.toDate}`,
		});
	}

	if (filters.search) {
		activeFilters.push({
			key: "search",
			label: `جستجو: ${filters.search}`,
		});
	}

	if (activeFilters.length === 0) {
		return null;
	}

	return (
		<div className="flex flex-wrap items-center gap-2">
			{activeFilters.map((filter) => (
				<div
					key={filter.key}
					className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full text-sm"
				>
					<span>{filter.label}</span>
				</div>
			))}
		</div>
	);
}
