"use client";

import {
	ArrowUpRight,
	ArrowDownRight,
	ShoppingCart,
	RefreshCw,
	Banknote,
	Wallet,
	HelpCircle,
} from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TransactionWithDetails } from "@/types/transaction";
import {
	transactionTypeLabels,
	transactionStatusLabels,
	transactionStatusIcons,
	TransactionType,
} from "@/types/transaction";
import { formatCurrency } from "@/lib/format";

interface TransactionRowProps {
	transaction: TransactionWithDetails;
	index: number;
	onViewReceipt: (transaction: TransactionWithDetails) => void;
}

// Get icon for transaction type
function getTransactionIcon(type: TransactionType) {
	switch (type) {
		case "PURCHASE":
			return <ShoppingCart className="h-4 w-4" />;
		case "TRANSFER":
			return <RefreshCw className="h-4 w-4" />;
		case "DEPOSIT":
			return <ArrowDownRight className="h-4 w-4" />;
		case "WITHDRAW":
			return <ArrowUpRight className="h-4 w-4" />;
		case "REFUND":
			return <Banknote className="h-4 w-4" />;
		case "ADMIN_ADJUSTMENT":
			return <Wallet className="h-4 w-4" />;
		default:
			return <HelpCircle className="h-4 w-4" />;
	}
}

// Check if transaction is incoming (positive amount for user)
function isIncoming(transaction: TransactionWithDetails): boolean {
	return (
		transaction.transactionType === "DEPOSIT" ||
		transaction.transactionType === "REFUND"
	);
}

export function TransactionRow({
	transaction,
	index,
	onViewReceipt,
}: TransactionRowProps) {
	const amount = parseFloat(transaction.amount);
	const isIncomingTx = isIncoming(transaction);

	// Format date to Persian
	const formattedDate = new Date(transaction.createdAt).toLocaleDateString(
		"fa-IR",
		{
			year: "numeric",
			month: "2-digit",
			day: "2-digit",
		},
	);

	// Get description/recipient info
	let description = transaction.description || "";
	if (
		transaction.transactionType === "TRANSFER" &&
		transaction.receiverWallet
	) {
		description = transaction.receiverWallet.user.phoneNumber;
	} else if (
		transaction.transactionType === "PURCHASE" &&
		transaction.metadata?.sellerName
	) {
		description = transaction.metadata.sellerName;
	}

	return (
		<TableRow
			className="cursor-pointer hover:bg-muted/50"
			onClick={() => onViewReceipt(transaction)}
		>
			<TableCell className="font-medium">{index + 1}</TableCell>
			<TableCell dir="rtl">{formattedDate}</TableCell>
			<TableCell>
				<div className="flex items-center gap-2">
					{getTransactionIcon(transaction.transactionType)}
					<span>{transactionTypeLabels[transaction.transactionType]}</span>
				</div>
			</TableCell>
			<TableCell>
				<span className={isIncomingTx ? "text-green-600" : "text-red-600"}>
					{isIncomingTx ? "+" : "-"}
					{formatCurrency(Math.abs(amount))}
				</span>
			</TableCell>
			<TableCell>
				<Badge variant="outline" className="gap-1">
					<span>{transactionStatusIcons[transaction.status]}</span>
					<span>{transactionStatusLabels[transaction.status]}</span>
				</Badge>
			</TableCell>
			<TableCell className="text-muted-foreground">
				{description || "-"}
			</TableCell>
			<TableCell>
				<Button
					variant="ghost"
					size="sm"
					onClick={(e) => {
						e.stopPropagation();
						onViewReceipt(transaction);
					}}
				>
					مشاهده فاکتور
				</Button>
			</TableCell>
		</TableRow>
	);
}
