import { app } from "../../server";
import * as walletController from "./wallet.controller";
import { requireAuth } from "../../infrastructure/auth/auth.guard";

export function registerWalletRoutes(appInstance: typeof app) {
	// Create a new wallet (authenticated users only)
	appInstance.post("/wallet", walletController.createWallet, {
		beforeHandle: requireAuth,
	});

	// Get all wallets for authenticated user
	appInstance.get("/wallet", walletController.getUserWallets, {
		beforeHandle: requireAuth,
	});

	// Get wallet by ID
	appInstance.get("/wallet/:id", walletController.getWallet, {
		beforeHandle: requireAuth,
	});

	// Get wallet by public ID
	appInstance.get(
		"/wallet/public/:publicId",
		walletController.getWalletByPublicId,
		{
			beforeHandle: requireAuth,
		},
	);
}
