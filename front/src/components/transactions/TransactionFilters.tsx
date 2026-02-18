"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Calendar, Star, RotateCcw } from "lucide-react";
import type { TransactionsFilters } from "@/types/transaction";
import type { Wallet } from "@/types/wallet";
import {
	transactionTypeOptions,
	transactionStatusOptions,
} from "@/types/transaction";
import { Badge } from "../ui/badge";

interface TransactionFiltersProps {
	filters: TransactionsFilters;
	wallets: Wallet[];
	onFilterChange: (filters: TransactionsFilters) => void;
	onClear: () => void;
}

export function TransactionFilters({
	filters,
	wallets,
	onFilterChange,
	onClear,
}: TransactionFiltersProps) {
	// Helper to get display value for Select
	// Returns "all" for "all" or undefined, returns the value for specific filters
	const getSelectValue = (value: string | number | undefined): string => {
		if (value === "all" || value === undefined || value === "") {
			return "all";
		}
		return value.toString();
	};

	// Handle filter change for any field
	const handleFilterChange = (
		key: keyof TransactionsFilters,
		value: string | number | undefined,
	) => {
		// Convert "all" to undefined for type/status/walletId
		// Keep dates and search as-is
		let processedValue: string | number | undefined = value;

		if (value === "all" || value === "") {
			processedValue = undefined;
		} else if (
			(key === "walletId" || key === "type" || key === "status") &&
			value !== undefined
		) {
			// Keep the value as-is for specific filters
			processedValue = value;
		}

		// For walletId, convert to number if it's a string number
		if (key === "walletId" && typeof processedValue === "string") {
			processedValue =
				processedValue === "all" ? undefined : parseInt(processedValue, 10);
		}

		onFilterChange({
			...filters,
			[key]: processedValue,
			page: 1, // Reset to page 1 when filters change
		});
	};

	// Handle date changes
	const handleDateChange = (key: "fromDate" | "toDate", value: string) => {
		onFilterChange({
			...filters,
			[key]: value || undefined,
			page: 1,
		});
	};

	return (
		<div className="bg-card rounded-lg border p-4 space-y-4">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{/* Transaction Type Filter */}
				<div>
					<label className="text-sm font-medium mb-2 block">نوع تراکنش</label>
					<Select
						dir="rtl"
						value={getSelectValue(filters.type)}
						onValueChange={(value) => handleFilterChange("type", value)}
					>
						<SelectTrigger>
							<SelectValue placeholder="همه" />
						</SelectTrigger>
						<SelectContent>
							{transactionTypeOptions.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Status Filter */}
				<div>
					<label className="text-sm font-medium mb-2 block">وضعیت</label>
					<Select
						dir="rtl"
						value={getSelectValue(filters.status)}
						onValueChange={(value) => handleFilterChange("status", value)}
					>
						<SelectTrigger>
							<SelectValue placeholder="همه" />
						</SelectTrigger>
						<SelectContent>
							{transactionStatusOptions.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Wallet Filter */}
				<div>
					<label className="text-sm font-medium mb-2 block">کیف پول</label>
					<Select
						dir="rtl"
						value={
							filters.walletId !== undefined
								? filters.walletId.toString()
								: "all"
						}
						onValueChange={(value) => handleFilterChange("walletId", value)}
					>
						<SelectTrigger>
							<SelectValue placeholder="همه" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">همه</SelectItem>
							{wallets.map((wallet) => (
								<SelectItem key={wallet.id} value={wallet.id.toString()}>
									<div className="flex items-center justify-between gap-2">
										<span>
											{wallet.name || `**** ${wallet.publicId.slice(-4)}`}
										</span>
										{wallet.primary && (
											<Badge
												variant="secondary"
												className="bg-yellow-100 text-yellow-800 gap-1"
											>
												اصلی
												<Star className="h-3 w-3 fill-yellow-500" />
											</Badge>
										)}
									</div>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Date Range Filters */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div>
					<label className="text-sm font-medium mb-2 block">از تاریخ</label>
					<div className="relative">
						<Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							type="date"
							value={filters.fromDate || ""}
							onChange={(e) => handleDateChange("fromDate", e.target.value)}
							className="pl-10"
							dir="rtl"
						/>
					</div>
				</div>

				<div>
					<label className="text-sm font-medium mb-2 block">تا تاریخ</label>
					<div className="relative">
						<Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						<Input
							type="date"
							value={filters.toDate || ""}
							onChange={(e) => handleDateChange("toDate", e.target.value)}
							className="pl-10"
							dir="rtl"
						/>
					</div>
				</div>
			</div>

			{/* Action Buttons */}
			<div className="flex gap-2 justify-start">
				<Button variant="outline" onClick={onClear}>
					<RotateCcw className="ml-2 h-4 w-4" />
					بازگشت به حالت پیش فرض
				</Button>
			</div>
		</div>
	);
}
