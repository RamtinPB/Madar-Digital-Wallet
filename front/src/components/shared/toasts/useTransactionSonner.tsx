"use client";

import { toast } from "sonner";

// Transaction toast data interface
interface TransactionToastData {
	publicId: string;
	amount: number;
	transactionType: "PURCHASE" | "TRANSFER" | "DEPOSIT" | "WITHDRAW" | "REFUND";
	timestamp?: string;
}

// Options for the hook
interface UseTransactionSonnerOptions {
	onViewReceipt?: (transactionPublicId: string) => void;
}

// Format amount in Iranian Toman
const formatAmount = (amount: number): string => {
	return new Intl.NumberFormat("fa-IR").format(amount);
};

// Get transaction type label in Persian
const getTransactionTypeLabel = (type: string): string => {
	const labels: Record<string, string> = {
		PURCHASE: "خرید",
		TRANSFER: "انتقال",
		DEPOSIT: "واریز",
		WITHDRAW: "برداشت",
		REFUND: "بازگشت",
	};
	return labels[type] || type;
};

// Success toast with receipt link
export const displayTransactionSuccess = (
	data: TransactionToastData,
	onViewReceipt?: (publicId: string) => void,
) => {
	toast.success("تراکنش با موفقیت انجام شد", {
		description: (
			<div className="flex flex-col gap-1">
				<span className="text-sm text-muted-foreground">
					{getTransactionTypeLabel(data.transactionType)} -{" "}
					{formatAmount(data.amount)} تومان
				</span>
				<span className="text-xs text-muted-foreground">
					شماره پیگیری: {data.publicId}
				</span>
			</div>
		),
		action: {
			label: "مشاهده فاکتور",
			onClick: () => onViewReceipt?.(data.publicId),
		},
		duration: 5000,
	});
};

// Error toast for transaction failures
export const displayTransactionError = (
	message: string,
	description?: string,
) => {
	toast.error(message, {
		description: description,
		duration: 4000,
	});
};

// Hook version for more complex usage
export const useTransactionSonner = (options?: UseTransactionSonnerOptions) => {
	const { onViewReceipt } = options || {};

	return {
		displaySuccess: (data: TransactionToastData) =>
			displayTransactionSuccess(data, onViewReceipt),
		displayError: displayTransactionError,
	};
};

export type { TransactionToastData, UseTransactionSonnerOptions };
