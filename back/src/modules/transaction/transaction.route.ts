import { t } from "elysia";
import { app } from "../../server";
import * as transactionController from "./transaction.controller";
import { requireAuth } from "../../infrastructure/auth/auth.guard";

export function registerTransactionRoutes(appInstance: typeof app) {
	// Transfer funds between wallets
	appInstance.post("/transaction/transfer", transactionController.transfer, {
		beforeHandle: requireAuth,
		body: t.Object({
			fromWalletId: t.Number(),
			toWalletId: t.Number(),
			amount: t.Number({ minimum: 1 }),
		}),
	});

	// Withdraw funds from wallet
	appInstance.post("/wallet/:id/withdraw", transactionController.withdraw, {
		beforeHandle: requireAuth,
		body: t.Object({
			amount: t.Number({ minimum: 1 }),
		}),
	});

	// Deposit funds to wallet
	appInstance.post("/wallet/:id/deposit", transactionController.deposit, {
		beforeHandle: requireAuth,
		body: t.Object({
			amount: t.Number({ minimum: 1 }),
		}),
	});

	// Get transaction by ID
	appInstance.get("/transaction/:id", transactionController.getTransaction, {
		beforeHandle: requireAuth,
	});

	// Get transaction by public ID
	appInstance.get(
		"/transaction/public/:publicId",
		transactionController.getTransactionByPublicId,
		{
			beforeHandle: requireAuth,
		},
	);

	// Get wallet transaction history
	appInstance.get(
		"/transactions/wallet/:id",
		transactionController.getWalletTransactions,
		{
			beforeHandle: requireAuth,
		},
	);

	// Get wallet ledger entries
	appInstance.get("/ledger/wallet/:id", transactionController.getWalletLedger, {
		beforeHandle: requireAuth,
	});

	// Get all user transactions (across all wallets)
	appInstance.get("/transactions", transactionController.getUserTransactions, {
		beforeHandle: requireAuth,
	});

	// Purchase from business
	appInstance.post("/transaction/purchase", transactionController.purchase, {
		beforeHandle: requireAuth,
		body: t.Object({
			fromWalletId: t.Number(),
			amount: t.Number({ minimum: 1 }),
			otpCode: t.String(),
			productName: t.Optional(t.String()),
			productId: t.Optional(t.String()),
		}),
	});

	// Get transaction receipt
	appInstance.get(
		"/transaction/:id/receipt",
		transactionController.getReceipt,
		{
			beforeHandle: requireAuth,
		},
	);
}
