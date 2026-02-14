import { prisma } from "../../infrastructure/db/prisma.client";

// Create a new transaction
export const createTransaction = async (
	payerWalletId: number,
	receiverWalletId: number | null,
	amount: number,
	transactionType:
		| "TRANSFER"
		| "DEPOSIT"
		| "WITHDRAW"
		| "PURCHASE"
		| "REFUND"
		| "ADMIN_ADJUSTMENT",
) => {
	return prisma.transaction.create({
		data: {
			payerWalletId,
			receiverWalletId,
			amount,
			transactionType,
			status: "PENDING",
		},
	});
};

// Find transaction by ID
export const findTransactionById = async (id: number) => {
	return prisma.transaction.findUnique({
		where: { id },
		include: {
			payerWallet: {
				include: {
					user: {
						select: {
							id: true,
							phoneNumber: true,
						},
					},
				},
			},
			receiverWallet: {
				include: {
					user: {
						select: {
							id: true,
							phoneNumber: true,
						},
					},
				},
			},
		},
	});
};

// Find transaction by public ID
export const findTransactionByPublicId = async (publicId: string) => {
	return prisma.transaction.findUnique({
		where: { publicId },
		include: {
			payerWallet: {
				include: {
					user: {
						select: {
							id: true,
							phoneNumber: true,
						},
					},
				},
			},
			receiverWallet: true,
		},
	});
};

// Update transaction status
export const updateTransactionStatus = async (
	id: number,
	status: "PENDING" | "OTP_VERIFIED" | "COMPLETED" | "FAILED",
) => {
	return prisma.transaction.update({
		where: { id },
		data: { status },
	});
};

// Get transactions for a wallet (as payer or receiver)
export const findTransactionsByWalletId = async (walletId: number) => {
	const asPayer = await prisma.transaction.findMany({
		where: { payerWalletId: walletId },
		include: {
			receiverWallet: {
				include: {
					user: {
						select: {
							id: true,
							phoneNumber: true,
						},
					},
				},
			},
		},
		orderBy: { createdAt: "desc" },
	});

	const asReceiver = await prisma.transaction.findMany({
		where: { receiverWalletId: walletId },
		include: {
			payerWallet: {
				include: {
					user: {
						select: {
							id: true,
							phoneNumber: true,
						},
					},
				},
			},
		},
		orderBy: { createdAt: "desc" },
	});

	// Merge and sort by date
	const allTransactions = [...asPayer, ...asReceiver].sort(
		(a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
	);

	return allTransactions;
};

// Create a ledger entry
export const createLedgerEntry = async (
	walletId: number,
	transactionId: number,
	type: "WITHDRAW" | "DEPOSIT" | "P2P" | "PURCHASE",
	amount: number,
) => {
	return prisma.ledgerEntry.create({
		data: {
			walletId,
			transactionId,
			type,
			amount,
		},
	});
};

// Get ledger entries for a wallet
export const findLedgerEntriesByWalletId = async (walletId: number) => {
	return prisma.ledgerEntry.findMany({
		where: { walletId },
		orderBy: { createdAt: "desc" },
	});
};
