import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Wallet } from "@/lib/api/wallet";
import { formatCurrency, formatWalletId } from "@/lib/format";

interface WalletSelectorProps {
	wallets: Wallet[];
	selectedWalletId: string | null;
	onSelect: (walletId: string) => void;
	isLoading?: boolean;
}

function getWalletDisplayName(wallet: Wallet): string {
	if (wallet.name) return wallet.name;
	// Generate a name based on wallet ID if no name
	return `کیف‌ پول ${formatWalletId(wallet.publicId)}`;
}

export function WalletSelector({
	wallets,
	selectedWalletId,
	onSelect,
	isLoading,
}: WalletSelectorProps) {
	if (isLoading) {
		return <div className="h-10 w-full bg-muted animate-pulse rounded-md" />;
	}

	if (wallets.length === 0) {
		return (
			<div className="text-sm text-muted-foreground p-3">
				کیف‌ پولی یافت نشد
			</div>
		);
	}

	return (
		<Select dir="rtl" value={selectedWalletId || ""} onValueChange={onSelect}>
			<SelectTrigger className="w-full">
				<SelectValue placeholder="انتخاب کیف‌ پول" />
			</SelectTrigger>
			<SelectContent>
				{wallets.map((wallet) => (
					<SelectItem key={wallet.publicId} value={wallet.publicId}>
						<div className="flex items-center justify-between w-full gap-4">
							<span>{getWalletDisplayName(wallet)}</span>
							<span className="text-muted-foreground text-sm">
								{formatCurrency(wallet.balance)}
							</span>
						</div>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
