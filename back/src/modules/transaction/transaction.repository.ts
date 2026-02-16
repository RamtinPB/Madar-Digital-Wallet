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
				select: {
					id: true,
					publicId: true,
					user: {
						select: {
							id: true,
							phoneNumber: true,
						},
					},
				},
			},
			receiverWallet: {
				select: {
					id: true,
					publicId: true,
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
	return prisma.transaction.findMany({
		where: {
			OR: [{ payerWalletId: walletId }, { receiverWalletId: walletId }],
		},
		include: {
			payerWallet: {
				select: {
					id: true,
					publicId: true,
					user: {
						select: {
							id: true,
							phoneNumber: true,
						},
					},
				},
			},
			receiverWallet: {
				select: {
					id: true,
					publicId: true,
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

// Get all user transactions across all wallets with filters and pagination
export const findUserTransactions = async (
	userId: number,
	filters: {
		type?: string;
		status?: string;
		walletId?: number;
		fromDate?: string;
		toDate?: string;
		search?: string;
		page?: number;
		limit?: number;
	} = {},
) => {
	const {
		type,
		status,
		walletId,
		fromDate,
		toDate,
		search,
		page = 1,
		limit = 20,
	} = filters;

	// Get user's wallet IDs
	const userWallets = await prisma.wallet.findMany({
		where: { userId },
		select: { id: true },
	});
	const walletIds = userWallets.map((w) => w.id);

	if (walletIds.length === 0) {
		return { transactions: [], total: 0 };
	}

	// Build where clause
	const where: any = {
		OR: [
			{ payerWalletId: { in: walletIds } },
			{ receiverWalletId: { in: walletIds } },
		],
	};

	if (type) {
		where.transactionType = type;
	}

	if (status) {
		where.status = status;
	}

	if (walletId) {
		where.OR = [{ payerWalletId: walletId }, { receiverWalletId: walletId }];
	}

	if (fromDate) {
		where.createdAt = {
			...where.createdAt,
			gte: new Date(fromDate),
		};
	}

	if (toDate) {
		where.createdAt = {
			...where.createdAt,
			lte: new Date(toDate),
		};
	}

	if (search) {
		where.OR = [
			...(where.OR || []),
			{ publicId: { contains: search } },
			{ description: { contains: search } },
		];
	}

	// Get total count
	const total = await prisma.transaction.count({ where });

	// Get transactions with pagination
	const transactions = await prisma.transaction.findMany({
		where,
		include: {
			payerWallet: {
				select: {
					id: true,
					publicId: true,
					user: {
						select: {
							id: true,
							phoneNumber: true,
						},
					},
				},
			},
			receiverWallet: {
				select: {
					id: true,
					publicId: true,
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
		skip: (page - 1) * limit,
		take: limit,
	});

	return { transactions, total };
};
