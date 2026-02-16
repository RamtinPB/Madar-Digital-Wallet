"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { TransactionRow } from "./TransactionRow";
import type { TransactionWithDetails } from "@/types/transaction";

interface TransactionTableProps {
	transactions: TransactionWithDetails[];
	isLoading: boolean;
	onViewReceipt: (transaction: TransactionWithDetails) => void;
}

export function TransactionTable({
	transactions,
	isLoading,
	onViewReceipt,
}: TransactionTableProps) {
	if (isLoading) {
		return (
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>#</TableHead>
							<TableHead>تاریخ</TableHead>
							<TableHead>نوع</TableHead>
							<TableHead>مبلغ</TableHead>
							<TableHead>وضعیت</TableHead>
							<TableHead>توضیحات</TableHead>
							<TableHead>عملیات</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{Array.from({ length: 5 }).map((_, i) => (
							<TableRow key={i}>
								{Array.from({ length: 7 }).map((_, j) => (
									<TableCell key={j}>
										<Skeleton className="h-4 w-full" />
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		);
	}

	if (transactions.length === 0) {
		return (
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>#</TableHead>
							<TableHead>تاریخ</TableHead>
							<TableHead>نوع</TableHead>
							<TableHead>مبلغ</TableHead>
							<TableHead>وضعیت</TableHead>
							<TableHead>توضیحات</TableHead>
							<TableHead>عملیات</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<TableRow>
							<TableCell colSpan={7} className="h-32 text-center">
								<div className="flex flex-col items-center gap-2 text-muted-foreground">
									<p>تراکنشی یافت نشد</p>
									<p className="text-sm">با تغییر فیلترها، مجدداً تلاش کنید</p>
								</div>
							</TableCell>
						</TableRow>
					</TableBody>
				</Table>
			</div>
		);
	}

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[50px]">#</TableHead>
						<TableHead className="w-[120px]">تاریخ</TableHead>
						<TableHead className="w-[100px]">نوع</TableHead>
						<TableHead className="w-[120px]">مبلغ</TableHead>
						<TableHead className="w-[100px]">وضعیت</TableHead>
						<TableHead>توضیحات</TableHead>
						<TableHead className="w-[120px]">عملیات</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{transactions.map((transaction, index) => (
						<TransactionRow
							key={transaction.id}
							transaction={transaction}
							index={index}
							onViewReceipt={onViewReceipt}
						/>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
