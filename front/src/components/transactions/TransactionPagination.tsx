"use client";

import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface TransactionPaginationProps {
	page: number;
	limit: number;
	total: number;
	totalPages: number;
	onPageChange: (page: number) => void;
	onLimitChange: (limit: number) => void;
}

export function TransactionPagination({
	page,
	limit,
	total,
	totalPages,
	onPageChange,
	onLimitChange,
}: TransactionPaginationProps) {
	const startItem = (page - 1) * limit + 1;
	const endItem = Math.min(page * limit, total);

	// Generate page numbers with ellipsis
	const getPageNumbers = () => {
		const pages: (number | "ellipsis")[] = [];
		const maxVisible = 5;

		if (totalPages <= maxVisible) {
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			// Always show first page
			pages.push(1);

			if (page > 3) {
				pages.push("ellipsis");
			}

			// Show pages around current page
			const start = Math.max(2, page - 1);
			const end = Math.min(totalPages - 1, page + 1);

			for (let i = start; i <= end; i++) {
				pages.push(i);
			}

			if (page < totalPages - 2) {
				pages.push("ellipsis");
			}

			// Always show last page
			if (totalPages > 1) {
				pages.push(totalPages);
			}
		}

		return pages;
	};

	const pageNumbers = getPageNumbers();

	return (
		<div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4">
			{/* Showing text */}
			<div className="text-sm text-muted-foreground">
				نمایش {startItem}-{endItem} از {total} تراکنش
			</div>

			<div className="flex items-center gap-4">
				{/* Items per page selector */}
				<div className="flex items-center gap-2">
					<span className="text-sm text-muted-foreground">نمایش:</span>
					<Select
						value={limit.toString()}
						onValueChange={(value) => onLimitChange(parseInt(value))}
					>
						<SelectTrigger className="w-[80px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="20">20</SelectItem>
							<SelectItem value="50">50</SelectItem>
							<SelectItem value="100">100</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Page numbers */}
				<div className="flex items-center gap-1">
					{/* Previous button */}
					<Button
						variant="outline"
						size="icon"
						onClick={() => onPageChange(page - 1)}
						disabled={page === 1}
					>
						<ChevronRight className="h-4 w-4" />
					</Button>

					{/* Page numbers */}
					{pageNumbers.map((pn, index) =>
						pn === "ellipsis" ? (
							<span key={`ellipsis-${index}`} className="px-2">
								...
							</span>
						) : (
							<Button
								key={pn}
								variant={page === pn ? "default" : "outline"}
								size="icon"
								onClick={() => onPageChange(pn)}
								className="w-9"
							>
								{pn}
							</Button>
						),
					)}

					{/* Next button */}
					<Button
						variant="outline"
						size="icon"
						onClick={() => onPageChange(page + 1)}
						disabled={page === totalPages}
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
