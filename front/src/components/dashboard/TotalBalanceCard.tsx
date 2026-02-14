import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";

interface TotalBalanceCardProps {
	totalBalance: number;
	isLoading?: boolean;
}

export function TotalBalanceCard({
	totalBalance,
	isLoading,
}: TotalBalanceCardProps) {
	return (
		<Card className="bg-linear-to-l from-emerald-600 to-emerald-500 text-white border-none">
			<CardHeader className="pb-2">
				<CardTitle className="text-sm font-medium text-emerald-100">
					موجودی کل
				</CardTitle>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className="h-10 bg-emerald-400/50 animate-pulse rounded" />
				) : (
					<div className="text-3xl font-bold tracking-tight">
						{formatCurrency(totalBalance)}
					</div>
				)}
				<p className="text-xs text-emerald-100 mt-1">مجموع تمام کیف‌ پول‌ها</p>
			</CardContent>
		</Card>
	);
}
