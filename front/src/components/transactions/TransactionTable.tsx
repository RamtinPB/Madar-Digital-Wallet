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
	currentWalletId?: number;
}

export function TransactionTable({
	transactions,
	isLoading,
	onViewReceipt,
	currentWalletId,
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
						<TableHead className="w-[50px] text-center">#</TableHead>
						<TableHead className="w-[120px] text-center">تاریخ</TableHead>
						<TableHead className="w-[100px] text-center">نوع</TableHead>
						<TableHead className="w-[120px] text-center">مبلغ</TableHead>
						<TableHead className="w-[100px] text-center">وضعیت</TableHead>
						<TableHead className=" text-center">توضیحات</TableHead>
						<TableHead className="w-[120px] text-center">عملیات</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{transactions.map((transaction, index) => (
						<TransactionRow
							key={transaction.id}
							transaction={transaction}
							index={index}
							onViewReceipt={onViewReceipt}
							currentWalletId={currentWalletId}
						/>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
