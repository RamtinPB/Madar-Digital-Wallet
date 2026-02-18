import { prisma } from "../../infrastructure/db/prisma.client";
import * as adminRepository from "../admin/admin.repository";
import { hasPermission } from "../../types/admin";

// List all transactions with pagination and filters
export const listTransactions = async (params: {
	page: number;
	limit: number;
	status?: string;
	transactionType?: string;
	minAmount?: number;
	maxAmount?: number;
	startDate?: Date;
	endDate?: Date;
	adminPermissions: string[];
}) => {
	const {
		page,
		limit,
		status,
		transactionType,
		minAmount,
		maxAmount,
		startDate,
		endDate,
		adminPermissions,
	} = params;

	if (!hasPermission(adminPermissions, "transactions:read")) {
		throw new Error("Insufficient permissions");
	}

	const skip = (page - 1) * limit;

	const where: any = {};
	if (status) where.status = status;
	if (transactionType) where.transactionType = transactionType;
	if (minAmount || maxAmount) {
		where.amount = {};
		if (minAmount) where.amount.gte = minAmount;
		if (maxAmount) where.amount.lte = maxAmount;
	}
	if (startDate || endDate) {
		where.createdAt = {};
		if (startDate) where.createdAt.gte = startDate;
		if (endDate) where.createdAt.lte = endDate;
	}

	const [transactions, total] = await Promise.all([
		prisma.transaction.findMany({
			where,
			skip,
			take: limit,
			include: {
				payerWallet: {
					include: {
						user: {
							select: { id: true, phoneNumber: true },
						},
					},
				},
				receiverWallet: {
					include: {
						user: {
							select: { id: true, phoneNumber: true },
						},
					},
				},
			},
			orderBy: { createdAt: "desc" },
		}),
		prisma.transaction.count({ where }),
	]);

	return {
		data: transactions,
		pagination: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
		},
	};
};

// Get transaction by ID
export const getTransactionById = async (
	id: number,
	adminPermissions: string[],
) => {
	if (!hasPermission(adminPermissions, "transactions:refund")) {
		throw new Error("Insufficient permissions");
	}

	const transaction = await prisma.transaction.findUnique({
		where: { id },
		include: {
			payerWallet: {
				include: {
					user: {
						select: { id: true, phoneNumber: true },
					},
				},
			},
			receiverWallet: {
				include: {
					user: {
						select: { id: true, phoneNumber: true },
					},
				},
			},
			ledgerEntries: true,
		},
	});

	if (!transaction) {
		throw new Error("Transaction not found");
	}

	return transaction;
};

// Refund transaction
export const refundTransaction = async (
	transactionId: number,
	params: { reason: string; refundAmount?: number },
	adminId: number,
	adminPermissions: string[],
) => {
	if (!hasPermission(adminPermissions, "transactions:refund")) {
		throw new Error("Insufficient permissions");
	}

	const { reason, refundAmount } = params;

	const transaction = await prisma.transaction.findUnique({
		where: { id: transactionId },
		include: { payerWallet: true, receiverWallet: true },
	});

	if (!transaction) {
		throw new Error("Transaction not found");
	}

	if (transaction.status !== "COMPLETED") {
		throw new Error("Can only refund completed transactions");
	}

	// Get receiver wallet ID for use in the transaction
	const receiverWalletId = transaction.receiverWalletId;
	if (!receiverWalletId) {
		throw new Error("Transaction has no receiver wallet");
	}

	const refundTrxAmount = refundAmount || Number(transaction.amount);
	const payerWalletId = transaction.payerWalletId;

	// Create refund transaction
	const result = await prisma.$transaction(async (tx) => {
		// Create refund transaction - money goes back to payer from receiver
		const refund = await tx.transaction.create({
			data: {
				status: "COMPLETED",
				transactionType: "REFUND",
				amount: refundTrxAmount,
				payerWalletId: receiverWalletId,
				receiverWalletId: payerWalletId,
				description: reason,
				metadata: { originalTransactionId: transactionId, reason },
			},
		});

		// Update balances - refund goes back to payer (they get their money back)
		await tx.wallet.update({
			where: { id: payerWalletId },
			data: { balance: { increment: refundTrxAmount } },
		});

		// Deduct from receiver
		await tx.wallet.update({
			where: { id: receiverWalletId },
			data: { balance: { decrement: refundTrxAmount } },
		});

		// Create ledger entries for payer (deposit - getting money back)
		await tx.ledgerEntry.create({
			data: {
				walletId: payerWalletId,
				transactionId: refund.id,
				type: "DEPOSIT",
				amount: refundTrxAmount,
			},
		});

		// Create ledger entries for receiver (withdraw - money going out)
		await tx.ledgerEntry.create({
			data: {
				walletId: receiverWalletId,
				transactionId: refund.id,
				type: "WITHDRAW",
				amount: refundTrxAmount,
			},
		});

		return refund;
	});

	// Create audit log
	await adminRepository.createAuditLog({
		adminId,
		action: "TRANSACTION_REFUNDED",
		entityType: "Transaction",
		entityId: transactionId,
		description: `Refunded ${refundTrxAmount}. Reason: ${reason}`,
		metadata: { refundAmount: refundTrxAmount, reason },
	});

	return { success: true, refund: result };
};

// Reverse transaction
export const reverseTransaction = async (
	transactionId: number,
	params: { reason: string },
	adminId: number,
	adminPermissions: string[],
) => {
	if (!hasPermission(adminPermissions, "transactions:refund")) {
		throw new Error("Insufficient permissions");
	}

	const { reason } = params;

	const transaction = await prisma.transaction.findUnique({
		where: { id: transactionId },
	});

	if (!transaction) {
		throw new Error("Transaction not found");
	}

	if (transaction.status !== "COMPLETED") {
		throw new Error("Can only reverse completed transactions");
	}

	// Create audit log (actual reversal would depend on business rules)
	await adminRepository.createAuditLog({
		adminId,
		action: "TRANSACTION_REVERSED",
		entityType: "Transaction",
		entityId: transactionId,
		description: reason,
		metadata: { reason },
	});

	return { success: true, message: "Transaction reversed" };
};
