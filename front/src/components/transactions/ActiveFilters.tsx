"use client";

import { X, FilterX, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
	// Only include filters that have actual values (not undefined, not "all")
	const activeFilters: {
		key: keyof TransactionsFilters;
		label: string;
		primary?: boolean;
	}[] = [];

	// Handle type filter - only show if it's a specific type (not "all" or undefined)
	if (filters.type && filters.type !== "all") {
		activeFilters.push({
			key: "type",
			label: `نوع: ${transactionTypeLabels[filters.type as TransactionType] || filters.type}`,
		});
	}

	// Handle status filter - only show if it's a specific status (not "all" or undefined)
	if (filters.status && filters.status !== "all") {
		activeFilters.push({
			key: "status",
			label: `وضعیت: ${transactionStatusLabels[filters.status as TransactionStatus] || filters.status}`,
		});
	}

	// Handle wallet filter - only show if walletId is a number (specific wallet)
	// Don't show if it's "all" or undefined
	if (
		filters.walletId !== undefined &&
		filters.walletId !== "all" &&
		filters.walletId !== ""
	) {
		const wallet = wallets.find((w) => w.id === filters.walletId);
		const walletLabel =
			wallet?.name || `**** ${wallet?.publicId.slice(-4) || filters.walletId}`;

		activeFilters.push({
			key: "walletId",
			label: `کیف پول: ${walletLabel}`,
			primary: wallet?.primary,
		});
	}

	// Handle date filters - only show if they have values
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

	// Handle search - only show if it has value
	if (filters.search) {
		activeFilters.push({
			key: "search",
			label: `جستجو: ${filters.search}`,
		});
	}

	// If no active filters, don't render anything
	if (activeFilters.length === 0) {
		return null;
	}

	// Render each filter badge
	return (
		<div className="flex flex-wrap items-center gap-2">
			{activeFilters.map((filter) => (
				<div
					key={filter.key}
					className="flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1.5 rounded-full text-sm"
				>
					<span>{filter.label}</span>
					{filter.key === "walletId" && filter.primary && (
						<Badge
							variant="secondary"
							className="bg-yellow-100 text-yellow-800 gap-1"
						>
							اصلی
							<Star className="h-3 w-3 fill-yellow-500" />
						</Badge>
					)}
					<button
						onClick={() => onRemove(filter.key)}
						className="mr-1 hover:text-destructive rounded-full p-0.5 hover:bg-destructive/10 transition-colors"
						title="حذف فیلتر"
					>
						<X className="h-3 w-3" />
					</button>
				</div>
			))}

			{/* Clear All Button */}
			{activeFilters.length > 1 && (
				<Button
					variant="ghost"
					size="sm"
					onClick={onClearAll}
					className="text-muted-foreground hover:text-destructive h-auto py-1 px-2"
				>
					<FilterX className="h-3 w-3 ml-1" />
					حذف همه
				</Button>
			)}
		</div>
	);
}
