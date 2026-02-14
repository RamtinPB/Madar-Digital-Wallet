import { useState, useEffect, ReactNode } from "react";
import { MainLayout } from "@/components/MainLayout";
import {
	TotalBalanceCard,
	WalletSelector,
	QuickActions,
	RecentTransactions,
} from "@/components/dashboard";
import {
	getUserWallets,
	getWalletTransactions,
	createWallet,
} from "@/lib/api/wallet";
import type { Wallet, Transaction } from "@/lib/api/wallet";
import { useAuthStore } from "@/stores/auth.store";

export default function Dashboard() {
	const [wallets, setWallets] = useState<Wallet[]>([]);
	const [selectedWalletId, setSelectedWalletId] = useState<string | null>(null);
	const [transactions, setTransactions] = useState<Transaction[]>([]);
	const [isLoadingWallets, setIsLoadingWallets] = useState(true);
	const [isLoadingTransactions, setIsLoadingTransactions] = useState(false);
	const [isCreatingWallet, setIsCreatingWallet] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const { user } = useAuthStore();

	// Fetch wallets on mount
	useEffect(() => {
		fetchWallets();
	}, []);

	// Fetch transactions when selected wallet changes
	useEffect(() => {
		if (selectedWalletId) {
			fetchTransactions(selectedWalletId);
		} else {
			setTransactions([]);
		}
	}, [selectedWalletId]);

	async function fetchWallets() {
		setIsLoadingWallets(true);
		setError(null);
		try {
			const { wallets: userWallets } = await getUserWallets();
			setWallets(userWallets);

			// Auto-select first wallet if none selected
			if (userWallets.length > 0 && !selectedWalletId) {
				setSelectedWalletId(userWallets[0].publicId);
			}
		} catch (err) {
			console.error("Failed to fetch wallets:", err);
			setError("خطا در دریافت کیف‌ پول‌ها");
		} finally {
			setIsLoadingWallets(false);
		}
	}

	async function fetchTransactions(walletPublicId: string) {
		const wallet = wallets.find((w) => w.publicId === walletPublicId);
		if (!wallet) return;

		setIsLoadingTransactions(true);
		try {
			const { transactions: txns } = await getWalletTransactions(wallet.id, 10);
			setTransactions(txns);
		} catch (err) {
			console.error("Failed to fetch transactions:", err);
			setError("خطا در دریافت تراکنش‌ها");
		} finally {
			setIsLoadingTransactions(false);
		}
	}

	async function handleCreateWallet() {
		setIsCreatingWallet(true);
		try {
			const { wallet } = await createWallet();
			setWallets((prev) => [...prev, wallet]);
			setSelectedWalletId(wallet.publicId);
		} catch (err) {
			console.error("Failed to create wallet:", err);
			setError("خطا در ایجاد کیف‌پول");
		} finally {
			setIsCreatingWallet(false);
		}
	}

	function handleWalletSelect(walletId: string) {
		setSelectedWalletId(walletId);
	}

	// Calculate total balance
	const totalBalance = wallets.reduce(
		(sum, w) => sum + parseFloat(w.balance),
		0,
	);

	// Get selected wallet
	const selectedWallet = wallets.find((w) => w.publicId === selectedWalletId);

	// Quick action handlers (placeholder for now)
	const handleDeposit = () => {
		// TODO: Open deposit dialog
		console.log("Deposit");
	};
	const handleWithdraw = () => {
		// TODO: Open withdraw dialog
		console.log("Withdraw");
	};
	const handleTransfer = () => {
		// TODO: Open transfer dialog
		console.log("Transfer");
	};

	return (
		<div className="space-y-6">
			{/* Welcome header */}
			<div>
				<h1 className="text-2xl font-bold">
					{user?.phoneNumber ? `سلام، ${user.phoneNumber} 👋` : "خوش آمدید"}
				</h1>
				<p className="text-muted-foreground">
					به کیف‌ پول الکترونیکی خود خوش آمدید
				</p>
			</div>

			{/* Error message */}
			{error && (
				<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
					{error}
				</div>
			)}

			{/* Total Balance */}
			<TotalBalanceCard
				totalBalance={totalBalance}
				isLoading={isLoadingWallets}
			/>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* Left column - Wallet selector & Quick actions */}
				<div className="md:col-span-1 space-y-6">
					{/* Wallet Selector */}
					<div className="bg-card rounded-lg border p-4">
						<label className="text-sm font-medium mb-2 block">
							انتخاب کیف‌ پول
						</label>
						<WalletSelector
							wallets={wallets}
							selectedWalletId={selectedWalletId}
							onSelect={handleWalletSelect}
							isLoading={isLoadingWallets}
						/>
					</div>

					{/* Quick Actions */}
					<QuickActions
						onDeposit={handleDeposit}
						onWithdraw={handleWithdraw}
						onTransfer={handleTransfer}
						onCreateWallet={handleCreateWallet}
					/>
				</div>

				{/* Right column - Recent Transactions */}
				<div className="md:col-span-2">
					<RecentTransactions
						transactions={transactions}
						currentWalletId={selectedWallet?.id || null}
						isLoading={isLoadingTransactions}
					/>
				</div>
			</div>
		</div>
	);
}

Dashboard.getLayout = function getLayout(page: ReactNode) {
	return <MainLayout>{page}</MainLayout>;
};
