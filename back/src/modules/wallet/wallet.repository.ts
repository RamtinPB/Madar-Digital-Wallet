import { prisma } from "../../infrastructure/db/prisma.client";

// Create a new wallet for a user
export const createWallet = async (
	userId: number,
	initialBalance: number = 0,
	isPrimary: boolean = false,
) => {
	return prisma.wallet.create({
		data: {
			userId,
			balance: initialBalance,
			primary: isPrimary,
		},
	});
};

// Find wallet by internal ID
export const findWalletById = async (id: number) => {
	return prisma.wallet.findUnique({
		where: { id },
		include: {
			user: {
				select: {
					id: true,
					phoneNumber: true,
					userType: true,
				},
			},
		},
	});
};

// Find wallet by public ID (cuid)
export const findWalletByPublicId = async (publicId: string) => {
	return prisma.wallet.findUnique({
		where: { publicId },
		include: {
			user: {
				select: {
					id: true,
					phoneNumber: true,
					userType: true,
				},
			},
		},
	});
};

// Find all wallets for a user
export const findWalletsByUserId = async (userId: number) => {
	return prisma.wallet.findMany({
		where: { userId },
		orderBy: { createdAt: "asc" },
	});
};

// Update wallet balance (for deposits, withdrawals, etc.)
export const updateWalletBalance = async (id: number, amount: number) => {
	return prisma.wallet.update({
		where: { id },
		data: {
			balance: {
				increment: amount,
			},
		},
	});
};

// Get wallet balance only
export const getWalletBalance = async (id: number) => {
	const wallet = await prisma.wallet.findUnique({
		where: { id },
		select: { balance: true },
	});
	return wallet?.balance;
};

// Set a wallet as primary (transactional: unset all other primary wallets, then set this one)
export const setPrimaryWallet = async (userId: number, walletId: number) => {
	return prisma.$transaction(async (tx) => {
		// First, unset all primary wallets for this user
		await tx.wallet.updateMany({
			where: { userId, primary: true },
			data: { primary: false },
		});

		// Then, set the specified wallet as primary
		const updatedWallet = await tx.wallet.update({
			where: { id: walletId },
			data: { primary: true },
		});

		return updatedWallet;
	});
};
