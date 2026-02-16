import * as transactionRepository from "./transaction.repository";
import * as authRepository from "../auth/auth.repository";
import { prisma } from "../../infrastructure/db/prisma.client";

// Helper function to verify wallet ownership
const verifyWalletOwnership = async (walletId: number, userId: number) => {
	const wallet = await prisma.wallet.findUnique({
		where: { id: walletId },
	});

	if (!wallet) {
		throw new Error("Wallet not found");
	}

	if (wallet.userId !== userId) {
		throw new Error("Not authorized to access this wallet");
	}

	return wallet;
};

// TEMPORARY: Find first BUSINESS user
// TODO: Replace with proper business merchant lookup (config, cached, or dedicated endpoint)
const findBusinessUser = async () => {
	const businessUser = await prisma.user.findFirst({
		where: { userType: "BUSINESS" },
		include: { wallets: true },
	});

	if (!businessUser) {
		throw new Error("No business user configured");
	}

	// Find primary wallet, fallback to first wallet
	const primaryWallet = businessUser.wallets.find((w) => w.primary);
	const targetWallet = primaryWallet || businessUser.wallets[0];

	if (!targetWallet) {
		throw new Error("Business user has no wallet");
	}

	return {
		user: businessUser,
		wallet: targetWallet,
	};
};

// Verify OTP for transaction
const verifyOTP = async (
	phoneNumber: string,
	otpCode: string,
): Promise<boolean> => {
	// Find valid OTP for VERIFY_TRANSACTION purpose
	const otpRow = await authRepository.findValidOTP(phoneNumber);
	if (!otpRow) {
		throw new Error("No valid OTP found or OTP expired");
	}

	// Compare OTP using bcrypt
	const bcrypt = await import("bcryptjs");
	const match = await bcrypt.default.compare(otpCode, otpRow.codeHash);
	if (!match) {
		throw new Error("Invalid OTP code");
	}

	// Consume the OTP
	await authRepository.consumeOTP(otpRow.id);

	return true;
};

// Transfer funds between two wallets
export const transferFunds = async (
	payerWalletId: number,
	receiverWalletId: number,
	amount: number,
	userId: number,
	transferType: "OWN_WALLET" | "P2P" = "P2P",
) => {
	// Validate amount
	if (amount <= 0) {
		throw new Error("Amount must be greater than 0");
	}

	// Verify ownership of payer wallet
	await verifyWalletOwnership(payerWalletId, userId);

	// Check if receiver wallet exists
	const receiverWallet = await prisma.wallet.findUnique({
		where: { id: receiverWalletId },
	});

	if (!receiverWallet) {
		throw new Error("Receiver wallet not found");
	}

	// Get payer wallet balance
	const payerWallet = await prisma.wallet.findUnique({
		where: { id: payerWalletId },
	});

	// Check balance
	if (Number(payerWallet!.balance) < amount) {
		throw new Error("Insufficient balance");
	}

	// Use Prisma transaction for atomicity
	const result = await prisma.$transaction(async (tx) => {
		// Create transaction record
		const transaction = await tx.transaction.create({
			data: {
				payerWalletId,
				receiverWalletId,
				amount,
				transactionType: "TRANSFER",
				transferType,
				status: "COMPLETED",
			},
		});

		// Deduct from payer wallet
		await tx.wallet.update({
			where: { id: payerWalletId },
			data: {
				balance: {
					decrement: amount,
				},
			},
		});

		// Add to receiver wallet
		await tx.wallet.update({
			where: { id: receiverWalletId },
			data: {
				balance: {
					increment: amount,
				},
			},
		});

		// Create ledger entry for payer (withdraw)
		await tx.ledgerEntry.create({
			data: {
				walletId: payerWalletId,
				transactionId: transaction.id,
				type: "P2P",
				amount: -amount, // Negative for withdrawal
			},
		});

		// Create ledger entry for receiver (deposit)
		await tx.ledgerEntry.create({
			data: {
				walletId: receiverWalletId,
				transactionId: transaction.id,
				type: "P2P",
				amount: amount,
			},
		});

		return transaction;
	});

	return {
		transaction: result,
		message: `Successfully transferred ${amount} to wallet ${receiverWalletId}`,
	};
};

// Withdraw funds from wallet (to external account)
export const withdrawFunds = async (
	walletId: number,
	amount: number,
	userId: number,
) => {
	// Validate amount
	if (amount <= 0) {
		throw new Error("Amount must be greater than 0");
	}

	// Verify wallet ownership
	await verifyWalletOwnership(walletId, userId);

	// Check if wallet has sufficient balance
	const wallet = await prisma.wallet.findUnique({
		where: { id: walletId },
	});

	if (Number(wallet!.balance) < amount) {
		throw new Error("Insufficient balance");
	}

	// Use Prisma transaction for atomicity
	const result = await prisma.$transaction(async (tx) => {
		// Create transaction record
		const transaction = await tx.transaction.create({
			data: {
				payerWalletId: walletId,
				receiverWalletId: null,
				amount,
				transactionType: "WITHDRAW",
				status: "COMPLETED",
			},
		});

		// Deduct from wallet
		await tx.wallet.update({
			where: { id: walletId },
			data: {
				balance: {
					decrement: amount,
				},
			},
		});

		// Create ledger entry
		await tx.ledgerEntry.create({
			data: {
				walletId,
				transactionId: transaction.id,
				type: "WITHDRAW",
				amount: -amount,
			},
		});

		return transaction;
	});

	return {
		transaction: result,
		message: `Successfully withdrew ${amount} from wallet`,
	};
};

// Deposit funds to wallet (from external source)
export const depositFunds = async (
	walletId: number,
	amount: number,
	userId: number,
) => {
	// Validate amount
	if (amount <= 0) {
		throw new Error("Amount must be greater than 0");
	}

	// Verify wallet ownership
	await verifyWalletOwnership(walletId, userId);

	// Use Prisma transaction for atomicity
	const result = await prisma.$transaction(async (tx) => {
		// Create transaction record
		const transaction = await tx.transaction.create({
			data: {
				payerWalletId: walletId,
				receiverWalletId: walletId,
				amount,
				transactionType: "DEPOSIT",
				status: "COMPLETED",
			},
		});

		// Add to wallet
		await tx.wallet.update({
			where: { id: walletId },
			data: {
				balance: {
					increment: amount,
				},
			},
		});

		// Create ledger entry
		await tx.ledgerEntry.create({
			data: {
				walletId,
				transactionId: transaction.id,
				type: "DEPOSIT",
				amount,
			},
		});

		return transaction;
	});

	return {
		transaction: result,
		message: `Successfully deposited ${amount} to wallet`,
	};
};

// Purchase from business user (product/service payment)
export const purchaseFromBusiness = async (
	fromWalletId: number,
	amount: number,
	otpCode: string,
	userId: number,
	productName?: string,
	productId?: string,
) => {
	// Validate amount
	if (amount <= 0) {
		throw new Error("Amount must be greater than 0");
	}

	if (!otpCode) {
		throw new Error("OTP code is required");
	}

	// 1. Verify wallet ownership and get user info
	const wallet = await prisma.wallet.findUnique({
		where: { id: fromWalletId },
		include: { user: { select: { phoneNumber: true } } },
	});

	if (!wallet) {
		throw new Error("Wallet not found");
	}

	if (wallet.userId !== userId) {
		throw new Error("Not authorized to access this wallet");
	}

	// 2. Verify OTP (get user's phone number from wallet)
	if (!wallet.user.phoneNumber) {
		throw new Error("User phone number not found");
	}
	await verifyOTP(wallet.user.phoneNumber, otpCode);

	// 3. Check wallet balance
	if (Number(wallet.balance) < amount) {
		throw new Error("Insufficient balance");
	}

	// 4. Find business user and wallet
	const business = await findBusinessUser();

	// 5. Create transaction with atomic operation
	const transaction = await prisma.$transaction(async (tx) => {
		// Get current balance for ledger entries
		const currentPayerWallet = await tx.wallet.findUnique({
			where: { id: fromWalletId },
		});
		const currentReceiverWallet = await tx.wallet.findUnique({
			where: { id: business.wallet.id },
		});

		if (!currentPayerWallet || !currentReceiverWallet) {
			throw new Error("Wallet not found");
		}

		// Deduct from payer
		await tx.wallet.update({
			where: { id: fromWalletId },
			data: { balance: { decrement: amount } },
		});

		// Add to receiver (business)
		await tx.wallet.update({
			where: { id: business.wallet.id },
			data: { balance: { increment: amount } },
		});

		// Build transaction data based on available fields
		const txData: any = {
			status: "COMPLETED",
			transactionType: "PURCHASE",
			amount,
			payerWalletId: fromWalletId,
			receiverWalletId: business.wallet.id,
		};

		// Add description if provided
		if (productName) {
			txData.description = productName;
		}

		// Add metadata if provided
		if (productId) {
			txData.metadata = { productId };
		}

		// Create transaction record
		const txRecord = await tx.transaction.create({
			data: txData,
			include: {
				payerWallet: { include: { user: true } },
				receiverWallet: { include: { user: true } },
			},
		});

		// Create ledger entries
		await tx.ledgerEntry.createMany({
			data: [
				{
					walletId: fromWalletId,
					transactionId: txRecord.id,
					type: "PURCHASE",
					amount: -amount,
				},
				{
					walletId: business.wallet.id,
					transactionId: txRecord.id,
					type: "PURCHASE",
					amount,
				},
			],
		});

		return txRecord;
	});

	return {
		transaction,
		message: "Purchase completed successfully",
	};
};

// Get transaction by ID
export const getTransaction = async (transactionId: number) => {
	const transaction =
		await transactionRepository.findTransactionById(transactionId);

	if (!transaction) {
		throw new Error("Transaction not found");
	}

	return transaction;
};

// Get transaction by public ID
export const getTransactionByPublicId = async (publicId: string) => {
	const transaction =
		await transactionRepository.findTransactionByPublicId(publicId);

	if (!transaction) {
		throw new Error("Transaction not found");
	}

	return transaction;
};

// Get transaction history for a wallet
export const getWalletTransactions = async (
	walletId: number,
	userId: number,
) => {
	// Verify wallet ownership
	await verifyWalletOwnership(walletId, userId);

	return transactionRepository.findTransactionsByWalletId(walletId);
};

// Get ledger entries for a wallet
export const getWalletLedger = async (walletId: number, userId: number) => {
	// Verify wallet ownership
	await verifyWalletOwnership(walletId, userId);

	return transactionRepository.findLedgerEntriesByWalletId(walletId);
};

// Get all user transactions with filters and pagination
export const getUserTransactions = async (
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
	const { page = 1, limit = 20 } = filters;

	const { transactions, total } =
		await transactionRepository.findUserTransactions(userId, filters);

	return {
		transactions,
		pagination: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit),
		},
	};
};
