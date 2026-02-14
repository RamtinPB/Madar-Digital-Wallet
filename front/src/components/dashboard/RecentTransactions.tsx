import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/lib/api/wallet";
import { TransactionItem } from "./TransactionItem";

interface RecentTransactionsProps {
	transactions: Transaction[];
	currentWalletId: number | null;
	isLoading?: boolean;
	onViewAll?: () => void;
}

export function RecentTransactions({
	transactions,
	currentWalletId,
	isLoading,
	onViewAll,
}: RecentTransactionsProps) {
	return (
		<Card>
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<CardTitle className="text-base">آخرین تراکنش‌ها</CardTitle>
					{onViewAll && (
						<button
							onClick={onViewAll}
							className="text-sm text-primary hover:underline"
						>
							مشاهده همه
						</button>
					)}
				</div>
			</CardHeader>
			<CardContent className="space-y-1">
				{isLoading ? (
					Array.from({ length: 5 }).map((_, i) => (
						<div key={i} className="flex items-center gap-3 p-3">
							<div className="w-5 h-5 bg-muted animate-pulse rounded-full" />
							<div className="flex-1 space-y-1">
								<div className="h-4 bg-muted animate-pulse rounded w-1/3" />
								<div className="h-3 bg-muted animate-pulse rounded w-1/4" />
							</div>
							<div className="h-4 bg-muted animate-pulse rounded w-20" />
						</div>
					))
				) : transactions.length === 0 ? (
					<div className="text-center py-8 text-muted-foreground">
						<p>تراکنشی یافت نشد</p>
					</div>
				) : (
					transactions.map((transaction) => (
						<TransactionItem
							key={transaction.id}
							transaction={transaction}
							currentWalletId={currentWalletId || 0}
						/>
					))
				)}
			</CardContent>
		</Card>
	);
}
