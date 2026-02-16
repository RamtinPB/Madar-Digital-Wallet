import * as transactionService from "./transaction.service";

// Transfer funds between wallets
export const transfer = async (ctx: any) => {
	const body = await ctx.body;
	const { fromWalletId, toWalletId, amount, transferType, description } = body;
	const userId = ctx.user.id;

	if (!fromWalletId || !toWalletId || !amount) {
		ctx.set.status = 400;
		return { error: "fromWalletId, toWalletId, and amount are required" };
	}

	try {
		const result = await transactionService.transferFunds(
			parseInt(fromWalletId),
			parseInt(toWalletId),
			parseFloat(amount),
			userId,
			transferType || "P2P",
			description,
		);
		return result;
	} catch (err: any) {
		ctx.set.status = 400;
		return { error: err.message || "Transfer failed" };
	}
};

// Withdraw funds from wallet
export const withdraw = async (ctx: any) => {
	const walletId = parseInt(ctx.params.id);
	const body = await ctx.body;
	const { amount, description } = body;
	const userId = ctx.user.id;

	if (isNaN(walletId)) {
		ctx.set.status = 400;
		return { error: "Invalid wallet ID" };
	}

	if (!amount || amount <= 0) {
		ctx.set.status = 400;
		return { error: "Valid amount is required" };
	}

	try {
		const result = await transactionService.withdrawFunds(
			walletId,
			parseFloat(amount),
			userId,
			description,
		);
		return result;
	} catch (err: any) {
		ctx.set.status = 400;
		return { error: err.message || "Withdrawal failed" };
	}
};

// Deposit funds to wallet
export const deposit = async (ctx: any) => {
	const walletId = parseInt(ctx.params.id);
	const body = await ctx.body;
	const { amount, description } = body;
	const userId = ctx.user.id;

	if (isNaN(walletId)) {
		ctx.set.status = 400;
		return { error: "Invalid wallet ID" };
	}

	if (!amount || amount <= 0) {
		ctx.set.status = 400;
		return { error: "Valid amount is required" };
	}

	try {
		const result = await transactionService.depositFunds(
			walletId,
			parseFloat(amount),
			userId,
			description,
		);
		return result;
	} catch (err: any) {
		ctx.set.status = 400;
		return { error: err.message || "Deposit failed" };
	}
};

// Get transaction by ID
export const getTransaction = async (ctx: any) => {
	const transactionId = parseInt(ctx.params.id);

	if (isNaN(transactionId)) {
		ctx.set.status = 400;
		return { error: "Invalid transaction ID" };
	}

	try {
		const transaction = await transactionService.getTransaction(transactionId);
		return { transaction };
	} catch (err: any) {
		ctx.set.status = 404;
		return { error: err.message || "Transaction not found" };
	}
};

// Get transaction by public ID
export const getTransactionByPublicId = async (ctx: any) => {
	const publicId = ctx.params.publicId;

	try {
		const transaction =
			await transactionService.getTransactionByPublicId(publicId);
		return { transaction };
	} catch (err: any) {
		ctx.set.status = 404;
		return { error: err.message || "Transaction not found" };
	}
};

// Get wallet transaction history
export const getWalletTransactions = async (ctx: any) => {
	const walletId = parseInt(ctx.params.id);
	const userId = ctx.user.id;

	if (isNaN(walletId)) {
		ctx.set.status = 400;
		return { error: "Invalid wallet ID" };
	}

	try {
		const transactions = await transactionService.getWalletTransactions(
			walletId,
			userId,
		);
		return { transactions };
	} catch (err: any) {
		ctx.set.status = 400;
		return { error: err.message || "Failed to get transactions" };
	}
};

// Get wallet ledger entries
export const getWalletLedger = async (ctx: any) => {
	const walletId = parseInt(ctx.params.id);
	const userId = ctx.user.id;

	if (isNaN(walletId)) {
		ctx.set.status = 400;
		return { error: "Invalid wallet ID" };
	}

	try {
		const ledger = await transactionService.getWalletLedger(walletId, userId);
		return { ledger };
	} catch (err: any) {
		ctx.set.status = 400;
		return { error: err.message || "Failed to get ledger" };
	}
};

// Get all user transactions
export const getUserTransactions = async (ctx: any) => {
	const userId = ctx.user.id;
	const query = ctx.query;

	const filters = {
		type: query.type as string | undefined,
		status: query.status as string | undefined,
		walletId: query.walletId ? parseInt(query.walletId) : undefined,
		fromDate: query.fromDate as string | undefined,
		toDate: query.toDate as string | undefined,
		search: query.search as string | undefined,
		page: query.page ? parseInt(query.page) : 1,
		limit: query.limit ? parseInt(query.limit) : 20,
	};

	try {
		const result = await transactionService.getUserTransactions(
			userId,
			filters,
		);
		return result;
	} catch (err: any) {
		ctx.set.status = 400;
		return { error: err.message || "Failed to get transactions" };
	}
};

// Purchase from business
export const purchase = async (ctx: any) => {
	const body = await ctx.body;
	const { fromWalletId, amount, otpCode, productName, productId } = body;
	const userId = ctx.user.id;

	if (!fromWalletId || !amount || !otpCode) {
		ctx.set.status = 400;
		return { error: "fromWalletId, amount, and otpCode are required" };
	}

	try {
		const result = await transactionService.purchaseFromBusiness(
			parseInt(fromWalletId),
			parseFloat(amount),
			otpCode,
			userId,
			productName,
			productId,
		);
		return result;
	} catch (err: any) {
		ctx.set.status = 400;
		return { error: err.message || "Purchase failed" };
	}
};

// Get transaction receipt
export const getReceipt = async (ctx: any) => {
	const transactionId = parseInt(ctx.params.id);

	if (isNaN(transactionId)) {
		ctx.set.status = 400;
		return { error: "Invalid transaction ID" };
	}

	try {
		const transaction = await transactionService.getTransaction(transactionId);

		if (!transaction) {
			ctx.set.status = 404;
			return { error: "Transaction not found" };
		}

		// Cast to any to access description and metadata fields (if present in DB)
		const tx = transaction as any;

		// Format as receipt
		return {
			transaction,
			receipt: {
				publicId: transaction.publicId,
				amount: transaction.amount,
				type: transaction.transactionType,
				date: transaction.createdAt,
				description: tx.description || null,
				metadata: tx.metadata || null,
			},
		};
	} catch (err: any) {
		ctx.set.status = 404;
		return { error: err.message || "Transaction not found" };
	}
};
