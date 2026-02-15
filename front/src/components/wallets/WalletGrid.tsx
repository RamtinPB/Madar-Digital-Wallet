"use client";

import { WalletCard } from "./WalletCard";
import type { Wallet } from "@/types/wallet";

interface WalletGridProps {
	wallets: Wallet[];
	onDeposit?: (wallet: Wallet) => void;
	onWithdraw?: (wallet: Wallet) => void;
	onTransfer?: (wallet: Wallet) => void;
	onDelete?: (wallet: Wallet) => void;
}

export function WalletGrid({
	wallets,
	onDeposit,
	onWithdraw,
	onTransfer,
	onDelete,
}: WalletGridProps) {
	if (wallets.length === 0) {
		return null;
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{wallets.map((wallet) => (
				<WalletCard
					key={wallet.id}
					wallet={wallet}
					onDeposit={onDeposit}
					onWithdraw={onWithdraw}
					onTransfer={onTransfer}
					onDelete={onDelete}
					isDefault={wallet.id === 1}
				/>
			))}
		</div>
	);
}
